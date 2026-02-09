import ProductCard from '@/components/ProductCard';
import FlashSale from '@/components/FlashSale';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function FlashSalesPage() {
  const products = db.prepare(`
    SELECT p.*, 
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM products p
    WHERE p.discount >= 15
    ORDER BY p.discount DESC
  `).all();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">⚡ Flash Sales</h1>
        <p className="text-gray-600">Limited time offers - Grab them before they're gone!</p>
      </div>

      <FlashSale products={products.slice(0, 8)} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">All Flash Sale Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
