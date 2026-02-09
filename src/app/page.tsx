import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import FlashSale from '@/components/FlashSale';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Home() {
  const products = db.prepare(`
    SELECT p.*, 
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM products p
    ORDER BY p.created_at DESC
    LIMIT 20
  `).all();

  const flashSaleProducts = db.prepare(`
    SELECT p.*, 
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM products p
    WHERE p.discount >= 15
    ORDER BY p.discount DESC
    LIMIT 8
  `).all();

  const topDeals = db.prepare(`
    SELECT p.*, 
           (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
    FROM products p
    WHERE p.discount > 0
    ORDER BY p.rating_avg DESC
    LIMIT 8
  `).all();

  return (
    <div>
      <HeroBanner />

      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Smartphones', slug: 'smartphones', icon: '📱' },
              { name: 'Earphones', slug: 'earphones', icon: '🎧' },
              { name: 'Chargers', slug: 'chargers-cables', icon: '⚡' },
              { name: 'Power Banks', slug: 'power-banks', icon: '🔋' },
              { name: 'Phone Cases', slug: 'phone-cases', icon: '📦' },
              { name: 'Accessories', slug: 'accessories', icon: '🎁' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/c/${cat.slug}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-medium text-sm">{cat.name}</div>
              </Link>
            ))}
          </div>
        </section>

        <FlashSale products={flashSaleProducts} />

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Top Deals</h2>
            <Link href="/deals" className="text-primary hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topDeals.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
