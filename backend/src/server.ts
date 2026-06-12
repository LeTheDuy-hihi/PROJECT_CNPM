import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;
const JWT_SECRET = 'your-super-secret-key'; // Trong thực tế nên dùng biến môi trường (.env)

app.use(cors());
app.use(express.json());

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
  }

  try {
    const existingCustomer = await prisma.customer.findUnique({ where: { phone } });
    if (existingCustomer) {
      if (existingCustomer.password) {
        return res.status(400).json({ error: 'Số điện thoại này đã được đăng ký' });
      }
      // Nếu khách hàng đã tồn tại nhưng chưa có pass (do đặt sân lúc chưa đăng ký) -> Cập nhật pass
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.customer.update({
        where: { phone },
        data: { password: hashedPassword, name }
      });
      return res.status(200).json({ message: 'Tạo tài khoản thành công', user: { id: updatedUser.id, name: updatedUser.name, phone: updatedUser.phone } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.customer.create({
      data: { name, phone, password: hashedPassword }
    });

    res.status(201).json({ message: 'Đăng ký thành công', user: { id: newUser.id, name: newUser.name, phone: newUser.phone } });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    // Tài khoản Admin cố định
    if (phone === 'admin@gmail.com' && password === 'admin123') {
      const token = jwt.sign({ id: 0, phone: 'admin@gmail.com', role: 'ADMIN' }, JWT_SECRET, { expiresIn: '1d' });
      return res.json({ message: 'Đăng nhập Admin thành công', token, user: { id: 0, name: 'Quản trị viên', phone: 'admin@gmail.com', role: 'ADMIN' } });
    }

    const user = await prisma.customer.findUnique({ where: { phone } });
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Tài khoản không tồn tại hoặc sai thông tin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Mật khẩu không chính xác' });
    }

    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Đăng nhập thành công', token, user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});
// --- END AUTH ROUTES ---

// Lấy danh sách tất cả các sân
app.get('/api/courts', async (req, res) => {
  try {
    const courts = await prisma.court.findMany();
    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courts' });
  }
});

// Logic đặt sân
app.post('/api/bookings', async (req, res) => {
  const { courtId, customerName, customerPhone, startTime, endTime } = req.body;

  try {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Kiểm tra trùng lịch (Concurrency Check)
    // Sân đang có người đặt trong khoảng thời gian bị giao nhau không?
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        courtId: Number(courtId),
        status: { in: ['BOOKED', 'IN_USE'] },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ 
        error: 'Sân đã được đặt trong khoảng thời gian này. Vui lòng chọn giờ khác.' 
      });
    }

    // 2. Tìm hoặc Tạo Khách hàng
    let customer = await prisma.customer.findUnique({
      where: { phone: customerPhone }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: { name: customerName, phone: customerPhone }
      });
    }

    // 3. Lấy thông tin sân để tính tiền
    const court = await prisma.court.findUnique({ where: { id: Number(courtId) } });
    if (!court) {
      return res.status(404).json({ error: 'Không tìm thấy sân' });
    }

    const hours = Math.abs(end.getTime() - start.getTime()) / 36e5;
    const totalPrice = hours * court.pricePerHour;

    // 4. Tạo Booking
    const newBooking = await prisma.booking.create({
      data: {
        courtId: Number(courtId),
        customerId: customer.id,
        startTime: start,
        endTime: end,
        totalPrice: totalPrice,
        status: 'BOOKED'
      }
    });

    res.status(201).json({ message: 'Đặt sân thành công!', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi đặt sân' });
  }
});

// --- ADMIN APIs ---
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        court: true,
        customer: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        bookings: true
      },
      orderBy: { id: 'desc' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalCourts = await prisma.court.count();
    const totalCustomers = await prisma.customer.count();
    
    const bookings = await prisma.booking.findMany();
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    // Tính doanh thu theo ngày (7 ngày gần nhất)
    const today = new Date();
    const revenueByDay = Array.from({length: 7}).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dailyRevenue = bookings
        .filter(b => b.createdAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, b) => sum + b.totalPrice, 0);
      return {
        date: dateStr.split('-').slice(1).join('/'),
        revenue: dailyRevenue
      };
    });

    res.json({
      totalCourts,
      totalCustomers,
      totalBookings,
      totalRevenue,
      revenueByDay
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
// --- END ADMIN APIs ---

// Khởi tạo một số sân mẫu (Seed Data)
app.post('/api/seed', async (req, res) => {
  try {
    await prisma.booking.deleteMany();
    await prisma.court.deleteMany();
    await prisma.customer.deleteMany();

    await prisma.court.createMany({
      data: [
        { name: 'Sân 1 (Thảm xịn)', pricePerHour: 80000, status: 'AVAILABLE' },
        { name: 'Sân 2 (Tiêu chuẩn)', pricePerHour: 60000, status: 'AVAILABLE' },
        { name: 'Sân 3 (Góc trong)', pricePerHour: 60000, status: 'AVAILABLE' },
        { name: 'Sân 4 (Gần cửa)', pricePerHour: 60000, status: 'MAINTENANCE' },
        { name: 'Sân 5 (Trung tâm)', pricePerHour: 90000, status: 'AVAILABLE' },
        { name: 'Sân 6 (VIP)', pricePerHour: 100000, status: 'AVAILABLE' },
        { name: 'Sân 7 (Tiêu chuẩn)', pricePerHour: 60000, status: 'AVAILABLE' },
        { name: 'Sân 8 (Tiêu chuẩn)', pricePerHour: 60000, status: 'AVAILABLE' },
        { name: 'Sân 9 (Tập luyện)', pricePerHour: 50000, status: 'AVAILABLE' },
        { name: 'Sân 10 (Góc khuất)', pricePerHour: 50000, status: 'MAINTENANCE' },
        { name: 'Sân 11 (VIP 2)', pricePerHour: 100000, status: 'AVAILABLE' },
        { name: 'Sân 12 (Chuẩn thi đấu)', pricePerHour: 120000, status: 'AVAILABLE' },
        { name: 'Sân 13 (Tập luyện)', pricePerHour: 50000, status: 'AVAILABLE' },
        { name: 'Sân 14 (Tập luyện)', pricePerHour: 50000, status: 'AVAILABLE' },
        { name: 'Sân 15 (Bảo trì định kỳ)', pricePerHour: 60000, status: 'MAINTENANCE' },
      ]
    });
    res.json({ message: 'Đã tạo dữ liệu sân mẫu!' });
  } catch (error) {
    res.status(500).json({ error: 'Đã có dữ liệu' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});
