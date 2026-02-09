'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const { user, cartCount } = useStore();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => useStore.setState({ user: data }))
      .catch(() => {});

    fetch('/api/cart')
      .then(res => res.json())
      .then(data => useStore.getState().setCart(data))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-secondary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between text-sm">
          <span>🇰🇪 Delivering across Kenya</span>
          <div className="flex gap-4">
            <Link href="/help" className="hover:text-primary">Help</Link>
            <Link href="/track" className="hover:text-primary">Track Order</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-primary flex-shrink-0">
            PhonePlace
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for phones, accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded">
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6 flex-shrink-0">
            {user ? (
              <Link href="/account" className="flex items-center gap-2 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">{user.name}</span>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 hover:text-primary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">Account</span>
              </Link>
            )}

            <Link href="/cart" className="relative hover:text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3 text-sm">
            <div className="relative">
              <button
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
                className="flex items-center gap-2 font-medium hover:text-primary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Categories
              </button>
              
              {showCategories && (
                <div
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg w-64 py-2 mt-1"
                >
                  <Link href="/c/smartphones" className="block px-4 py-2 hover:bg-gray-50">📱 Smartphones</Link>
                  <Link href="/c/accessories" className="block px-4 py-2 hover:bg-gray-50">🎧 Phone Accessories</Link>
                  <Link href="/c/chargers-cables" className="block px-4 py-2 hover:bg-gray-50 pl-8">⚡ Chargers & Cables</Link>
                  <Link href="/c/earphones" className="block px-4 py-2 hover:bg-gray-50 pl-8">🎵 Earphones</Link>
                  <Link href="/c/power-banks" className="block px-4 py-2 hover:bg-gray-50 pl-8">🔋 Power Banks</Link>
                  <Link href="/c/phone-cases" className="block px-4 py-2 hover:bg-gray-50 pl-8">📦 Phone Cases</Link>
                </div>
              )}
            </div>
            
            <Link href="/deals" className="hover:text-primary font-medium">🔥 Deals</Link>
            <Link href="/flash-sales" className="hover:text-primary font-medium">⚡ Flash Sales</Link>
            <Link href="/new-arrivals" className="hover:text-primary font-medium">✨ New Arrivals</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
