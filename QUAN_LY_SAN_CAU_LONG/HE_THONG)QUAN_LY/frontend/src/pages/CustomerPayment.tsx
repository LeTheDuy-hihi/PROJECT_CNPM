import api from '../api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Banknote, FileText, CheckCircle, ArrowLeft, Receipt, ChevronRight } from 'lucide-react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';


const CustomerPayment = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('banking'); // banking, wallet, cash
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch all bookings and find the correct one
    api.get(`/bookings`)
      .then(res => {
        const found = res.data.find((b: any) => b.id === Number(bookingId));
        if (found) {
          setBooking(found);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [bookingId]);

  const handlePayment = () => {
    setIsProcessing(true);
    // Giả lập gọi API thanh toán
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <CustomerNavbar />
        <div className="text-center py-20 flex-1 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Không tìm thấy đơn hàng</h2>
          <button onClick={() => navigate('/courts')} className="text-emerald-600 font-bold hover:underline">
            Quay lại danh sách sân
          </button>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const dateStr = start.toLocaleDateString('vi-VN');
  const startTimeStr = start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <CustomerNavbar />

      <div className="pt-24 pb-12 px-6 flex-1 max-w-7xl mx-auto w-full">
        {!isSuccess ? (
          <>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 font-semibold">
              <span onClick={() => navigate('/courts')} className="hover:text-emerald-600 cursor-pointer transition-colors">Danh sách sân</span>
              <ChevronRight className="w-4 h-4" />
              <span onClick={() => navigate(`/booking/${booking.courtId}`)} className="hover:text-emerald-600 cursor-pointer transition-colors">Đặt sân</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-emerald-600">Thanh toán</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-emerald-600" /> Hoàn tất thanh toán
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* CỘT TRÁI: THÔNG TIN ĐƠN HÀNG VÀ CHỌN PHƯƠNG THỨC */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Khu vực thông tin đơn hàng */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <FileText className="w-5 h-5 text-emerald-500" /> Khu vực thông tin đơn hàng
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-slate-500">Mã đơn đặt sân:</div>
                    <div className="font-bold text-slate-900 text-right">#{booking.id.toString().padStart(6, '0')}</div>
                    
                    <div className="text-slate-500">Họ tên khách hàng:</div>
                    <div className="font-bold text-slate-900 text-right">{booking.customer.name}</div>
                    
                    <div className="text-slate-500">Tên sân:</div>
                    <div className="font-bold text-emerald-600 text-right">{booking.court.name}</div>
                    
                    <div className="text-slate-500">Ngày thuê:</div>
                    <div className="font-bold text-slate-900 text-right">{dateStr}</div>
                    
                    <div className="text-slate-500">Giờ thuê:</div>
                    <div className="font-bold text-slate-900 text-right">{startTimeStr} - {endTimeStr}</div>
                    
                    <div className="text-slate-500">Số giờ thuê:</div>
                    <div className="font-bold text-slate-900 text-right">{hours.toFixed(1)} giờ</div>
                  </div>
                </div>

                {/* Khu vực chọn phương thức thanh toán */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Wallet className="w-5 h-5 text-emerald-500" /> Chọn phương thức thanh toán
                  </h3>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" name="payment" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="w-5 h-5 text-emerald-600 accent-emerald-600" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-slate-800">Chuyển khoản ngân hàng (VietQR)</span>
                        <span className="block text-sm text-slate-500">Quét mã QR tự động xác nhận trong 1 phút.</span>
                      </div>
                      <CreditCard className="w-6 h-6 text-slate-400" />
                    </label>

                    <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" name="payment" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-5 h-5 text-emerald-600 accent-emerald-600" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-slate-800">Ví điện tử Momo / ZaloPay</span>
                        <span className="block text-sm text-slate-500">Thanh toán qua ví điện tử tiện lợi.</span>
                      </div>
                      <Wallet className="w-6 h-6 text-slate-400" />
                    </label>

                    <label className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="w-5 h-5 text-emerald-600 accent-emerald-600" />
                      <div className="ml-4 flex-1">
                        <span className="block font-bold text-slate-800">Thanh toán tiền mặt</span>
                        <span className="block text-sm text-slate-500">Thanh toán trực tiếp tại quầy khi đến sân.</span>
                      </div>
                      <Banknote className="w-6 h-6 text-slate-400" />
                    </label>
                  </div>
                </div>

              </div>

              {/* CỘT PHẢI: KHU VỰC HÓA ĐƠN VÀ NÚT XÁC NHẬN */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900 text-white rounded-3xl shadow-xl overflow-hidden sticky top-24">
                  {/* Decorative Header */}
                  <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                    <span className="font-bold tracking-widest text-slate-300 uppercase text-sm">Hóa đơn điện tử</span>
                    <Receipt className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Đơn giá thuê sân:</span>
                      <span className="font-semibold">{booking.court.pricePerHour.toLocaleString()}đ / giờ</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Số giờ thuê:</span>
                      <span className="font-semibold">{hours.toFixed(1)} giờ</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Thuế VAT (0%):</span>
                      <span className="font-semibold">0đ</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-400">
                      <span>Khuyến mãi:</span>
                      <span className="font-semibold">- 0đ</span>
                    </div>
                    
                    <div className="border-t border-slate-700 border-dashed my-6 pt-6">
                      <div className="flex justify-between items-end">
                        <span className="text-lg font-medium text-slate-300">Tổng tiền thanh toán</span>
                        <span className="text-3xl font-black text-emerald-400">{booking.totalPrice.toLocaleString()}đ</span>
                      </div>
                    </div>

                    {/* Nút thao tác */}
                    <div className="pt-4 space-y-3">
                      <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isProcessing ? 'Đang xử lý giao dịch...' : 'Xác nhận Thanh toán'}
                      </button>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate('/courts')}
                          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors text-sm"
                        >
                          Hủy thanh toán
                        </button>
                        <button 
                          onClick={() => navigate(-1)}
                          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors text-sm"
                        >
                          Quay lại
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // THÀNH CÔNG VÀ HÓA ĐƠN ĐIỆN TỬ
          <div className="max-w-2xl mx-auto text-center animate-in zoom-in duration-500 mt-10">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-emerald-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-slate-500 mb-8 text-lg">Cảm ơn bạn đã sử dụng dịch vụ. Hóa đơn điện tử đã được khởi tạo.</p>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
              
              <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">HÓA ĐƠN ĐIỆN TỬ</h3>
                  <p className="text-slate-500 text-sm mt-1">Mã HĐ: INV-{booking.id.toString().padStart(6, '0')}</p>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-lg inline-block text-sm">ĐÃ THANH TOÁN</div>
                  <p className="text-slate-400 text-xs mt-2">{new Date().toLocaleString('vi-VN')}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách hàng:</span>
                  <span className="font-bold text-slate-900">{booking.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sân thuê:</span>
                  <span className="font-bold text-slate-900">{booking.court.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian:</span>
                  <span className="font-bold text-slate-900">{dateStr} ({startTimeStr} - {endTimeStr})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phương thức:</span>
                  <span className="font-bold text-slate-900 uppercase">{paymentMethod}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                <span className="font-bold text-slate-700">TỔNG TIỀN ĐÃ NHẬN</span>
                <span className="text-2xl font-black text-emerald-600">{booking.totalPrice.toLocaleString()}đ</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
};

export default CustomerPayment;
