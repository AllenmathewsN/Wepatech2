'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useStore } from '@/lib/store';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(setCart)
      .catch(() => toast.error('Failed to load cart'));
  }, []);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.price - (item.price * item.discount / 100);
    return sum + (price * item.qty);
  }, 0);

  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
          },
          paymentMethod: formData.paymentMethod,
          total,
          deliveryFee,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        toast.success('Order placed successfully!');
        useStore.getState().setCart([]);
        router.push(`/orders/${order.id}`);
      } else {
        toast.error('Failed to place order');
      }
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div className={`h-2 rounded ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />
                  <div className="text-sm mt-2 text-center">
                    {s === 1 && 'Delivery'}
                    {s === 2 && 'Payment'}
                    {s === 3 && 'Review'}
                  </div>
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Street address, building, apartment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-field"
                  >
                    <option>Nairobi</option>
                    <option>Mombasa</option>
                    <option>Kisumu</option>
                    <option>Eldoret</option>
                    <option>Nakuru</option>
                  </select>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full">
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <div className="flex-1">
                    <div className="font-medium">Pay on Delivery</div>
                    <div className="text-sm text-gray-600">Cash or card payment upon delivery</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={formData.paymentMethod === 'mpesa'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <div className="flex-1">
                    <div className="font-medium">M-Pesa</div>
                    <div className="text-sm text-gray-600">Pay securely with M-Pesa</div>
                  </div>
                </label>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Review Order</h2>

                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <div className="text-gray-700">
                    <div>{formData.name}</div>
                    <div>{formData.phone}</div>
                    <div>{formData.address}</div>
                    <div>{formData.city}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="text-gray-700">
                    {formData.paymentMethod === 'cod' ? 'Pay on Delivery' : 'M-Pesa'}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-2">
                    {cart.map((item) => {
                      const price = item.price - (item.price * item.discount / 100);
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.title} x {item.qty}</span>
                          <span>KSh {(price * item.qty).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
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

            <div className="text-xs text-gray-600">
              By placing your order, you agree to our Terms & Conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
