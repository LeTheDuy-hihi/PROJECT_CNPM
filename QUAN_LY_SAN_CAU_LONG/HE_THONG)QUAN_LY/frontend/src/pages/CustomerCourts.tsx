import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, MapPin, Play, Clock, RefreshCw, Calendar, Tag, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Hash, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';

const CustomerCourts = () => {
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{type: 'info' | 'success' | 'warning' | 'error', message: string} | null>({
    type: 'info',
    message: 'Dữ liệu đang được cập nhật...'
  });

  // Search & Filter States
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchCourts = async () => {
    setLoading(true);
    setNotification({ type: 'info', message: 'Dữ liệu đang được cập nhật...' });
    try {
      const res = await axios.get('http://localhost:3000/api/courts');
      setCourts(res.data);
      setNotification({ type: 'success', message: `Kết quả tìm kiếm thành công: Tìm thấy ${res.data.length} sân.` });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Lỗi khi tải dữ liệu sân. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourts();
  }, []);

  const handleRefresh = () => {
    setSearchName('');
    setSearchId('');
    setFilterDate('');
    setFilterStartTime('');
    setFilterEndTime('');
    setFilterType('');
    setFilterStatus('');
    setCurrentPage(1);
    fetchCourts();
  };

  // Lọc sân (Client-side filtering for demonstration)
  const filteredCourts = useMemo(() => {
    return courts.filter(court => {
      if (searchName && !court.name.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchId && court.id.toString() !== searchId) return false;
      if (filterStatus && court.status !== filterStatus) return false;
      // In a real app, date/time filtering would require querying bookings. 
      // We will mock this logic visually here.
      return true;
    });
  }, [courts, searchName, searchId, filterStatus]);

  // Phân trang
  const totalPages = Math.ceil(filteredCourts.length / itemsPerPage);
  const currentCourts = filteredCourts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (!loading) {
      if (filteredCourts.length === 0) {
        setNotification({ type: 'warning', message: 'Không tìm thấy sân phù hợp với điều kiện lọc.' });
      } else {
        setNotification({ type: 'success', message: `Kết quả tìm kiếm thành công: Tìm thấy ${filteredCourts.length} sân.` });
      }
      setCurrentPage(1);
    }
  }, [filteredCourts.length, loading]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <CustomerNavbar />

      {/* Khu vực tiêu đề */}
      <div className="bg-slate-900 pt-24 pb-12 px-6 shadow-md relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
              <span className="p-2 bg-emerald-500 rounded-lg"><Search className="w-6 h-6 text-white" /></span>
              Tra cứu sân cầu lông
            </h1>
            <p className="text-emerald-400 text-sm font-medium tracking-wide">HỆ THỐNG QUẢN LÝ SÂN CẦU LÔNG TRỰC TUYẾN</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8">
        
        {/* Cột trái: Bộ lọc & Tìm kiếm */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          
          {/* Khu vực tìm kiếm */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Search className="w-5 h-5 text-emerald-600" /> Tìm kiếm nhanh
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Tên sân</label>
                <div className="relative">
                  <input 
                    type="text" value={searchName} onChange={e => setSearchName(e.target.value)}
                    placeholder="Nhập một phần tên sân..." 
                    className="w-full pl-3 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Mã sân</label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" value={searchId} onChange={e => setSearchId(e.target.value)}
                    placeholder="Ví dụ: 1" 
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-sm">
                  Tìm kiếm
                </button>
                <button onClick={handleRefresh} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200" title="Làm mới danh sách">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Khu vực bộ lọc */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Tag className="w-5 h-5 text-emerald-600" /> Bộ lọc nâng cao
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Ngày thuê mong muốn</label>
                <input 
                  type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Giờ bắt đầu</label>
                  <input type="time" value={filterStartTime} onChange={e => setFilterStartTime(e.target.value)} className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Giờ kết thúc</label>
                  <input type="time" value={filterEndTime} onChange={e => setFilterEndTime(e.target.value)} className="w-full px-2 py-2 border border-slate-200 rounded-lg text-sm text-slate-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Loại sân</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none">
                  <option value="">Tất cả loại sân</option>
                  <option value="thuong">Sân thường</option>
                  <option value="vip">Sân VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Trạng thái sân</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none">
                  <option value="">Tất cả trạng thái</option>
                  <option value="AVAILABLE">Còn trống (Sẵn sàng)</option>
                  <option value="MAINTENANCE">Đang bảo trì</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Danh sách & Thông báo */}
        <div className="flex-1 flex flex-col">
          
          {/* Khu vực thông báo */}
          {notification && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border shadow-sm ${
              notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-700' :
              notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
              notification.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-700' :
              'bg-red-50 border-red-200 text-red-700'
            }`}>
              {notification.type === 'info' && <RefreshCw className="w-5 h-5 shrink-0 animate-spin mt-0.5" />}
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
              {(notification.type === 'warning' || notification.type === 'error') && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
          )}

          {/* Khu vực hiển thị danh sách sân (Dạng Card) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-[420px] border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {currentCourts.map(court => (
                  <div key={court.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col h-full group">
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80&sig=${court.id}`} 
                        alt={court.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-black text-slate-700 shadow-sm flex items-center gap-1">
                        <Hash className="w-3 h-3 text-emerald-600" /> MÃ: {court.id}
                      </div>
                      <div className="absolute top-3 right-3">
                        {court.status === 'AVAILABLE' ? (
                          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Còn trống
                          </span>
                        ) : (
                          <span className="bg-slate-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Bảo trì
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{court.name}</h3>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100 whitespace-nowrap">
                          {court.id % 2 === 0 ? 'VIP' : 'Thường'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                        Hệ thống thảm tiêu chuẩn thi đấu, không gian rộng rãi thoáng mát, ánh sáng chống chói mắt.
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-emerald-600 font-bold">
                          <span className="text-xl">{court.pricePerHour.toLocaleString()}đ</span>
                          <span className="text-sm font-medium text-slate-500 ml-1">/ giờ</span>
                        </div>
                      </div>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <Link 
                          to={`/booking/${court.id}`}
                          className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center gap-1.5"
                        >
                          <Info className="w-4 h-4" /> Chi tiết
                        </Link>
                        <Link 
                          to={`/booking/${court.id}`}
                          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm ${
                            court.status === 'AVAILABLE' 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                          onClick={(e) => { if(court.status !== 'AVAILABLE') e.preventDefault(); }}
                        >
                          <Calendar className="w-4 h-4" /> Đặt sân
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-auto pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({length: totalPages}).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${
                        currentPage === idx + 1 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default CustomerCourts;
