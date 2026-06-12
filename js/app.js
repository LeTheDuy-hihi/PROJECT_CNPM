/**
 * app.js - Logic nghiệp vụ khách hàng (Đặt sân, Xem sân, Lịch sử)
 * Chuẩn Coding Convention: CamelCase cho tên biến và hàm.
 */

// State quản lý đặt sân hiện tại
let currentBookingState = {
    selectedCourtId: "",
    selectedDate: "",
    selectedSlots: []
};

// Biến lưu trữ đơn đặt sân tạm thời trước khi xác nhận thanh toán
let pendingBooking = null;

// Khởi tạo ứng dụng sau khi DOM load xong
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initHomeView();
    initBookingView();
    initHistoryView();
    updateHomeStats();
});

// ==========================================================================
// TOAST NOTIFICATIONS (Thông báo nổi)
// ==========================================================================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    
    // Icon tùy chọn theo trạng thái
    const icon = type === "success" ? "✓" : "✗";
    
    toast.innerHTML = `
        <span><strong>${icon}</strong> ${message}</span>
        <span style="cursor:pointer; margin-left:12px; font-weight:700;" onclick="this.parentElement.remove()">&times;</span>
    `;
    
    container.appendChild(toast);

    // Tự động xóa sau 3 giây
    setTimeout(() => {
        toast.style.animation = "toastSlideOut 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// ==========================================================================
// NAVIGATION SYSTEM (SPA Tab Switcher)
// ==========================================================================
function initNavigation() {
    const navItems = document.querySelectorAll(".nav__item");
    const views = document.querySelectorAll(".view");

    function switchTab(viewId) {
        // Cập nhật trạng thái active của Menu Nav
        navItems.forEach(item => {
            if (item.getAttribute("data-view") === viewId) {
                item.classList.add("nav__item--active");
            } else {
                item.classList.remove("nav__item--active");
            }
        });

        // Ẩn/Hiện các View
        views.forEach(view => {
            if (view.id === `view-${viewId}`) {
                view.classList.add("view--active");
            } else {
                view.classList.remove("view--active");
            }
        });

        // Kích hoạt các hàm làm mới dữ liệu tương ứng khi chuyển tab
        if (viewId === "history") {
            renderHistoryTable();
        } else if (viewId === "admin") {
            // Kiểm tra xem admin.js đã định nghĩa hàm khởi chạy chưa
            if (typeof initAdminDashboard === "function") {
                initAdminDashboard();
            }
        } else if (viewId === "home") {
            updateHomeStats();
            renderHomeCourts();
        } else if (viewId === "booking") {
            renderBookingCourtsTabs();
            renderTimeSlots();
            updateReceiptSummary();
        }
    }

    // Lắng nghe sự kiện click nav
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetView = item.getAttribute("data-view");
            switchTab(targetView);
        });
    });

    // Logo click quay về Home
    document.getElementById("logo-home").addEventListener("click", (e) => {
        e.preventDefault();
        switchTab("home");
    });

    // Các nút CTA trong Hero Section
    document.getElementById("hero-btn-booking").addEventListener("click", () => {
        switchTab("booking");
    });

    document.getElementById("hero-btn-learn").addEventListener("click", () => {
        // Cuộn xuống danh sách sân
        document.getElementById("section-courts-list").scrollIntoView({ behavior: "smooth" });
    });
}

// ==========================================================================
// VIEW 1: HOME VIEW
// ==========================================================================
function initHomeView() {
    renderHomeCourts();
}

function updateHomeStats() {
    const courts = DataManager.getCourts();
    const bookings = DataManager.getBookings();
    
    // Cập nhật số liệu thống kê ở trang chủ
    document.getElementById("stat-courts-count").textContent = courts.length;
    
    // Đếm tổng số lượt đặt sân hợp lệ (không bị hủy)
    const activeBookingsCount = bookings.filter(b => b.status !== "cancelled").length;
    document.getElementById("stat-bookings-count").textContent = `${activeBookingsCount + 350}+`; // cộng thêm số ảo cho đẹp mắt
}

