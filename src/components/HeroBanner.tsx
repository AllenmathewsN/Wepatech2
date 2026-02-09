'use client';

import { useState, useEffect } from 'react';

const banners = [
  {
    title: 'Latest iPhone 15 Pro Max',
    subtitle: 'Now Available in Kenya',
    discount: 'Save up to 15%',
    bg: 'bg-gradient-to-r from-blue-600 to-purple-600',
  },
  {
    title: 'Samsung Galaxy S23 Ultra',
    subtitle: 'Flagship Performance',
    discount: 'Up to 20% Off',
    bg: 'bg-gradient-to-r from-gray-800 to-gray-600',
  },
  {
    title: 'Accessories Sale',
    subtitle: 'Earphones, Chargers & More',
    discount: 'Starting from KSh 800',
    bg: 'bg-gradient-to-r from-orange-500 to-red-500',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0'
          } ${banner.bg}`}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{banner.title}</h1>
              <p className="text-xl md:text-2xl mb-4">{banner.subtitle}</p>
              <div className="text-2xl font-bold mb-6">{banner.discount}</div>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === current ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
