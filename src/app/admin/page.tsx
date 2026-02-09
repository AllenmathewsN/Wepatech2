'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useStore();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'admin') {
      toast.error('Access denied');
      router.push('/');
      return;
    }

    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);

    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(setOrders)
      .catch(console.error);
  }, [user, router]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });
      toast.success('Order updated');
      
      fetch('/api/admin/orders')
        .then(res => res.json())
        .then(setOrders);
    } catch {
      toast.error('Failed to update order');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6">
            <div className="text-gray-600 mb-2">Total Orders</div>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="text-gray-600 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold">KSh {stats.totalRevenue?.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="text-gray-600 mb-2">Total Users</div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded-lg p-6">
            <div className="text-gray-600 mb-2">Total Products</div>
            <div className="text-3xl font-bold">{stats.totalProducts}</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => {
                const address = JSON.parse(order.address_json);
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">#{order.id}</td>
                    <td className="py-3 px-4">{address.name}</td>
                    <td className="py-3 px-4">KSh {order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
