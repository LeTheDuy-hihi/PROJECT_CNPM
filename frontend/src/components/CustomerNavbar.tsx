import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';

const CustomerNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl leading-none">B</span>
          </div>
          <span className={`font-bold text-xl tracking-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            Badminton<span className="text-emerald-500">Pro</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className={`hidden md:flex items-center gap-8 font-semibold ${isScrolled ? 'text-gray-600' : 'text-white/90'}`}>
          <Link to="/" className="hover:text-emerald-500 transition-colors">Trang chủ</Link>
          <Link to="/courts" className="hover:text-emerald-500 transition-colors">Tìm sân</Link>
          <Link to="/courts" className="hover:text-emerald-500 transition-colors">Khuyến mãi</Link>
          <Link to="/courts" className="hover:text-emerald-500 transition-colors">Về chúng tôi</Link>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to={user.role === 'ADMIN' ? '/admin' : '/profile'} className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-red-500 hover:bg-red-50' : 'text-white/80 hover:bg-white/20'}`} title="Đăng xuất">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={`font-semibold hover:text-emerald-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                Đăng nhập
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">
                Đăng ký ngay
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={`md:hidden p-2 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