function renderHomeCourts() {
    const grid = document.getElementById("home-courts-grid");
    if (!grid) return;

    const courts = DataManager.getCourts();
    grid.innerHTML = "";

    courts.forEach(court => {
        const isMaintenance = court.status === "maintenance";
        const badgeHTML = isMaintenance 
            ? `<span class="court-card__badge court-card__badge--maintenance">Đang bảo trì</span>`
            : `<span class="court-card__badge">${court.type}</span>`;
            
        const buttonHTML = isMaintenance
            ? `<button class="court-card__btn" style="cursor:not-allowed; background:rgba(255,255,255,0.02); color:var(--text-muted); border-color:transparent;" disabled>Bảo trì</button>`
            : `<button class="court-card__btn">Đặt ngay</button>`;

        const card = document.createElement("div");
        card.className = "court-card";
        card.innerHTML = `
            <div class="court-card__img-container">
                <img src="${court.image}" alt="${court.name}" class="court-card__img">
                ${badgeHTML}
            </div>
            <div class="court-card__content">
                <h3 class="court-card__title">${court.name}</h3>
                <p class="court-card__desc">${court.description}</p>
                <div class="court-card__footer">
                    <div class="court-card__price">
                        ${court.price.toLocaleString("vi-VN")}đ<span>/giờ</span>
                    </div>
                    ${buttonHTML}
                </div>
            </div>
        `;

        // Sự kiện đặt sân khi click card
        if (!isMaintenance) {
            card.querySelector(".court-card__btn").addEventListener("click", () => {
                currentBookingState.selectedCourtId = court.id;
                currentBookingState.selectedSlots = []; // Reset slots
                
                // Chuyển sang tab Booking
                document.getElementById("nav-booking").click();
            });
        }

        grid.appendChild(card);
    });
}

// ==========================================================================
// VIEW 2: BOOKING VIEW (Chức năng cốt lõi)
// ==========================================================================
function initBookingView() {
    const dateInput = document.getElementById("booking-date");
    
    // Thiết lập giới hạn ngày chọn (Từ hôm nay đến 7 ngày tới)
    const todayStr = getTodayDateString();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    dateInput.min = todayStr;
    dateInput.max = maxDateStr;
    
    // Mặc định chọn hôm nay nếu chưa chọn ngày
    if (!currentBookingState.selectedDate) {
        currentBookingState.selectedDate = todayStr;
    }
    dateInput.value = currentBookingState.selectedDate;

    // Lắng nghe đổi ngày
    dateInput.addEventListener("change", (e) => {
        currentBookingState.selectedDate = e.target.value;
        currentBookingState.selectedSlots = []; // Reset slot khi đổi ngày
        renderTimeSlots();
        updateReceiptSummary();
    });

    // Cấu hình Modal thanh toán
    const modal = document.getElementById("payment-modal");
    const closeBtn = document.getElementById("payment-modal-close");
    const confirmBtn = document.getElementById("btn-payment-confirm");

    closeBtn.addEventListener("click", () => {
        modal.classList.remove("modal--active");
    });

    confirmBtn.addEventListener("click", () => {
        confirmPaymentAndSave();
    });

    // Form submit đặt sân
    const form = document.getElementById("booking-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        processBookingSubmit();
    });
}

// Render các tabs sân ở trang Booking
function renderBookingCourtsTabs() {
    const tabContainer = document.getElementById("booking-court-tabs");
    if (!tabContainer) return;

    const courts = DataManager.getCourts();
    tabContainer.innerHTML = "";

    // Nếu chưa chọn sân nào, mặc định chọn sân đầu tiên hoạt động
    if (!currentBookingState.selectedCourtId) {
        const activeCourt = courts.find(c => c.status === "active");
        currentBookingState.selectedCourtId = activeCourt ? activeCourt.id : courts[0].id;
    }

    courts.forEach(court => {
        const isMaintenance = court.status === "maintenance";
        const isSelected = currentBookingState.selectedCourtId === court.id;
        
        const tabBtn = document.createElement("button");
        tabBtn.className = `court-tab-btn ${isSelected ? "court-tab-btn--active" : ""}`;
        if (isMaintenance) {
            tabBtn.style.opacity = "0.5";
            tabBtn.style.cursor = "not-allowed";
        }

        tabBtn.innerHTML = `
            <span class="court-tab-btn__name">${court.name} ${isMaintenance ? "(Bảo trì)" : ""}</span>
            <span class="court-tab-btn__price">${court.price.toLocaleString("vi-VN")}đ/giờ</span>
        `;

        if (!isMaintenance) {
            tabBtn.addEventListener("click", () => {
                currentBookingState.selectedCourtId = court.id;
                currentBookingState.selectedSlots = []; // Reset slots khi đổi sân
                
                // Render lại tabs hoạt động
                document.querySelectorAll(".court-tab-btn").forEach(btn => {
                    btn.classList.remove("court-tab-btn--active");
                });
                tabBtn.classList.add("court-tab-btn--active");
                
                renderTimeSlots();
                updateReceiptSummary();
            });
        }

        tabContainer.appendChild(tabBtn);
    });
}

