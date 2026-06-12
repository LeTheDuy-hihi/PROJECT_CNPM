import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  CalendarDays, 
  CreditCard,
  BarChart3,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Trang chủ', path: '/admin', icon: LayoutDashboard },
    { name: 'Quản lý sân', path: '/admin/courts', icon: MapIcon },
    { name: 'Quản lý khách hàng', path: '/admin/customers', icon: Users },
    { name: 'Quản lý đặt sân', path: '/admin/bookings', icon: CalendarDays },
    { name: 'Quản lý thanh toán', path: '/admin/payments', icon: CreditCard },
    { name: 'Thống kê', path: '/admin/stats', icon: BarChart3 },
    { name: 'Báo cáo', path: '/admin/reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col transition-all duration-300 shadow-xl z-20 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-white font-bold text-lg leading-none">B</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Admin<span className="text-emerald-500">Pro</span></span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Bảng điều khiển
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-200" />
              {item.name}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl text-sm flex flex-col gap-2">
          <p className="font-semibold text-white">Bảo mật hệ thống</p>
          <p className="text-slate-400 text-xs">Mọi thay đổi dữ liệu đều được lưu vết để đảm bảo an toàn.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
