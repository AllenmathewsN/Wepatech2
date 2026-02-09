import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = db.prepare(`
      SELECT oi.*, p.title, p.slug
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(id);

    return NextResponse.json({
      ...(order as any),
      items: items.map((item: any) => ({
        ...item,
        product: { title: item.title, slug: item.slug },
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get order' }, { status: 500 });
  }
}
