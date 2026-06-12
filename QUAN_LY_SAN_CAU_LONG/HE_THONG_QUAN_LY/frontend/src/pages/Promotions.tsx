import React, { useEffect } from 'react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { Tag, Calendar, Gift, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Promotions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const promotions = [
    {
      id: 1,
      title: "Ưu đãi khách hàng mới",
      description: "Giảm ngay 20% cho lần đặt sân đầu tiên tại hệ thống BadmintonPro.",
      icon: <Gift className="w-8 h-8 text-emerald-500" />,
      validUntil: "Không thời hạn",
      code: "NEWBIE20"
    },
    {
      id: 2,
      title: "Chơi thả ga cuối tuần",
      description: "Đồng giá 50.000đ/giờ cho tất cả các sân thường vào Thứ 7 và Chủ Nhật (Từ 6h - 14h).",
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      validUntil: "30/06/2026",
      code: "WEEKEND50K"
    },
    {
      id: 3,
      title: "Flash Sale Giờ Vàng",
      description: "Tặng thêm 30 phút khi đặt sân từ 2 tiếng trở lên trong khung giờ 9h-11h sáng các ngày trong tuần.",
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      validUntil: "Sắp hết hạn",
      code: "FLASHSALE"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <CustomerNavbar />

      {/* Header Section */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Khuyến Mãi <span className="text-emerald-500">Đặc Biệt</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Tổng hợp các chương trình ưu đãi hấp dẫn nhất từ BadmintonPro. Đừng bỏ lỡ cơ hội đặt sân chất lượng cao với mức giá siêu tiết kiệm.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
                {promo.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{promo.title}</h3>
              <p className="text-slate-600 mb-6 flex-1">{promo.description}</p>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-100 dashed border-dashed">
                <span className="text-sm font-semibold text-slate-500">MÃ ƯU ĐÃI:</span>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg tracking-wider">
                  {promo.code}
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Tag className="w-4 h-4" />
                  HSD: {promo.validUntil}
                </div>
                <Link to="/courts" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline text-sm">
                  Dùng ngay →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Promotions;
