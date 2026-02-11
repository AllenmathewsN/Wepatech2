import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent mb-4">
              WEPATECH
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Kenya's premier destination for luxury smartphones and premium accessories. 
              Curated excellence, delivered with distinction.
            </p>
            <div className="flex gap-3">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-amber-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="text-sm">📱</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-amber-400">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-amber-400 transition-colors">Concierge Service</Link></li>
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Order Tracking</Link></li>
              <li><Link href="/returns" className="hover:text-amber-400 transition-colors">Returns & Exchange</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/warranty" className="hover:text-amber-400 transition-colors">Warranty Information</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-amber-400">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Wepatech</Link></li>
              <li><Link href="/careers" className="hover:text-amber-400 transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-amber-400 transition-colors">Press & Media</Link></li>
              <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-amber-400">Experience Wepatech</h4>
            <p className="text-gray-400 text-sm mb-4">Download our app for exclusive offers</p>
            <div className="space-y-3">
              <button className="w-full bg-white text-black px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-amber-50 transition-all duration-300 group">
                <span className="text-3xl">📱</span>
                <div className="text-left text-xs">
                  <div className="text-gray-600 group-hover:text-gray-700">Download on</div>
                  <div className="font-bold text-sm">App Store</div>
                </div>
              </button>
              <button className="w-full bg-white text-black px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-amber-50 transition-all duration-300 group">
                <span className="text-3xl">🤖</span>
                <div className="text-left text-xs">
                  <div className="text-gray-600 group-hover:text-gray-700">Get it on</div>
                  <div className="font-bold text-sm">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2024 Wepatech. Crafted with excellence in Kenya.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payments
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                Express Delivery
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Authentic Products
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
