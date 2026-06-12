import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText, PieChart, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div className="p-10 text-center">Đang tải báo cáo...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Phân tích</h1>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
          <Download className="w-4 h-4" /> Xuất Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tóm tắt */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Hiệu suất kinh doanh</p>
            <p className="text-2xl font-bold text-gray-900">Tăng trưởng Tốt</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <PieChart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1">Tổng tiền thu được</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} VNĐ</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-gray-800">Báo cáo Doanh thu theo Ngày (7 ngày qua)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Ngày (Tháng/Năm nay)</th>
                <th className="p-4 font-semibold text-right">Doanh thu thu về</th>
                <th className="p-4 font-semibold text-center">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.revenueByDay.slice().reverse().map((day: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{day.date}</td>
                  <td className="p-4 text-right font-bold text-emerald-600">{day.revenue.toLocaleString()}đ</td>
                  <td className="p-4 text-center">
                    {day.revenue > 100000 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Cao</span>
                    ) : day.revenue > 0 ? (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">Trung bình</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-bold">Thấp</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
