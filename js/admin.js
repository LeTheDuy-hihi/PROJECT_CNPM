/**
 * admin.js - Logic nghiệp vụ trang quản trị (Duyệt đơn, Thống kê doanh thu, Vẽ biểu đồ Canvas)
 * Chuẩn Coding Convention: CamelCase cho tên biến và hàm.
 */

// Hàm khởi chạy Dashboard quản trị
function initAdminDashboard() {
    updateAdminStats();
    renderAdminBookingsTable();
    renderAdminCharts();
}

// ==========================================================================
// THỐNG KÊ DOANH THU & HIỆU SUẤT
// ==========================================================================
function updateAdminStats() {
    const bookings = DataManager.getBookings();
    const courts = DataManager.getCourts();
    const todayStr = getTodayDateString();

    // 1. Tổng doanh thu (Chỉ tính những đơn đã duyệt "approved")
    const approvedBookings = bookings.filter(b => b.status === "approved");
    const totalRevenue = approvedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    document.getElementById("admin-stat-revenue").textContent = `${totalRevenue.toLocaleString("vi-VN")} VNĐ`;

    // 2. Tổng lượt đặt sân (tất cả các trạng thái)
    document.getElementById("admin-stat-count").textContent = bookings.length;

    // 3. Số đơn chờ duyệt
    const pendingBookings = bookings.filter(b => b.status === "pending");
    document.getElementById("admin-stat-pending").textContent = pendingBookings.length;

    // 4. Công suất sử dụng sân hôm nay
    // Tổng số slot của 1 sân = 14 slots. Tổng 4 sân = 56 slots.
    const totalCapacity = courts.length * TIME_SLOTS.length;
    const bookedTodayCount = DataManager.getBookings()
        .filter(b => b.date === todayStr && b.status !== "cancelled")
        .reduce((sum, b) => sum + b.slots.length, 0);
    
    const occupancyRate = totalCapacity > 0 ? Math.round((bookedTodayCount / totalCapacity) * 100) : 0;
    document.getElementById("admin-stat-occupancy").textContent = `${occupancyRate}%`;
}

