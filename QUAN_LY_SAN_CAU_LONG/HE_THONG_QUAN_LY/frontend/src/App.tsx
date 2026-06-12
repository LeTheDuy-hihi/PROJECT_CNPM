import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Courts from './pages/Courts';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import AdminPayments from './pages/AdminPayments';
import AdminStats from './pages/AdminStats';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CustomerCourts from './pages/CustomerCourts';
import CustomerBooking from './pages/CustomerBooking';
import CustomerPayment from './pages/CustomerPayment';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/courts" element={<Courts />} />
              <Route path="/admin/bookings" element={<Bookings />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<div className="p-10 text-center text-gray-500">Chức năng Cài đặt đang phát triển</div>} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }

  if (isAdminPage) {
    return <AdminLayout />;
  }

  // Khách hàng (Customer routes)
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courts" element={<CustomerCourts />} />
      <Route path="/booking/:id" element={<CustomerBooking />} />
      <Route path="/payment/:bookingId" element={<CustomerPayment />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
