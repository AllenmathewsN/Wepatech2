import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query) {
      return NextResponse.json([]);
    }

    const products = db.prepare(`
      SELECT p.*, 
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM products p
      WHERE p.title LIKE ? OR p.brand LIKE ? OR p.description LIKE ?
      ORDER BY p.rating_count DESC
      LIMIT 50
    `).all(`%${query}%`, `%${query}%`, `%${query}%`);

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
