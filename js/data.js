/**
 * data.js - Quản lý dữ liệu và LocalStorage cho Hệ thống Đặt sân Cầu lông Online
 * Chuẩn Coding Convention: CamelCase cho tên biến và hàm.
 */

// Định nghĩa danh sách sân cầu lông
const INITIAL_COURTS = [
    {
        id: "court-1",
        name: "Sân số 1 (Premium VIP)",
        type: "Thảm Hải Yến tiêu chuẩn",
        price: 120000, // giá mỗi giờ (VND)
        image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600",
        description: "Sân VIP thảm PVC cao cấp chống trơn trượt, hệ thống chiếu sáng chuyên nghiệp chống lóa mắt.",
        status: "active" // active, maintenance
    },
    {
        id: "court-2",
        name: "Sân số 2 (Standard)",
        type: "Thảm Enlio tiêu chuẩn",
        price: 100000,
        image: "https://images.unsplash.com/photo-1554068865-24bccd4e34b8?auto=format&fit=crop&q=80&w=600",
        description: "Thích hợp cho tập luyện và giao lưu nhóm. Ánh sáng đầy đủ, không gian thông thoáng.",
        status: "active"
    },
    {
        id: "court-3",
        name: "Sân số 3 (Standard)",
        type: "Thảm Enlio tiêu chuẩn",
        price: 100000,
        image: "https://images.unsplash.com/photo-1521537634180-65dbafd88f47?auto=format&fit=crop&q=80&w=600",
        description: "Sân tiêu chuẩn, độ đàn hồi cao, giảm chấn động tốt cho khớp gối.",
        status: "active"
    },
    {
        id: "court-4",
        name: "Sân số 4 (Training)",
        type: "Sân gỗ tự nhiên",
        price: 80000,
        image: "https://images.unsplash.com/photo-1613918431703-aa58cf09f2b8?auto=format&fit=crop&q=80&w=600",
        description: "Sân tập luyện sàn gỗ tự nhiên, phù hợp cho học viên và các lớp dạy cầu lông.",
        status: "active"
    }
];

// Định nghĩa các khung giờ trong ngày (mỗi slot 1 tiếng)
const TIME_SLOTS = [
    { id: "05-06", label: "05:00 - 06:00" },
    { id: "06-07", label: "06:00 - 07:00" },
    { id: "07-08", label: "07:00 - 08:00" },
    { id: "08-09", label: "08:00 - 09:00" },
    { id: "09-10", label: "09:00 - 10:00" },
    { id: "10-11", label: "10:00 - 11:00" },
    { id: "14-15", label: "14:00 - 15:00" },
    { id: "15-16", label: "15:00 - 16:00" },
    { id: "16-17", label: "16:00 - 17:00" },
    { id: "17-18", label: "17:00 - 18:00" },
    { id: "18-19", label: "18:00 - 19:00" },
    { id: "19-20", label: "19:00 - 20:00" },
    { id: "20-21", label: "20:00 - 21:00" },
    { id: "21-22", label: "21:00 - 22:00" }
];

// Hàm lấy ngày hiện tại định dạng YYYY-MM-DD
function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return `${yyyy}-${mm}-${dd}`;
}

// Hàm lấy ngày mai định dạng YYYY-MM-DD
function getTomorrowDateString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    let mm = tomorrow.getMonth() + 1;
    let dd = tomorrow.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return `${yyyy}-${mm}-${dd}`;
}

// Khởi tạo danh sách các lịch đặt sân mẫu (Mock bookings)
const INITIAL_BOOKINGS = [
    {
        id: "BK-001",
        courtId: "court-1",
        courtName: "Sân số 1 (Premium VIP)",
        date: getTodayDateString(),
        slots: ["17-18", "18-19"],
        customerName: "Nguyễn Văn A",
        customerPhone: "0987654321",
        customerEmail: "nguyenvana@gmail.com",
        totalPrice: 240000,
        status: "approved", // approved, pending, cancelled
        createdAt: new Date().toISOString()
    },
    {
        id: "BK-002",
        courtId: "court-2",
        courtName: "Sân số 2 (Standard)",
        date: getTodayDateString(),
        slots: ["19-20", "20-21"],
        customerName: "Trần Thị B",
        customerPhone: "0912345678",
        customerEmail: "tranb@gmail.com",
        totalPrice: 200000,
        status: "approved",
        createdAt: new Date().toISOString()
    },
    {
        id: "BK-003",
        courtId: "court-1",
        courtName: "Sân số 1 (Premium VIP)",
        date: getTomorrowDateString(),
        slots: ["06-07"],
        customerName: "Phạm Minh C",
        customerPhone: "0933445566",
        customerEmail: "minhc@yahoo.com",
        totalPrice: 120000,
        status: "pending",
        createdAt: new Date().toISOString()
    },
    {
        id: "BK-004",
        courtId: "court-3",
        courtName: "Sân số 3 (Standard)",
        date: getTodayDateString(),
        slots: ["08-09", "09-10"],
        customerName: "Lê Văn D",
        customerPhone: "0909090909",
        customerEmail: "levand@outlook.com",
        totalPrice: 200000,
        status: "cancelled",
        createdAt: new Date().toISOString()
    }
];

// Quản lý lưu trữ LocalStorage
class DataManager {
    static init() {
        if (!localStorage.getItem("courts")) {
            localStorage.setItem("courts", JSON.stringify(INITIAL_COURTS));
        }
        if (!localStorage.getItem("bookings")) {
            localStorage.setItem("bookings", JSON.stringify(INITIAL_BOOKINGS));
        }
    }

    static getCourts() {
        this.init();
        return JSON.parse(localStorage.getItem("courts"));
    }

    static updateCourtStatus(courtId, status) {
        const courts = this.getCourts();
        const court = courts.find(c => c.id === courtId);
        if (court) {
            court.status = status;
            localStorage.setItem("courts", JSON.stringify(courts));
        }
    }

    static getBookings() {
        this.init();
        return JSON.parse(localStorage.getItem("bookings"));
    }

    static saveBooking(booking) {
        const bookings = this.getBookings();
        bookings.unshift(booking); // Thêm vào đầu danh sách
        localStorage.setItem("bookings", JSON.stringify(bookings));
        return booking;
    }

    static updateBookingStatus(bookingId, status) {
        const bookings = this.getBookings();
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = status;
            localStorage.setItem("bookings", JSON.stringify(bookings));
            return true;
        }
        return false;
    }

    static getBookedSlots(courtId, date) {
        const bookings = this.getBookings();
        // Lấy tất cả slot đã đặt và không bị hủy của sân này trong ngày này
        const bookedSlots = [];
        bookings.forEach(b => {
            if (b.courtId === courtId && b.date === date && b.status !== "cancelled") {
                bookedSlots.push(...b.slots);
            }
        });
        return bookedSlots;
    }
}

// Khởi chạy hệ thống dữ liệu ngay khi load file
DataManager.init();
