import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser, generateSessionId } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { productId, variantId, qty = 1 } = await request.json();
    const auth = await getCurrentUser();
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId && !auth) {
      sessionId = generateSessionId();
      cookieStore.set('session_id', sessionId, { maxAge: 60 * 60 * 24 * 30 });
    }

    let cart: any;
    if (auth) {
      cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(auth.userId);
      if (!cart) {
        const result = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(auth.userId);
        cart = { id: result.lastInsertRowid };
      }
    } else {
      cart = db.prepare('SELECT * FROM carts WHERE session_id = ?').get(sessionId);
      if (!cart) {
        const result = db.prepare('INSERT INTO carts (session_id) VALUES (?)').run(sessionId);
        cart = { id: result.lastInsertRowid };
      }
    }

    const existing = db.prepare(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))'
    ).get(cart.id, productId, variantId, variantId);

    if (existing) {
      db.prepare('UPDATE cart_items SET qty = qty + ? WHERE id = ?').run(qty, (existing as any).id);
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, product_id, variant_id, qty) VALUES (?, ?, ?, ?)').run(
        cart.id, productId, variantId, qty
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
