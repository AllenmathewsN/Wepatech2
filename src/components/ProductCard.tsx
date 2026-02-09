'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price - (product.price * product.discount / 100);

  return (
    <Link href={`/p/${product.slug}`} className="product-card">
      <div className="relative aspect-square">
        {product.discount > 0 && (
          <span className="badge-discount">-{product.discount}%</span>
        )}
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-6xl">
          📱
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[40px]">
          {product.title}
        </h3>
        
        <div className="mb-2">
          <div className="text-lg font-bold text-primary">
            KSh {discountedPrice.toLocaleString()}
          </div>
          {product.discount > 0 && (
            <div className="text-xs text-gray-500 line-through">
              KSh {product.price.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.floor(product.rating_avg))}
            {'☆'.repeat(5 - Math.floor(product.rating_avg))}
          </div>
          <span className="text-gray-500">({product.rating_count})</span>
        </div>
      </div>
    </Link>
  );
}
