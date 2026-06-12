import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Calendar, Clock, Star, Trophy, ShieldCheck, Zap, Users, Play, CheckCircle2 } from 'lucide-react';
import CourtCard from '../components/CourtCard';
import CustomerNavbar from '../components/CustomerNavbar';
import CustomerFooter from '../components/CustomerFooter';
import { Link } from 'react-router-dom';

const Home = () => {
  const [courts, setCourts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real courts from backend
    axios.get('http://localhost:3000/api/courts')
      .then(res => {
        setCourts(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
      <CustomerNavbar />

      {/* 1. HERO SECTION (Redesigned) */}
      <div className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-slate-900">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Badminton Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40 mix-blend-multiply"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl z-0 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm tracking-wide mb-8 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              HỆ THỐNG ĐẶT SÂN #1 VIỆT NAM
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Đam mê bùng cháy, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sân luôn sẵn sàng.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-light">
              Khám phá và đặt ngay các sân cầu lông đạt chuẩn quốc gia. Giá cả minh bạch, thanh toán tự động, không lo hết chỗ vào giờ vàng.
            </p>

            {/* Search Box - Glassmorphism */}
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/10">
                <MapPin className="text-emerald-400 w-5 h-5 shrink-0 group-focus-within:text-emerald-300" />
                <input 
                  type="text" 
                  placeholder="Nhập tên sân, quận huyện..." 
                  className="bg-transparent border-none outline-none w-full text-white placeholder-slate-400 font-medium focus:ring-0"
                />
              </div>
              <div className="md:w-56 flex items-center gap-3 px-5 py-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group border border-transparent hover:border-white/10">
                <Calendar className="text-emerald-400 w-5 h-5 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Hôm nay" 
                  className="bg-transparent border-none outline-none w-full text-white placeholder-slate-400 font-medium cursor-pointer"
                  readOnly
                />
              </div>
              <Link to="/courts" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 hover:-translate-y-1">
                <Search className="w-5 h-5" />
                Tìm Sân Ngay
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hơn 100+ sân
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 50,000+ người chơi
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hỗ trợ 24/7
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LOGO CLOUD (Partners) */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Đối tác đồng hành cùng chúng tôi</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Dummy Logos */}
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">YONEX</h2>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">LI-NING</h2>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter">VICTOR</h2>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Kumpoo</h2>
          </div>
        </div>
      </div>

      {/* 3. HOW IT WORKS */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Quy trình đơn giản</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Chỉ 3 bước để ra sân</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100 z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-emerald-600 transform rotate-3 hover:rotate-0 transition-all">
                <Search className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">1. Tìm kiếm sân</h4>
              <p className="text-slate-500 leading-relaxed">Nhập khu vực bạn muốn chơi. Hệ thống sẽ lọc ra các sân gần nhất với chất lượng tốt nhất.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-600 rounded-3xl shadow-[0_20px_40px_-15px_rgba(16,185,129,0.5)] flex items-center justify-center mb-6 text-white transform -rotate-3 hover:rotate-0 transition-all">
                <Calendar className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">2. Chọn giờ & Đặt lịch</h4>
              <p className="text-slate-500 leading-relaxed">Xem lịch trống theo thời gian thực (Real-time). Bấm chọn khung giờ bạn muốn và xác nhận.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 text-emerald-600 transform rotate-3 hover:rotate-0 transition-all">
                <Trophy className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">3. Thanh toán & Ra sân</h4>
              <p className="text-slate-500 leading-relaxed">Quét mã VietQR thanh toán trong 3 giây. Cầm vợt lên và đến sân chiến ngay thôi!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FEATURED COURTS SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Sân đạt chuẩn</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Các sân cầu lông được yêu thích nhất</h3>
            <p className="text-slate-500 text-lg">Hệ thống thảm lót tiêu chuẩn, ánh sáng chống chói và trần cao trên 9m.</p>
          </div>
          <Link to="/courts" className="shrink-0 inline-flex items-center justify-center bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 font-bold px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md gap-2">
            Xem tất cả sân <Play className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courts.length > 0 ? (
            courts.slice(0, 8).map(court => (
              <CourtCard key={court.id} {...court} />
            ))
          ) : (
            // Dummy data if backend has no data yet
            [1, 2, 3, 4].map(i => (
              <CourtCard 
                key={i} 
                id={i} 
                name={`Sân cầu lông cao cấp ${i}`} 
                pricePerHour={60000 + (i * 10000)} 
              />
            ))
          )}
        </div>
      </div>

      {/* 5. BENEFITS SECTION */}
      <div className="bg-slate-900 py-24 text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-emerald-400 font-bold tracking-wide uppercase text-sm mb-3">Tại sao chọn chúng tôi?</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Giải pháp quản lý & đặt sân toàn diện.</h3>
              <p className="text-slate-400 text-lg mb-8">Chúng tôi mang đến công nghệ tối ưu giúp người chơi tiết kiệm thời gian, đồng thời giúp chủ sân tối đa hóa doanh thu và công suất hoạt động.</p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Uy tín & Bảo mật</h4>
                    <p className="text-slate-400">Giao dịch được mã hóa an toàn. 100% bảo vệ quyền lợi người chơi nếu sân có sự cố.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Tốc độ & Mượt mà</h4>
                    <p className="text-slate-400">Hệ thống Single Page Application phản hồi ngay lập tức, không độ trễ.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-1">Cộng đồng sôi động</h4>
                    <p className="text-slate-400">Tham gia vào cộng đồng đam mê cầu lông lớn nhất Việt Nam, tìm kèo giao lưu dễ dàng.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/50 border border-slate-700">
                <img 
                  src="https://images.unsplash.com/photo-1595436065982-89fd314e3271?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Badminton Smash" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-[250px] hidden md:block">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex -space-x-3">
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt=""/>
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt=""/>
                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt=""/>
                  </div>
                  <div className="text-emerald-600 font-bold text-sm">+2k đánh giá</div>
                </div>
                <p className="text-slate-800 font-bold">"Ứng dụng đặt sân tuyệt vời nhất tôi từng dùng!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. CTA SECTION */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Bạn đã sẵn sàng ra sân?</h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">Tham gia ngay hôm nay để nhận ưu đãi giảm 20% cho lần đặt sân đầu tiên. Không cần thẻ tín dụng để đăng ký.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/30">
              Tạo tài khoản miễn phí
            </Link>
            <Link to="/courts" className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg px-8 py-4 rounded-xl transition-all">
              Khám phá danh sách sân
            </Link>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
};

export default Home;