// Render lưới khung giờ trống / đã đặt
function renderTimeSlots() {
    const grid = document.getElementById("booking-slots-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const courtId = currentBookingState.selectedCourtId;
    const date = currentBookingState.selectedDate;

    if (!courtId || !date) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">Vui lòng chọn đầy đủ sân và ngày để xem khung giờ.</p>`;
        return;
    }

    // Lấy danh sách slot đã được đặt (Approved & Pending) của sân trong ngày đó
    const bookedSlots = DataManager.getBookedSlots(courtId, date);

    TIME_SLOTS.forEach(slot => {
        const isBooked = bookedSlots.includes(slot.id);
        const isSelected = currentBookingState.selectedSlots.includes(slot.id);

        const slotBtn = document.createElement("div");
        slotBtn.className = "slot";
        if (isBooked) slotBtn.classList.add("slot--booked");
        if (isSelected) slotBtn.classList.add("slot--selected");

        slotBtn.textContent = slot.label;

        if (!isBooked) {
            slotBtn.addEventListener("click", () => {
                toggleSlotSelection(slot.id);
            });
        }

        grid.appendChild(slotBtn);
    });
}

// Bật tắt chọn khung giờ
function toggleSlotSelection(slotId) {
    const slots = currentBookingState.selectedSlots;
    const index = slots.indexOf(slotId);

    if (index > -1) {
        slots.splice(index, 1); // Bỏ chọn
    } else {
        slots.push(slotId); // Chọn thêm
    }

    renderTimeSlots();
    updateReceiptSummary();
}

// Cập nhật hóa đơn tóm tắt ở sidebar
function updateReceiptSummary() {
    const courts = DataManager.getCourts();
    const court = courts.find(c => c.id === currentBookingState.selectedCourtId);

    const courtNameEl = document.getElementById("receipt-court-name");
    const dateEl = document.getElementById("receipt-date");
    const slotsEl = document.getElementById("receipt-slots");
    const priceHourEl = document.getElementById("receipt-price-hour");
    const totalPriceEl = document.getElementById("receipt-total-price");

    if (!court) return;

    courtNameEl.textContent = court.name;
    dateEl.textContent = formatDateString(currentBookingState.selectedDate);
    priceHourEl.textContent = `${court.price.toLocaleString("vi-VN")}đ/giờ`;

    const selectedCount = currentBookingState.selectedSlots.length;
    if (selectedCount > 0) {
        // Sắp xếp slot theo thứ tự thời gian tăng dần
        const sortedSlots = [...currentBookingState.selectedSlots].sort();
        const slotLabels = sortedSlots.map(id => {
            const slotObj = TIME_SLOTS.find(s => s.id === id);
            return slotObj ? slotObj.label.split(" - ")[0] : ""; // chỉ hiển thị giờ bắt đầu để gọn
        });
        slotsEl.textContent = `${slotLabels.join(", ")} (${selectedCount} giờ)`;
        
        const total = selectedCount * court.price;
        totalPriceEl.textContent = `${total.toLocaleString("vi-VN")}đ`;
    } else {
        slotsEl.textContent = "Chưa chọn khung giờ";
        totalPriceEl.textContent = "0đ";
    }
}

// Xử lý nộp form đặt sân
function processBookingSubmit() {
    if (currentBookingState.selectedSlots.length === 0) {
        showToast("Vui lòng chọn ít nhất một khung giờ trống trước khi đặt sân!", "error");
        return;
    }

    const courts = DataManager.getCourts();
    const court = courts.find(c => c.id === currentBookingState.selectedCourtId);
    if (!court) return;

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const email = document.getElementById("cust-email").value.trim();

    if (!name || !phone || !email) {
        showToast("Vui lòng điền đầy đủ thông tin khách hàng!", "error");
        return;
    }

    // Tạo mã đơn đặt hàng ngẫu nhiên BK-XXXXX
    const randomCode = "BK-" + Math.floor(10000 + Math.random() * 90000);
    const totalPrice = currentBookingState.selectedSlots.length * court.price;

    // Lưu dữ liệu vào biến tạm pendingBooking
    pendingBooking = {
        id: randomCode,
        courtId: court.id,
        courtName: court.name,
        date: currentBookingState.selectedDate,
        slots: [...currentBookingState.selectedSlots],
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        totalPrice: totalPrice,
        status: "pending", // mặc định chờ duyệt chuyển khoản
        createdAt: new Date().toISOString()
    };

    // Mở Modal Thanh Toán
    const modal = document.getElementById("payment-modal");
    document.getElementById("payment-amount").textContent = `${totalPrice.toLocaleString("vi-VN")}đ`;
    document.getElementById("payment-ref-code").textContent = `BPRO ${randomCode}`;
    modal.classList.add("modal--active");
}

