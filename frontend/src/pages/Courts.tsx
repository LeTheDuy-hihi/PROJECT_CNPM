import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Clock, Search, Plus, Filter } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const API_URL = 'http://localhost:3000/api';

interface Court {
  id: number;
  name: string;
  pricePerHour: number;
  status: string;
}

const Courts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const fetchCourts = async () => {
    try {
      const response = await axios.get(`${API_URL}/courts`);
      setCourts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sân:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleBookClick = (court: Court) => {
    setSelectedCourt(court);
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    fetchCourts(); // Refresh data if needed
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Sân bóng</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý trạng thái và đặt lịch cho tất cả các sân.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sân..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm transition-all bg-white"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Thêm Sân mới</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1">
              <div className="h-40 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900/5 group-hover:bg-emerald-900/10 transition-colors z-10"></div>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm z-0">🏸</span>
                
                {court.status === 'AVAILABLE' ? (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full z-20 shadow-sm border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sẵn sàng
                  </span>
                ) : (
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-600 text-xs font-bold px-3 py-1.5 rounded-full z-20 shadow-sm border border-red-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Bảo trì
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">{court.name}</h3>
                
                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" /> Cơ sở Quận 10
                  </div>
                  <div className="flex items-center text-emerald-600 font-semibold text-sm">
                    <Clock className="w-4 h-4 mr-2 text-emerald-500" /> {court.pricePerHour.toLocaleString()} VNĐ / Giờ
                  </div>
                </div>
                
                <button 
                  onClick={() => handleBookClick(court)}
                  disabled={court.status !== 'AVAILABLE'}
                  className={`w-full py-2.5 rounded-xl font-bold transition-all duration-200 flex justify-center items-center gap-2 ${
                    court.status === 'AVAILABLE' 
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-600 hover:shadow-md' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  ĐẶT SÂN NGAY
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingForm && selectedCourt && (
        <BookingModal 
          court={selectedCourt} 
          onClose={() => setShowBookingForm(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Courts;
