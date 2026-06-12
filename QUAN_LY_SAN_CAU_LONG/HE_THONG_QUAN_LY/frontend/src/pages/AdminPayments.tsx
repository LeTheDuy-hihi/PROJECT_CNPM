import api from '../api';
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Search, Filter } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/bookings')
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPayments = payments.filter(p => 
    p.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Quản lý Thanh toán
          </h1>
          <p className="text-slate-500 text-sm mt-1">Theo dõi giao dịch và doanh thu từ khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Tìm theo tên khách hàng hoặc mã đơn..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" /> Lọc giao dịch
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Đang tải dữ liệu thanh toán...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 font-bold uppercase tracking-wider">Mã GD</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Khách hàng</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Ngày GD</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Số tiền</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Phương thức</th>
                  <th className="p-4 font-bold uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">#{payment.id.toString().padStart(6, '0')}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{payment.customer?.name}</p>
                      <p className="text-xs text-slate-500">{payment.customer?.phone}</p>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 font-black text-emerald-600">
                      {payment.totalPrice.toLocaleString()}đ
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                        Chuyển khoản (VietQR)
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100 w-fit">
                        <CheckCircle className="w-3.5 h-3.5" /> Đã thanh toán
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-slate-500">
                      Không tìm thấy giao dịch nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
