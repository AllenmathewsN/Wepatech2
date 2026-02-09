'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data);
      useStore.getState().setCart(data);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    
    try {
      await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, qty: newQty }),
      });
      loadCart();
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
      toast.success('Item removed');
      loadCart();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.price - (item.price * item.discount / 100);
    return sum + (price * item.qty);
  }, 0);

  const deliveryFee = cart.length > 0 ? 200 : 0;
  const total = subtotal + deliveryFee;

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const price = item.price - (item.price * item.discount / 100);
            
            return (
              <div key={item.id} className="bg-white rounded-lg p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-4xl flex-shrink-0">
                  📱
                </div>

                <div className="flex-1">
                  <Link href={`/p/${item.slug}`} className="font-medium hover:text-primary">
                    {item.title}
                  </Link>
                  
                  <div className="text-lg font-bold text-primary mt-2">
                    KSh {price.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 border rounded hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold">
                  KSh {(price * item.qty).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="bg-white rounded-lg p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">KSh {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">KSh {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>

            <Link href="/" className="block text-center text-sm text-gray-600 hover:text-primary mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
