'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(console.error);
  }, [params.id]);

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const address = JSON.parse(order.address_json);
  const statusSteps = ['placed', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Order ID: #{order.id}</p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-6">Order Status</h2>
          
          <div className="flex justify-between mb-8">
            {statusSteps.map((status, index) => (
              <div key={status} className="flex-1 relative">
                <div className={`h-2 ${index <= currentStepIndex ? 'bg-primary' : 'bg-gray-200'}`} />
                <div className="text-center mt-2">
                  <div className={`text-sm capitalize ${index <= currentStepIndex ? 'font-medium' : 'text-gray-500'}`}>
                    {status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-bold mb-4">Delivery Address</h3>
            <div className="text-gray-700 space-y-1">
              <div className="font-medium">{address.name}</div>
              <div>{address.phone}</div>
              <div>{address.address}</div>
              <div>{address.city}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6">
            <h3 className="font-bold mb-4">Payment Method</h3>
            <div className="text-gray-700">
              {order.payment_method === 'cod' ? 'Pay on Delivery' : 'M-Pesa'}
            </div>
            
            <h3 className="font-bold mt-6 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>KSh {(order.total - order.delivery_fee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>KSh {order.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">KSh {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6">
          <h3 className="font-bold mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center text-3xl">
                  📱
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.product?.title}</div>
                  <div className="text-sm text-gray-600">Quantity: {item.qty}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">KSh {(item.price_at_purchase * item.qty).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">KSh {item.price_at_purchase.toLocaleString()} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="btn-primary flex-1 text-center">
            Continue Shopping
          </Link>
          <Link href="/account" className="btn-secondary flex-1 text-center">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
