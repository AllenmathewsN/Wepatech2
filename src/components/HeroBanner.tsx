'use client';

import { useState, useEffect } from 'react';

const banners = [
  {
    title: 'iPhone 15 Pro Max',
    subtitle: 'Titanium. So strong. So light. So Pro.',
    discount: 'Exclusive Launch Offer',
    bg: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
    accent: 'from-blue-400 to-cyan-400',
  },
  {
    title: 'Samsung Galaxy S23 Ultra',
    subtitle: 'Epic in Every Way',
    discount: 'Premium Collection',
    bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    accent: 'from-purple-400 to-pink-400',
  },
  {
    title: 'Luxury Audio Collection',
    subtitle: 'Experience Sound Perfection',
    discount: 'Curated Selection',
    bg: 'bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900',
    accent: 'from-amber-400 to-orange-400',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${banner.bg}`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="text-white max-w-2xl animate-slide-up">
              <div className={`inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4`}>
                {banner.discount}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
                <span className={`bg-gradient-to-r ${banner.accent} bg-clip-text text-transparent`}>
                  {banner.title}
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light">{banner.subtitle}</p>
              <div className="flex gap-4">
                <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-luxury transform hover:-translate-y-1">
                  Explore Collection
                </button>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-500 rounded-full ${
              index === current 
                ? 'bg-white w-12 h-3 shadow-lg' 
                : 'bg-white/40 w-3 h-3 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
