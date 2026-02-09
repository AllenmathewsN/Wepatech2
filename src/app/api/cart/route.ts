import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser, generateSessionId } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
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
    } else {
      cart = db.prepare('SELECT * FROM carts WHERE session_id = ?').get(sessionId);
    }

    if (!cart) {
      return NextResponse.json([]);
    }

    const items = db.prepare(`
      SELECT ci.*, p.title, p.price, p.discount, p.slug,
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `).all(cart.id);

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
