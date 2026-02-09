'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useStore } from '@/lib/store';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [city, setCity] = useState('Nairobi');

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(res => res.json())
      .then(setProduct)
      .catch(() => toast.error('Failed to load product'));
  }, [params.slug]);

  const addToCart = async () => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, qty }),
      });

      if (res.ok) {
        toast.success('Added to cart!');
        const cart = await fetch('/api/cart').then(r => r.json());
        useStore.getState().setCart(cart);
      }
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const buyNow = async () => {
    await addToCart();
    router.push('/cart');
  };

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const discountedPrice = product.price - (product.price * product.discount / 100);
  const specs = product.specs ? JSON.parse(product.specs) : {};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-9xl mb-4">
            📱
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`bg-gray-100 rounded aspect-square flex items-center justify-center text-4xl ${
                  selectedImage === i ? 'ring-2 ring-primary' : ''
                }`}
              >
                📱
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {'★'.repeat(Math.floor(product.rating_avg))}
              {'☆'.repeat(5 - Math.floor(product.rating_avg))}
            </div>
            <span className="text-gray-600">({product.rating_count} reviews)</span>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <div className="text-3xl font-bold text-primary mb-2">
              KSh {discountedPrice.toLocaleString()}
            </div>
            {product.discount > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xl text-gray-500 line-through">
                  KSh {product.price.toLocaleString()}
                </span>
                <span className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">
                  -{product.discount}%
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Quantity</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 border rounded flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button onClick={addToCart} className="btn-secondary flex-1">
              Add to Cart
            </button>
            <button onClick={buyNow} className="btn-primary flex-1">
              Buy Now
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3">Delivery</h3>
            <div className="mb-3">
              <label className="text-sm text-gray-600 block mb-1">Select Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-field"
              >
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Eldoret</option>
                <option>Nakuru</option>
              </select>
            </div>
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium">KSh 200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery:</span>
                <span className="font-medium">2-4 days</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <div className="text-sm">
              <div className="font-medium">{product.brand || 'Official Store'}</div>
              <div className="text-gray-600">98% positive ratings</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="border-b mb-6">
          <div className="flex gap-8">
            <button className="pb-3 border-b-2 border-primary font-medium">Description</button>
            <button className="pb-3 text-gray-600">Specifications</button>
            <button className="pb-3 text-gray-600">Reviews</button>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">{product.description}</p>
          
          {Object.keys(specs).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Key Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
