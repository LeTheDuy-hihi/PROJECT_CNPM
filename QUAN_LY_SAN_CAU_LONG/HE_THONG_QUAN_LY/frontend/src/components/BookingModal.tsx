import api from '../api';
import React, { useState } from 'react';
import { Calendar, Phone, User, CheckCircle, XCircle, X, Clock } from 'lucide-react';


interface Court {
  id: number;
  name: string;
  pricePerHour: number;
  status: string;
}

interface BookingModalProps {
  court: Court;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ court, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingMessage('');
    setBookingError('');
    setIsSubmitting(true);

    try {
      await api.post(`/bookings`, {
        courtId: court.id,
        customerName,
        customerPhone,
        startTime,
        endTime
      });

      setBookingMessage('Đặt sân thành công! Bạn vui lòng đến đúng giờ.');
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error: any) {
      if (error.response && error.response.data) {
        setBookingError(error.response.data.error);
      } else {
        setBookingError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Đặt {court.name}
            </h2>
            <p className="text-emerald-100 text-sm mt-1">{court.pricePerHour.toLocaleString()} VNĐ/Giờ</p>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-emerald-700 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={submitBooking} className="p-6 space-y-5">
          
          {bookingMessage && (
            <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-sm flex items-center font-medium border border-emerald-200">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {bookingMessage}
            </div>
          )}
          
          {bookingError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm flex items-center font-medium border border-red-200">
              <XCircle className="w-5 h-5 mr-2 flex-shrink-0" /> {bookingError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" /> Tên khách hàng
            </label>
            <input 
              type="text" required
              value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Vd: Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" /> Số điện thoại
            </label>
            <input 
              type="tel" required
              value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="09xx xxx xxx"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Bắt đầu
              </label>
              <input 
                type="datetime-local" required
                value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" /> Kết thúc
              </label>
              <input 
                type="datetime-local" required
                value={endTime} onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !!bookingMessage}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Xác nhận đặt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
