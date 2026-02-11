'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, cartCount } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white'}`}>
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2.5">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">✦</span>
            <span className="font-medium">Premium Shopping Experience in Kenya</span>
          </div>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-amber-400 transition-colors">Concierge</Link>
            <Link href="/track" className="hover:text-amber-400 transition-colors">Track Order</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent flex-shrink-0 hover:scale-105 transition-transform">
            WEPATECH
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search premium phones & accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3.5 pr-14 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 group-hover:border-amber-300"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6 flex-shrink-0">
            {user ? (
              <Link href="/account" className="flex items-center gap-2 hover:text-amber-600 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-all">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name}</span>
              </Link>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium hidden lg:block">Sign In</span>
              </Link>
            )}

            <Link href="/cart" className="relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:shadow-lg transition-all">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3 text-sm font-medium">
            <div className="relative">
              <button
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
                className="flex items-center gap-2 hover:text-amber-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Collections
              </button>
              
              {showCategories && (
                <div
                  onMouseEnter={() => setShowCategories(true)}
                  onMouseLeave={() => setShowCategories(false)}
                  className="absolute top-full left-0 bg-white shadow-2xl rounded-xl w-72 py-3 mt-2 border border-gray-100 animate-slide-up"
                >
                  <Link href="/c/smartphones" className="block px-6 py-3 hover:bg-amber-50 transition-colors">
                    <div className="font-semibold text-gray-900">📱 Premium Smartphones</div>
                    <div className="text-xs text-gray-500 mt-0.5">Flagship devices</div>
                  </Link>
                  <Link href="/c/accessories" className="block px-6 py-3 hover:bg-amber-50 transition-colors">
                    <div className="font-semibold text-gray-900">🎧 Luxury Accessories</div>
                    <div className="text-xs text-gray-500 mt-0.5">Premium audio & more</div>
                  </Link>
                  <Link href="/c/chargers-cables" className="block px-6 py-3 hover:bg-amber-50 transition-colors">
                    <div className="font-semibold text-gray-900">⚡ Power Solutions</div>
                    <div className="text-xs text-gray-500 mt-0.5">Fast charging essentials</div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/deals" className="hover:text-amber-600 transition-colors">Exclusive Offers</Link>
            <Link href="/flash-sales" className="hover:text-amber-600 transition-colors">Limited Editions</Link>
            <Link href="/new-arrivals" className="hover:text-amber-600 transition-colors">New Arrivals</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
