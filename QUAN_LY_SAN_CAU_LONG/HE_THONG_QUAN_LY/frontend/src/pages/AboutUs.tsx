import React, { useEffect } from 'react';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { Target, Shield, Users, Trophy } from 'lucide-react';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: <Target className="w-10 h-10 text-emerald-500" />,
      title: "Chất lượng hàng đầu",
      description: "100% sân đạt chuẩn thi đấu quốc tế với thảm cao su cao cấp và hệ thống chiếu sáng chuẩn."
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-500" />,
      title: "Uy tín & Minh bạch",
      description: "Hệ thống đặt lịch tự động, giá cả niêm yết rõ ràng, không phụ phí ẩn."
    },
    {
      icon: <Users className="w-10 h-10 text-orange-500" />,
      title: "Cộng đồng năng động",
      description: "Kết nối hàng ngàn tay vợt có chung niềm đam mê, thường xuyên tổ chức giải đấu nội bộ."
    },
    {
      icon: <Trophy className="w-10 h-10 text-purple-500" />,
      title: "Dịch vụ chuyên nghiệp",
      description: "Đội ngũ nhân viên hỗ trợ 24/7, luôn sẵn sàng giải đáp mọi thắc mắc của khách hàng."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <CustomerNavbar />

      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Về <span className="text-emerald-500">BadmintonPro</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
            Chúng tôi tự hào là hệ thống quản lý và cho thuê sân cầu lông tiên tiến nhất Việt Nam, mang đến trải nghiệm thể thao chuyên nghiệp, tiện lợi và đẳng cấp cho mọi người đam mê quả cầu lông vũ.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 flex-1 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                Được thành lập vào năm 2024 bởi một nhóm các bạn trẻ đam mê cầu lông, BadmintonPro ra đời với sứ mệnh giải quyết bài toán nan giải: "Tìm sân cầu lông trống quá khó".
              </p>
              <p>
                Từ một cụm sân nhỏ lẻ ban đầu, nhờ sự tin tưởng của cộng đồng người chơi, chúng tôi đã không ngừng mở rộng và nâng cấp hệ thống. Áp dụng công nghệ vào quản lý, chúng tôi giúp người chơi dễ dàng kiểm tra lịch trống và đặt sân chỉ trong 30 giây.
              </p>
              <p className="font-semibold text-emerald-600">
                Hơn 100+ sân cầu lông trên toàn quốc, phục vụ hơn 50,000+ lượt khách mỗi tháng. Đó mới chỉ là sự khởi đầu!
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 translate-x-4 translate-y-4 rounded-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80" 
              alt="Badminton court" 
              className="relative z-10 rounded-3xl shadow-2xl object-cover h-[400px] w-full"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Giá trị cốt lõi</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Những nguyên tắc hoạt động giúp BadmintonPro giữ vững vị thế số 1 trong lòng khách hàng.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default AboutUs;
