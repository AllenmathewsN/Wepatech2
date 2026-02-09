import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = db.prepare(`
      SELECT p.*
      FROM products p
      WHERE p.slug = ?
    `).get(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all((product as any).id);
    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all((product as any).id);

    return NextResponse.json({
      ...(product as any),
      images,
      variants,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 });
  }
}
