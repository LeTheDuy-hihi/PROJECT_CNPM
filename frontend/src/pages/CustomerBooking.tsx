import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Star, Calendar as CalendarIcon, User, Phone, CheckCircle, XCircle, ArrowLeft, Hash, Tag, Info, AlertTriangle, Calculator } from 'lucide-react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';

const API_URL = 'http://localhost:3000/api';

const CustomerBooking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
  
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch court details
    axios.get(`${API_URL}/courts`)
      .then(res => {
        const foundCourt = res.data.find((c: any) => c.id === Number(id));
        if (foundCourt) {
          setCourt(foundCourt);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Tự động tính toán chi phí (Real-time calculation)
  const calculation = useMemo(() => {
    if (!bookingDate || !startTimeStr || !endTimeStr || !court) return null;

    const start = new Date(`${bookingDate}T${startTimeStr}`);
    const end = new Date(`${bookingDate}T${endTimeStr}`);
    
    // Nếu giờ kết thúc nhỏ hơn giờ bắt đầu, hoặc bằng nhau -> Không hợp lệ
    if (end <= start) {
      return { error: 'Giờ kết thúc phải lớn hơn giờ bắt đầu' };
    }

    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return {
      hours: diffHours,
      price: court.pricePerHour,
      total: diffHours * court.pricePerHour,
      startISO: start.toISOString(),
      endISO: end.toISOString()
    };
  }, [bookingDate, startTimeStr, endTimeStr, court]);

  const handleCancel = () => {
    setCustomerName('');
    setCustomerPhone('');
    setBookingDate('');
    setStartTimeStr('');
    setEndTimeStr('');
    setBookingError('');
  };

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingError('');

    if (calculation?.error) {
      setBookingError(calculation.error);
      return;
    }

    if (!calculation) {
      setBookingError('Vui lòng chọn đầy đủ ngày giờ thuê.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}/bookings`, {
        courtId: Number(id),
        customerName,
        customerPhone,
        startTime: calculation.startISO,
        endTime: calculation.endISO
      });

      // setBookingMessage('Hệ thống đã xác nhận sân còn trống và ghi nhận thành công!');
      // setShowQR(true);
      navigate(`/payment/${res.data.booking.id}`);
      
    } catch (error: any) {
      if (error.response && error.response.data) {
        setBookingError(`Sân đã bị trùng lịch: ${error.response.data.error}`);
      } else {
        setBookingError('Đã có lỗi xảy ra khi kiểm tra lịch. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <CustomerNavbar />
        <div className="text-center py-20 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy sân</h2>
          <button onClick={() => navigate('/courts')} className="text-emerald-600 font-bold hover:underline">
            Quay lại danh sách sân
          </button>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <CustomerNavbar />

      <div className="pt-24 pb-12 px-6 flex-1 max-w-7xl mx-auto w-full">
        {/* Nút quay lại */}
        <button 
          onClick={() => navigate('/courts')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-semibold mb-6 transition-colors px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách sân
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KHU VỰC THÔNG TIN SÂN */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              {/* Hình ảnh sân */}
              <div className="relative">
                <img 
                  src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80&sig=${court.id}`} 
                  alt={court.name} 
                  className="w-full h-[350px] object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-black px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-emerald-600" /> MÃ SÂN: {court.id}
                  </span>
                  <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 uppercase">
                    <Tag className="w-4 h-4" /> Loại: {court.id % 2 === 0 ? 'VIP' : 'Thường'}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{court.name}</h1>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                      <MapPin className="w-4 h-4" /> Quận Cầu Giấy, Hà Nội
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-2 rounded-xl text-center">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Giá thuê</p>
                    <p className="font-extrabold text-xl whitespace-nowrap">{court.pricePerHour.toLocaleString()}đ<span className="text-sm font-semibold">/giờ</span></p>
                  </div>
                </div>
                
                {/* Tình trạng hiện tại */}
                <div className="flex items-center gap-3 py-4 border-y border-slate-100 my-6">
                  <span className="text-sm font-semibold text-slate-600 uppercase">Tình trạng hiện tại:</span>
                  {court.status === 'AVAILABLE' ? (
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Còn trống
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span> Đang bảo trì
                    </span>
                  )}
                </div>

                {/* Mô tả sân */}
                <div className="space-y-3 text-slate-600 leading-relaxed">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Info className="w-5 h-5 text-emerald-500" /> Mô tả sân</h3>
                  <p>Hệ thống sân {court.name} đạt tiêu chuẩn thi đấu quốc gia. Cung cấp thảm PVC chống trượt cao cấp, hệ thống chiếu sáng LED không chói mắt chuyên dụng cho cầu lông.</p>
                  <p>Được vệ sinh thảm mỗi ngày. Trang bị ghế ngồi, tủ đồ và bình nước lọc miễn phí.</p>
                </div>
              </div>
            </div>
          </div>

          {/* KHU VỰC CHỌN THỜI GIAN & TÍNH TIỀN & XÁC NHẬN */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-emerald-600" /> Tiến hành đặt sân
              </h2>

              {!showQR ? (
                <form onSubmit={submitBooking} className="space-y-6">
                  {bookingError && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm flex items-start gap-3 font-medium border border-red-200 animate-in fade-in duration-300">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> {bookingError}
                    </div>
                  )}

                  {/* Thông tin cá nhân */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500" /> Tên người đặt
                      </label>
                      <input 
                        type="text" required
                        value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" /> Số điện thoại
                      </label>
                      <input 
                        type="tel" required
                        value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                        placeholder="09xx xxx xxx"
                      />
                    </div>
                  </div>

                  {/* Khu vực chọn thời gian */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-emerald-600" /> Lựa chọn thời gian</h3>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ngày thuê</label>
                      <input 
                        type="date" required min={new Date().toISOString().split('T')[0]}
                        value={bookingDate} onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giờ bắt đầu</label>
                        <input 
                          type="time" required
                          value={startTimeStr} onChange={(e) => setStartTimeStr(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Giờ kết thúc</label>
                        <input 
                          type="time" required
                          value={endTimeStr} onChange={(e) => setEndTimeStr(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Khu vực tính tiền */}
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 text-sm flex items-center gap-2 mb-4">
                      <Calculator className="w-4 h-4" /> Tổng chi phí thuê sân
                    </h3>
                    
                    {calculation && !calculation.error ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-emerald-700">
                          <span>Số giờ thuê:</span>
                          <span className="font-bold">{calculation.hours.toFixed(1)} giờ</span>
                        </div>
                        <div className="flex justify-between text-sm text-emerald-700">
                          <span>Đơn giá:</span>
                          <span className="font-bold">{calculation.price.toLocaleString()}đ / giờ</span>
                        </div>
                        <div className="border-t border-emerald-200 my-2 pt-2 flex justify-between items-center">
                          <span className="font-bold text-emerald-800">THÀNH TIỀN:</span>
                          <span className="font-black text-2xl text-emerald-600">{calculation.total.toLocaleString()}đ</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-emerald-600/70 italic text-center py-4">
                        Vui lòng chọn hợp lệ ngày và giờ để tính tiền.
                      </div>
                    )}
                  </div>

                  {/* Khu vực xác nhận */}
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" onClick={handleCancel}
                      className="w-1/3 px-4 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || court.status !== 'AVAILABLE' || !calculation || !!calculation.error}
                      className="w-2/3 px-4 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Đang kiểm tra...' : 'Xác nhận đặt sân'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-emerald-600 mb-3">Thành công!</h3>
                  <p className="text-slate-600 mb-8 font-medium">{bookingMessage}</p>
                  
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-8">
                    <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Quét mã để thanh toán ngay</p>
                    <img 
                      src={`https://api.vietqr.io/image/970422-00000000000-nJ2d6oE.jpg?amount=${calculation?.total}&addInfo=THANH TOAN SAN ${court.id}`}
                      alt="VietQR"
                      className="w-56 h-56 mx-auto rounded-2xl shadow-md border border-white"
                    />
                    <div className="mt-6 p-4 bg-white rounded-xl border border-slate-100">
                      <p className="text-sm font-medium text-slate-600 flex justify-between mb-1">
                        <span>Số tiền cần chuyển:</span> 
                        <span className="font-bold text-emerald-600">{calculation?.total?.toLocaleString()}đ</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-2 italic">* Giao dịch sẽ được hệ thống kiểm tra và tự động xác nhận trong 1-3 phút.</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/courts')}
                    className="w-full px-4 py-4 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                  >
                    Quay về danh sách sân
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default CustomerBooking;
