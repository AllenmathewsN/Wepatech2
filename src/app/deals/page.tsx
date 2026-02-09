import ProductCard from '@/components/ProductCard';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function DealsPage() {
  const products = db.prepare(`
    SELECT p.*, 
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM products p
    WHERE p.discount > 0
    ORDER BY p.discount DESC, p.rating_avg DESC
  `).all();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 Top Deals</h1>
        <p className="text-gray-600">Amazing discounts on phones and accessories</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No deals available at the moment
        </div>
      )}
    </div>
  );
}
