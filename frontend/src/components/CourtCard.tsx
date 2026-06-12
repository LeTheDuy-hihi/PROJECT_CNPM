import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourtCardProps {
  id: number;
  name: string;
  pricePerHour: number;
  image?: string;
  rating?: number;
  reviews?: number;
  address?: string;
}

const CourtCard: React.FC<CourtCardProps> = ({ 
  id, 
  name, 
  pricePerHour, 
  image = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  rating = 4.8,
  reviews = 124,
  address = "Quận Cầu Giấy, Hà Nội"
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-bold text-gray-800 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{rating}</span>
          <span className="text-gray-500 text-xs font-medium ml-1">({reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">{name}</h3>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1 font-medium">Giá thuê từ</p>
            <p className="text-emerald-600 font-bold text-lg leading-none">
              {pricePerHour.toLocaleString()}đ<span className="text-sm font-medium text-gray-500">/giờ</span>
            </p>
          </div>
          <Link 
            to={`/booking/${id}`}
            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            Đặt ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
