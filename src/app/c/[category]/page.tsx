'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brands: [] as string[],
    minRating: 0,
    inStock: false,
    discountOnly: false,
  });
  const [sort, setSort] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams();
    query.set('category', params.category as string);
    query.set('sort', sort);
    if (filters.minPrice) query.set('minPrice', filters.minPrice);
    if (filters.maxPrice) query.set('maxPrice', filters.maxPrice);
    if (filters.brands.length) query.set('brands', filters.brands.join(','));
    if (filters.minRating) query.set('minRating', filters.minRating.toString());
    if (filters.inStock) query.set('inStock', 'true');
    if (filters.discountOnly) query.set('discountOnly', 'true');

    fetch(`/api/categories/products?${query}`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, [params.category, filters, sort]);

  const brands = ['Samsung', 'Apple', 'Tecno', 'Infinix', 'Xiaomi', 'Nokia', 'Anker', 'Oraimo'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {(params.category as string).replace('-', ' ')}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-lg p-4 sticky top-24">
            <h3 className="font-semibold mb-4">Filters</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm">Brand</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, brands: [...filters.brands, brand] });
                        } else {
                          setFilters({ ...filters, brands: filters.brands.filter(b => b !== brand) });
                        }
                      }}
                      className="rounded"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2 text-sm">Rating</h4>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                className="input-field text-sm"
              >
                <option value="0">All Ratings</option>
                <option value="4">4★ & above</option>
                <option value="3">3★ & above</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="rounded"
                />
                In Stock Only
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.discountOnly}
                  onChange={(e) => setFilters({ ...filters, discountOnly: e.target.checked })}
                  className="rounded"
                />
                Discounted Items
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">{products.length} products found</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field w-auto text-sm"
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found matching your filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
