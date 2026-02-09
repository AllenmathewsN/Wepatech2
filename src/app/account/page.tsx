'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useStore } from '@/lib/store';

export default function AccountPage() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetch('/api/orders')
      .then(res => res.json())
      .then(setOrders)
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h2 className="font-bold mb-4">Account Info</h2>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-gray-600">Name</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <div className="text-gray-600">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div>
                <div className="text-gray-600">Role</div>
                <div className="font-medium capitalize">{user.role}</div>
              </div>
            </div>
            
            {user.role === 'admin' && (
              <Link href="/admin" className="btn-primary w-full mt-4 block text-center">
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-xl mb-6">Order History</h2>

              {loading ? (
                <div>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📦</div>
                  <p>No orders yet</p>
                  <Link href="/" className="btn-primary mt-4 inline-block">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => {
                    const address = JSON.parse(order.address_json);
                    return (
                      <Link
                        key={order.id}
                        href={`/orders/${order.id}`}
                        className="block border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              KSh {order.total.toLocaleString()}
                            </div>
                            <div className={`text-sm px-2 py-1 rounded inline-block ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Delivery to: {address.city}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
