import React from 'react';
import { TrendingUp, Users, CalendarCheck, Clock } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: 'Doanh thu hôm nay',
      value: '4,520,000đ',
      trend: '+12.5%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      title: 'Lượt đặt sân mới',
      value: '24',
      trend: '+5.2%',
      isPositive: true,
      icon: CalendarCheck,
      color: 'bg-blue-500',
    },
    {
      title: 'Khách hàng',
      value: '142',
      trend: '+2.1%',
      isPositive: true,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Giờ trống',
      value: '12h',
      trend: '-1.5%',
      isPositive: false,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl text-white ${stat.color} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
