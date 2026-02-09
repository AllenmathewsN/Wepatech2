import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalRevenue = db.prepare('SELECT SUM(total) as sum FROM orders').get() as any;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;

    return NextResponse.json({
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.sum || 0,
      totalUsers: totalUsers.count,
      totalProducts: totalProducts.count,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}
