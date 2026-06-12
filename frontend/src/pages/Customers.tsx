import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Phone, Calendar } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/customers')
      .then(res => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Khách hàng</th>
                <th className="p-4 font-semibold">Số điện thoại</th>
                <th className="p-4 font-semibold">Số lượt đặt sân</th>
                <th className="p-4 font-semibold">Tổng chi tiêu</th>
                <th className="p-4 font-semibold">Ngày đăng ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có khách hàng nào.</td>
                </tr>
              ) : (
                customers.map((c: any) => {
                  const totalSpent = c.bookings ? c.bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0) : 0;
                  const totalBookings = c.bookings ? c.bookings.length : 0;
                  
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {c.name.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {c.phone}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {totalBookings} lượt
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600">
                        {totalSpent.toLocaleString()}đ
                      </td>
                      <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">Đã xác thực</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
