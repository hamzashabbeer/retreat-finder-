import React from 'react';
import { Star } from 'lucide-react';
import type { Retreat } from '../types';

interface RetreatCardProps {
  retreat: Retreat;
}

export default function RetreatCard({ retreat }: RetreatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        <img
          src={retreat.images[0]}
          alt={retreat.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white rounded-full shadow-md hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{retreat.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{retreat.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          {retreat.location.city}, {retreat.location.country}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {retreat.type.map((type) => (
            <span
              key={type}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              ${retreat.price.amount}
            </span>
            <span className="text-sm text-gray-600"> / person</span>
          </div>
          <span className="text-sm text-gray-600">
            {retreat.duration} days
          </span>
        </div>
      </div>
    </div>
  );
}