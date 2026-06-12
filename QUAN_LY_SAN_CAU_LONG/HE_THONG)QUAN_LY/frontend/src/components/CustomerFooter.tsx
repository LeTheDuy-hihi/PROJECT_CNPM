import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const CustomerFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl leading-none">B</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Badminton<span className="text-emerald-500">Pro</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Hệ thống tìm kiếm và đặt sân cầu lông chuyên nghiệp hàng đầu Việt Nam. Nhanh chóng, tiện lợi, giá cả minh bạch.
          </p>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Khám phá</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Về chúng tôi</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Tin tức cầu lông</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Chương trình khuyến mãi</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Hướng dẫn đặt sân</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Hỗ trợ</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Chính sách hoàn tiền</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition-colors">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Liên hệ</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>123 Đường Cầu Lông, Quận Thể Thao, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>0987 654 321</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>support@badmintonpro.vn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2026 BadmintonPro. Tất cả quyền được bảo lưu.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Facebook</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">TikTok</a>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
