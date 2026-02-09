import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = db.prepare(`
      SELECT p.*
      FROM products p
      WHERE p.slug = ?
    `).get(params.slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all((product as any).id);
    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all((product as any).id);

    return NextResponse.json({
      ...product,
      images,
      variants,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 });
  }
}
