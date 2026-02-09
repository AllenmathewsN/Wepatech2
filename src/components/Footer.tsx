import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PhonePlace</h3>
            <p className="text-gray-400 text-sm">
              Kenya's trusted online marketplace for phones and accessories.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/track" className="hover:text-primary">Track Order</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Download App</h4>
            <div className="space-y-3">
              <button className="w-full bg-white text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100">
                <span className="text-2xl">📱</span>
                <div className="text-left text-xs">
                  <div className="text-gray-600">Download on</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </button>
              <button className="w-full bg-white text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-100">
                <span className="text-2xl">🤖</span>
                <div className="text-left text-xs">
                  <div className="text-gray-600">Get it on</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 PhonePlace. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
