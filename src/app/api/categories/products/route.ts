import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const sort = searchParams.get('sort') || 'popularity';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const brands = searchParams.get('brands')?.split(',').filter(Boolean);
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock') === 'true';
    const discountOnly = searchParams.get('discountOnly') === 'true';

    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(categorySlug);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let query = `
      SELECT p.*, 
             (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM products p
      WHERE p.category_id = ?
    `;
    const params: any[] = [(category as any).id];

    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }

    if (brands && brands.length > 0) {
      query += ` AND p.brand IN (${brands.map(() => '?').join(',')})`;
      params.push(...brands);
    }

    if (minRating) {
      query += ' AND p.rating_avg >= ?';
      params.push(Number(minRating));
    }

    if (inStock) {
      query += ' AND p.stock > 0';
    }

    if (discountOnly) {
      query += ' AND p.discount > 0';
    }

    switch (sort) {
      case 'price-asc':
        query += ' ORDER BY p.price ASC';
        break;
      case 'price-desc':
        query += ' ORDER BY p.price DESC';
        break;
      case 'newest':
        query += ' ORDER BY p.created_at DESC';
        break;
      case 'rating':
        query += ' ORDER BY p.rating_avg DESC';
        break;
      default:
        query += ' ORDER BY p.rating_count DESC';
    }

    const products = db.prepare(query).all(...params);

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}
