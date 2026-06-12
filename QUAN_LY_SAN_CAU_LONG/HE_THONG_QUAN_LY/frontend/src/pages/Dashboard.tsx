import api from '../api';
import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Activity, FileText, Download, Printer, ExternalLink, Map as MapIcon, ChevronDown } from 'lucide-react';

const DashboardStats = ({ title, value, icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
      {trend && (
        <span className={`text-xs font-bold mt-2 inline-block ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend} so với tháng trước
        </span>
      )}
    </div>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [chartView, setChartView] = useState('Ngày');

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan Hệ thống</h1>
          <p className="text-slate-500 text-sm mt-1">Báo cáo hiệu suất kinh doanh và quản trị hoạt động</p>
        </div>
      </div>
      
      {/* KHU VỰC THỐNG KÊ TỔNG QUAN */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <DashboardStats 
          title="Tổng doanh thu" 
          value={`${stats.totalRevenue.toLocaleString()}đ`} 
          icon={<DollarSign className="w-7 h-7" />} 
          trend="+15%" 
          color="bg-emerald-500 shadow-emerald-500/30" 
        />
        <DashboardStats 
          title="Tổng số sân" 
          value={stats.totalCourts.toString()} 
          icon={<MapIcon className="w-7 h-7" />} 
          color="bg-blue-500 shadow-blue-500/30" 
        />
        <DashboardStats 
          title="Sân đang hoạt động" 
          value={stats.totalCourts.toString()} // Giả sử toàn bộ đang hđ
          icon={<Activity className="w-7 h-7" />} 
          trend="Tất cả đang trực tuyến"
          color="bg-cyan-500 shadow-cyan-500/30" 
        />
        <DashboardStats 
          title="Tổng khách hàng" 
          value={stats.totalCustomers.toString()} 
          icon={<Users className="w-7 h-7" />} 
          trend="+5%" 
          color="bg-purple-500 shadow-purple-500/30" 
        />
        <DashboardStats 
          title="Tổng lượt đặt sân" 
          value={stats.totalBookings.toString()} 
          icon={<Calendar className="w-7 h-7" />} 
          trend="+12%" 
          color="bg-orange-500 shadow-orange-500/30" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KHU VỰC BIỂU ĐỒ DOANH THU & ĐẶT SÂN */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-slate-800">Biểu đồ doanh thu</h2>
              <div className="relative">
                <select 
                  value={chartView}
                  onChange={(e) => setChartView(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Ngày">Theo ngày (7 ngày qua)</option>
                  <option value="Tháng">Theo tháng (Năm nay)</option>
                  <option value="Năm">Theo năm</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            <div className="h-72 flex items-end justify-between gap-4">
              {stats.revenueByDay.map((day: any, i: number) => {
                const maxRev = Math.max(...stats.revenueByDay.map((d: any) => d.revenue), 100000);
                const height = `${Math.max(5, (day.revenue / maxRev) * 100)}%`;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {day.revenue.toLocaleString()}đ
                      {/* Arrow */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full bg-emerald-100 rounded-t-xl relative group-hover:bg-emerald-400 transition-all duration-300 overflow-hidden" 
                      style={{ height: height }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{day.date}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-8">Biểu đồ số lượng đặt sân</h2>
            {/* Dummy line chart visualization for Bookings */}
            <div className="h-48 relative flex items-end justify-between">
              {/* Fake SVG Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,80 Q10,50 20,60 T40,40 T60,20 T80,30 T100,10" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <path d="M0,80 Q10,50 20,60 T40,40 T60,20 T80,30 T100,10 L100,100 L0,100 Z" fill="rgba(59, 130, 246, 0.1)" stroke="none" />
              </svg>
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mb-2 ring-4 ring-white"></div>
                  <span className="text-xs text-slate-400">T{i+2}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: KHU VỰC BÁO CÁO & XUẤT DỮ LIỆU */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl shadow-lg border border-slate-800 p-6 text-white">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" /> Báo cáo tổng hợp
            </h2>
            <p className="text-slate-400 text-sm mb-6">Trích xuất dữ liệu vận hành kinh doanh định kỳ.</p>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group">
                <div className="flex items-center gap-3 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  Xuất báo cáo PDF
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group">
                <div className="flex items-center gap-3 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  Xuất báo cáo Excel
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>

              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group">
                <div className="flex items-center gap-3 font-medium">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Printer className="w-4 h-4" />
                  </div>
                  In báo cáo
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white" />
              </button>
            </div>
            
            <button className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors">
              Xem báo cáo trực tuyến
            </button>
          </div>

          {/* Mini Logs */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Giao dịch gần nhất</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Thanh toán #000{i}12</p>
                    <p className="text-xs text-slate-500">Khách hàng Nguyễn Văn {['A','B','C'][i-1]} • Vừa xong</p>
                  </div>
                  <div className="ml-auto text-emerald-600 font-bold text-sm">
                    +120k
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