// Xác nhận chuyển tiền thành công
function confirmPaymentAndSave() {
    if (!pendingBooking) return;

    // Lưu vào LocalStorage
    DataManager.saveBooking(pendingBooking);

    // Đóng Modal
    document.getElementById("payment-modal").classList.remove("modal--active");

    // Thông báo thành công
    showToast(`Đặt sân thành công! Mã đơn: ${pendingBooking.id}. Đơn hàng đang chờ duyệt.`, "success");

    // Reset state và form nhập liệu
    currentBookingState.selectedSlots = [];
    document.getElementById("cust-name").value = "";
    document.getElementById("cust-phone").value = "";
    document.getElementById("cust-email").value = "";

    // Đồng bộ lại UI
    renderTimeSlots();
    updateReceiptSummary();

    // Chuyển hướng sang Tab Lịch Sử
    document.getElementById("nav-history").click();
    
    // Clear dữ liệu tạm
    pendingBooking = null;
}

// ==========================================================================
// VIEW 3: HISTORY VIEW (Lịch sử đặt sân)
// ==========================================================================
function initHistoryView() {
    renderHistoryTable();
}

function renderHistoryTable() {
    const tbody = document.getElementById("history-table-body");
    const emptyState = document.getElementById("history-empty-state");
    const table = document.getElementById("history-table");

    if (!tbody) return;

    const bookings = DataManager.getBookings();

    if (bookings.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    table.style.display = "table";
    emptyState.style.display = "none";
    tbody.innerHTML = "";

    bookings.forEach(booking => {
        const tr = document.createElement("tr");

        // Format slot hiển thị
        const slotLabels = booking.slots.map(slotId => {
            const slotObj = TIME_SLOTS.find(s => s.id === slotId);
            return slotObj ? slotObj.label.split(" ")[0] : "";
        });

        // Badge trạng thái
        let statusBadge = "";
        if (booking.status === "approved") {
            statusBadge = `<span class="status-badge status-badge--approved">Đã duyệt</span>`;
        } else if (booking.status === "pending") {
            statusBadge = `<span class="status-badge status-badge--pending">Chờ duyệt</span>`;
        } else {
            statusBadge = `<span class="status-badge status-badge--cancelled">Đã hủy</span>`;
        }

        // Nút hủy đơn (chỉ cho phép khi ở trạng thái chờ duyệt hoặc đã duyệt)
        const canCancel = booking.status !== "cancelled";
        const actionButton = canCancel 
            ? `<button class="btn-cancel" onclick="handleCancelBooking('${booking.id}')">Hủy sân</button>` 
            : `<span style="color:var(--text-muted); font-size:12px;">Không khả dụng</span>`;

        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--primary);">${booking.id}</td>
            <td>
                <div style="font-weight: 600;">${booking.courtName}</div>
                <div style="font-size:12px; color:var(--text-muted);">${booking.customerName} - ${booking.customerPhone}</div>
            </td>
            <td>${formatDateString(booking.date)}</td>
            <td>${slotLabels.join(", ")}</td>
            <td style="font-weight: 600;">${booking.totalPrice.toLocaleString("vi-VN")}đ</td>
            <td>${statusBadge}</td>
            <td>${actionButton}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Xử lý khi khách bấm Hủy Sân
window.handleCancelBooking = function(bookingId) {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn đặt sân ${bookingId}? Lịch đặt sẽ được giải phóng.`)) {
        const success = DataManager.updateBookingStatus(bookingId, "cancelled");
        if (success) {
            showToast(`Đã hủy thành công đơn đặt sân ${bookingId}!`, "success");
            renderHistoryTable();
            // Nếu admin dashboard đang mở thì đồng bộ luôn
            if (typeof initAdminDashboard === "function") {
                initAdminDashboard();
            }
        } else {
            showToast("Hủy đơn thất bại. Vui lòng liên hệ hỗ trợ.", "error");
        }
    }
};

// ==========================================================================
// UTILITY FUNCTIONS (Hàm tiện ích bổ trợ)
// ==========================================================================
function formatDateString(dateStr) {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
}
