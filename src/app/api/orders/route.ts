import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { address, paymentMethod, total, deliveryFee } = await request.json();
    const auth = await getCurrentUser();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    let cart: any;
    if (auth) {
      cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(auth.userId);
    } else {
      cart = db.prepare('SELECT * FROM carts WHERE session_id = ?').get(sessionId);
    }

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cartItems = db.prepare(`
      SELECT ci.*, p.price, p.discount
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `).all(cart.id);

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderResult = db.prepare(`
      INSERT INTO orders (user_id, status, total, delivery_fee, address_json, payment_method)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      auth?.userId || null,
      'placed',
      total,
      deliveryFee,
      JSON.stringify(address),
      paymentMethod
    );

    const orderId = orderResult.lastInsertRowid;

    for (const item of cartItems as any[]) {
      const price = item.price - (item.price * item.discount / 100);
      db.prepare(`
        INSERT INTO order_items (order_id, product_id, variant_id, qty, price_at_purchase)
        VALUES (?, ?, ?, ?, ?)
      `).run(orderId, item.product_id, item.variant_id, item.qty, price);
    }

    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id);

    return NextResponse.json({ id: orderId, success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auth = await getCurrentUser();
    
    if (!auth) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(auth.userId);

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get orders' }, { status: 500 });
  }
}
