import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const orders = db.prepare(`
      SELECT * FROM orders
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getCurrentUser();
    
    if (!auth || auth.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, status } = await request.json();

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
