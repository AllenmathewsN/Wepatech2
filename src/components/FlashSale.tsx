'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface FlashSaleProps {
  products: any[];
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mb-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">⚡ Flash Sale</h2>
          <p className="text-sm opacity-90">Limited time offers - Grab them fast!</p>
        </div>
        <div className="flex gap-2 text-center">
          <div className="bg-white text-gray-900 rounded px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs">Hours</div>
          </div>
          <div className="text-2xl font-bold flex items-center">:</div>
          <div className="bg-white text-gray-900 rounded px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs">Mins</div>
          </div>
          <div className="text-2xl font-bold flex items-center">:</div>
          <div className="bg-white text-gray-900 rounded px-3 py-2 min-w-[60px]">
            <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs">Secs</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {products.map((product: any) => (
            <div key={product.id} className="w-[200px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
