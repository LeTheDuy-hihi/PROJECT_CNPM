import api from '../api';
import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-center text-slate-500">Đang phân tích dữ liệu...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" /> Thống kê phân tích
          </h1>
          <p className="text-slate-500 text-sm mt-1">Phân tích chuyên sâu về dữ liệu kinh doanh</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tỉ lệ lấp đầy sân (Mock data) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-500" /> Tỉ lệ lấp đầy sân
            </h2>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-purple-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)' }}></div>
              <div className="text-center">
                <span className="text-3xl font-black text-slate-800">75%</span>
                <span className="block text-xs text-slate-500 font-bold uppercase mt-1">Lấp đầy</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-slate-600">Đã đặt (75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              <span className="text-sm font-medium text-slate-600">Trống (25%)</span>
            </div>
          </div>
        </div>

        {/* Khung giờ vàng (Mock data) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" /> Khung giờ vàng
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { time: '17:00 - 19:00', percent: 95, users: 142 },
              { time: '19:00 - 21:00', percent: 85, users: 118 },
              { time: '05:00 - 07:00', percent: 65, users: 76 },
              { time: '07:00 - 09:00', percent: 40, users: 45 },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm font-bold text-slate-700">{slot.time}</div>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full" style={{ width: `${slot.percent}%` }}></div>
                </div>
                <div className="w-16 text-right text-xs font-bold text-slate-500">{slot.users} KH</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ArrowUpRight className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-800">Đề xuất kinh doanh</p>
              <p className="text-xs text-orange-600 mt-1">Khung giờ 17:00 - 19:00 đang quá tải. Hãy cân nhắc tăng giá sân VIP hoặc mở rộng thêm sân mới.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminStats;