// ==========================================================================
// DANH SÁCH ĐƠN ĐẶT SÂN PHÍA ADMIN
// ==========================================================================
function renderAdminBookingsTable() {
    const tbody = document.getElementById("admin-table-body");
    if (!tbody) return;

    const bookings = DataManager.getBookings();
    tbody.innerHTML = "";

    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">Chưa có đơn đặt sân nào trên hệ thống.</td></tr>`;
        return;
    }

    bookings.forEach(booking => {
        const tr = document.createElement("tr");

        // Format slot hiển thị
        const slotLabels = booking.slots.map(slotId => {
            const slotObj = TIME_SLOTS.find(s => s.id === slotId);
            return slotObj ? slotObj.label.split(" ")[0] : "";
        });

        // Trạng thái badge
        let statusBadge = "";
        let actionButtons = "";

        if (booking.status === "pending") {
            statusBadge = `<span class="status-badge status-badge--pending">Chờ duyệt</span>`;
            actionButtons = `
                <div class="admin-actions">
                    <button class="btn-approve" onclick="handleAdminApprove('${booking.id}')">Duyệt</button>
                    <button class="btn-reject" onclick="handleAdminReject('${booking.id}')">Từ chối</button>
                </div>
            `;
        } else if (booking.status === "approved") {
            statusBadge = `<span class="status-badge status-badge--approved">Đã duyệt</span>`;
            actionButtons = `
                <button class="btn-cancel" onclick="handleAdminCancel('${booking.id}')">Hủy đơn</button>
            `;
        } else {
            statusBadge = `<span class="status-badge status-badge--cancelled">Đã hủy</span>`;
            actionButtons = `<span style="color:var(--text-muted); font-size:12px;">Đã đóng</span>`;
        }

        // Định dạng thời gian tạo đơn
        const createdDate = new Date(booking.createdAt);
        const createdStr = isNaN(createdDate) 
            ? "Thủ công" 
            : `${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')} ${createdDate.getDate()}/${createdDate.getMonth()+1}`;

        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--primary);">${booking.id}</td>
            <td>
                <div style="font-weight: 600;">${booking.customerName}</div>
                <div style="font-size:11px; color:var(--text-muted);">${booking.customerPhone} | ${booking.customerEmail}</div>
            </td>
            <td>
                <div style="font-weight: 600;">${booking.courtName}</div>
                <div style="font-size:11px; color:var(--text-muted);">Ngày chơi: ${formatDateString(booking.date)}</div>
            </td>
            <td style="font-size:12px;">${createdStr}</td>
            <td style="font-weight: 500;">${slotLabels.join(", ")}</td>
            <td style="font-weight: 700; color: var(--text-white);">${booking.totalPrice.toLocaleString("vi-VN")}đ</td>
            <td>${statusBadge}</td>
            <td>${actionButtons}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Xử lý các thao tác admin
window.handleAdminApprove = function(bookingId) {
    if (DataManager.updateBookingStatus(bookingId, "approved")) {
        showToast(`Đã phê duyệt đơn đặt sân ${bookingId}!`, "success");
        initAdminDashboard();
        // Cập nhật lại danh sách lịch sử của khách hàng nếu đang hiển thị
        if (typeof renderHistoryTable === "function") renderHistoryTable();
    }
};

window.handleAdminReject = function(bookingId) {
    if (confirm(`Bạn có chắc muốn từ chối và hủy bỏ đơn ${bookingId}?`)) {
        if (DataManager.updateBookingStatus(bookingId, "cancelled")) {
            showToast(`Đã từ chối đơn đặt sân ${bookingId}!`, "success");
            initAdminDashboard();
            if (typeof renderHistoryTable === "function") renderHistoryTable();
        }
    }
};

window.handleAdminCancel = function(bookingId) {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn đã duyệt ${bookingId}?`)) {
        if (DataManager.updateBookingStatus(bookingId, "cancelled")) {
            showToast(`Đã hủy thành công đơn ${bookingId}!`, "success");
            initAdminDashboard();
            if (typeof renderHistoryTable === "function") renderHistoryTable();
        }
    }
};

// ==========================================================================
// VẼ BIỂU ĐỒ BẰNG CANVAS (THUẦN - ĐỘ PHÂN GIẢI CAO)
// ==========================================================================
function renderAdminCharts() {
    renderRevenueChart();
    renderBookingStatusChart();
}

// Biểu đồ cột: Doanh thu theo từng sân
function renderRevenueChart() {
    const canvas = document.getElementById("chart-revenue-court");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const bookings = DataManager.getBookings().filter(b => b.status === "approved");
    const courts = DataManager.getCourts();

    // Chuẩn bị dữ liệu vẽ
    const courtData = courts.map(court => {
        const rev = bookings
            .filter(b => b.courtId === court.id)
            .reduce((sum, b) => sum + b.totalPrice, 0);
        return {
            name: court.name.split(" ")[0] + " " + court.name.split(" ")[1], // Lấy chữ ngắn như "Sân số 1"
            revenue: rev
        };
    });

    // Làm sắc nét Canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Xóa khung hình nền
    ctx.clearRect(0, 0, width, height);

    // Cấu hình vẽ trục tọa độ
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Tìm doanh thu lớn nhất để tỉ lệ chiều cao cột
    const maxRev = Math.max(...courtData.map(d => d.revenue), 100000); // Tối thiểu 100k làm mốc

    // Vẽ Grid Lines ngang và nhãn trục Y
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px Outfit, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding + chartHeight - (i / gridLines) * chartHeight;
        const val = (i / gridLines) * maxRev;
        
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        ctx.fillText(formatCompactNumber(val), padding - 10, y);
    }

    // Vẽ các cột dữ liệu
    const colCount = courtData.length;
    const colWidth = (chartWidth / colCount) * 0.5; // Chiều rộng cột = 50% khoảng cách chia
    const colSpacing = chartWidth / colCount;

    courtData.forEach((data, index) => {
        const x = padding + index * colSpacing + (colSpacing - colWidth) / 2;
        const colHeight = (data.revenue / maxRev) * chartHeight;
        const y = padding + chartHeight - colHeight;

        // Vẽ cột (Gradient Emerald Green)
        const gradient = ctx.createLinearGradient(x, y + colHeight, x, y);
        gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
        gradient.addColorStop(1, "rgba(16, 185, 129, 0.85)");

        ctx.fillStyle = gradient;
        // Vẽ cột bo góc nhẹ ở đỉnh
        drawRoundedRect(ctx, x, y, colWidth, colHeight, 6);
        ctx.fill();

        // Vẽ đường viền sáng ở đỉnh cột
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y + 6);
        ctx.arcTo(x, y, x + colWidth, y, 6);
        ctx.arcTo(x + colWidth, y, x + colWidth, y + colHeight, 6);
        ctx.stroke();

        // Nhãn tên sân ở trục X
        ctx.fillStyle = "#f3f4f6";
        ctx.font = "12px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(data.name, x + colWidth / 2, padding + chartHeight + 10);

        // Số doanh thu ghi trên đầu cột
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 11px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(data.revenue > 0 ? formatCompactNumber(data.revenue) : "0đ", x + colWidth / 2, y - 5);
    });
}

// Biểu đồ tròn (Donut): Tỷ lệ đơn đặt theo trạng thái (Duyệt, Chờ duyệt, Hủy)
function renderBookingStatusChart() {
    const canvas = document.getElementById("chart-slots-usage");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const bookings = DataManager.getBookings();

    // Chuẩn bị dữ liệu
    const approvedCount = bookings.filter(b => b.status === "approved").length;
    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
    const total = bookings.length || 1; // tránh chia cho 0

    const statusData = [
        { label: "Đã duyệt", count: approvedCount, color: "#10b981" },
        { label: "Chờ duyệt", count: pendingCount, color: "#f59e0b" },
        { label: "Đã hủy", count: cancelledCount, color: "#ef4444" }
    ];

    // Làm sắc nét Canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    ctx.clearRect(0, 0, width, height);

    // Điểm trung tâm hình tròn
    const centerX = width * 0.38;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX, centerY) * 0.75;
    const innerRadius = outerRadius * 0.6; // Đóng vai trò tạo lỗ ở giữa thành Donut

    let startAngle = -Math.PI / 2; // Bắt đầu ở đỉnh trên cùng

    statusData.forEach(data => {
        const sliceAngle = (data.count / total) * (Math.PI * 2);

        if (sliceAngle > 0) {
            // Vẽ khối tròn Donut
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle, false);
            ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
            ctx.closePath();

            ctx.fillStyle = data.color;
            ctx.fill();

            // Thêm viền tối để tách biệt các cung
            ctx.strokeStyle = "#111827";
            ctx.lineWidth = 2;
            ctx.stroke();

            startAngle += sliceAngle;
        }
    });

    // Vẽ chữ text ở tâm Donut hiển thị tổng số đơn
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bookings.length, centerX, centerY - 6);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Outfit, sans-serif";
    ctx.fillText("Tổng đơn", centerX, centerY + 12);

    // Vẽ chú giải (Legend) bên phải biểu đồ
    const legendX = width * 0.7;
    const legendYStart = centerY - (statusData.length * 20) / 2;

    statusData.forEach((data, index) => {
        const y = legendYStart + index * 24;

        // Vẽ hộp màu vuông nhỏ đại diện
        ctx.fillStyle = data.color;
        drawRoundedRect(ctx, legendX, y - 6, 12, 12, 3);
        ctx.fill();

        // Viết text nhãn
        ctx.fillStyle = "#f3f4f6";
        ctx.font = "12px Outfit, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const percent = Math.round((data.count / total) * 100);
        ctx.fillText(`${data.label}: ${data.count} (${percent}%)`, legendX + 20, y);
    });
}

// Helper: Vẽ hình chữ nhật bo góc
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Helper: Rút gọn số hiển thị (Ví dụ: 120,000 -> 120K)
function formatCompactNumber(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (number >= 1000) {
        return (number / 1000).toFixed(0) + "K";
    }
    return number.toString();
}
