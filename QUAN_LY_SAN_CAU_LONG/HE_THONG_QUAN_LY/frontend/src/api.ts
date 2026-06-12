import axios from 'axios';

const api = axios.create({
  // Sử dụng biến môi trường VITE_API_URL nếu có, nếu không thì dùng localhost cho môi trường dev
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
