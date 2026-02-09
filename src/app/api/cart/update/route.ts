import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { itemId, qty } = await request.json();

    if (qty < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    db.prepare('UPDATE cart_items SET qty = ? WHERE id = ?').run(qty, itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
