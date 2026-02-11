'use client';

import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <Link href={`/p/${product.slug}`} className="product-card group">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {product.discount > 0 && (
          <span className="badge-discount">
            SAVE {product.discount}%
          </span>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-amber-50 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">
          📱
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs mb-2">
          <div className="flex text-amber-500">
            {'★'.repeat(Math.floor(product.rating_avg))}
            {'☆'.repeat(5 - Math.floor(product.rating_avg))}
          </div>
          <span className="text-gray-500">({product.rating_count})</span>
        </div>

        <h3 className="text-sm font-semibold line-clamp-2 mb-3 min-h-[40px] group-hover:text-amber-700 transition-colors">
          {product.title}
        </h3>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              KSh {discountedPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                KSh {product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          {product.stock > 0 ? (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              In Stock
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Out of Stock
            </div>
          )}
        </div>

        <button className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
          Quick View
        </button>
      </div>
    </Link>
  );
}
