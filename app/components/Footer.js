import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Identity & Contact */}
          <div>
            <div className="mb-6">
              <div className="relative h-16 w-40">
                <Image 
                  src="/ZetaToolsMainLogo.svg" 
                  alt="ZetaToolz Logo" 
                  fill
                  unoptimized
                  className="object-contain object-left"
                />
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-slate-300">
                  Shahab Pura Rd, Sialkot-51310 Pakistan.
                </p>
              </div>
              
              <a href="https://wa.me/923016866308" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <div className="text-slate-300">
                  <p className="text-xs text-slate-400">WhatsApp</p>
                  <p>+92 301 6866308</p>
                </div>
              </a>
              
              <a href="tel:+923016866308" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-slate-300">
                  <p className="text-xs text-slate-400">Cell Phone</p>
                  <p>+92 301 6866308</p>
                </div>
              </a>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-300">info@zetatoolz.com</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-3">Follow Us</p>
              <div className="flex gap-3">
                
                <a 
                  href="https://www.instagram.com/zetatoolz?igsh=MTI2NXRkMGJkYmVreQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-600 flex items-center justify-center transition-colors"
                  aria-label="Visit us on Instagram"
                >
                  <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                    <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                
              </div>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">About Us</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">Company Profile</a></li>
              <li><a href="/privacy-policy" className="text-slate-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="/faq" className="text-slate-400 hover:text-cyan-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: My Account */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">My Account</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/login" className="text-slate-400 hover:text-cyan-400 transition-colors">Login / Register</a></li>
              <li><a href="/account" className="text-slate-400 hover:text-cyan-400 transition-colors">My Account</a></li>
              <li><a href="/wishlist" className="text-slate-400 hover:text-cyan-400 transition-colors">Wish List</a></li>
              <li><a href="/newsletter" className="text-slate-400 hover:text-cyan-400 transition-colors">Newsletter</a></li>
            </ul>
          </div>

          {/* Column 4: Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/contact" className="text-slate-400 hover:text-cyan-400 transition-colors">Contact Us</a></li>
              <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@zetatoolz.com&su=Order%20Status%20%26%20Tracking%20Request&body=Hello%2C%0A%0AI%20would%20like%20to%20request%20an%20update%20on%20my%20recent%20order.%20Please%20find%20the%20order%20details%20below%3A%0A%0AOrder%20Date%3A%20%7B%7BORDER_DATE%7D%7D%0A%0AProducts%20Ordered%3A%0A%7B%7BPRODUCT_1_NAME%7D%7D%20%E2%80%94%20Article%20No%3A%20%7B%7BARTICLE_1_NUMBER%7D%7D%0A%7B%7BPRODUCT_2_NAME%7D%7D%20%E2%80%94%20Article%20No%3A%20%7B%7BARTICLE_2_NUMBER%7D%7D%0A%7B%7BPRODUCT_3_NAME%7D%7D%20%E2%80%94%20Article%20No%3A%20%7B%7BARTICLE_3_NUMBER%7D%7D%0A%7B%7BPRODUCT_4_NAME%7D%7D%20%E2%80%94%20Article%20No%3A%20%7B%7BARTICLE_4_NUMBER%7D%7D%0A%7B%7BPRODUCT_5_NAME%7D%7D%20%E2%80%94%20Article%20No%3A%20%7B%7BARTICLE_5_NUMBER%7D%7D%0A%0AKindly%20share%20the%20current%20status%20of%20the%20order%20and%20the%20tracking%20information%2C%20if%20available.%0A%0AThank%20you.%0A%0ABest%20regards%2C%0ACustomer" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">Delivery Information</a></li>
            </ul>
          </div>
        </div>
      </div>

    

      {/* Copyright Bar with Payment Methods */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 text-center md:text-left">
              &copy; {currentYear} ZetaToolz. All rights reserved. | Professional Tools & Equipment
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
