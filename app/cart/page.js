'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleRequestCart = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Build product list for email
    let productList = '';
    cart.forEach((item, index) => {
      productList += `${item.name} — Article No: ${item.id}\n`;
    });

    const subject = `Request for Quote – Cart Inquiry`;
    const body = `Hello,

I am interested in receiving a quote for the products in my cart. Please find the details below:

Products:
${productList}
Could you please provide the pricing and availability for these products?

Thank you for your assistance.

Best regards,
Customer`;

    // Check if user is on mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, use mailto link which opens the default email app
      const mailtoURL = `mailto:info@zetatoolz.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoURL;
    } else {
      // On desktop, use Gmail compose URL
      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('info@zetatoolz.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailURL, '_blank');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8 max-w-md">Add products to your cart to request pricing from our team.</p>
        <Link 
          href="/products" 
          className="text-white font-bold py-3 px-8 rounded-lg transition-all hover:scale-105"
          style={{ backgroundColor: '#00afef' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart</h1>
        <p className="text-gray-600">Review your items and request a bulk cart from our sales team</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 w-full text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>


              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-500 font-medium">Quantity</span>
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-300">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition rounded-l-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-gray-900 font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition rounded-r-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2"
                  aria-label="Remove item"
                  title="Remove from cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <button 
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 underline font-medium"
            >
              Clear All Items
            </button>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border-2 border-cyan-200 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Cart Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Total Items:</span>
                <span className="font-semibold">{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Total Quantity:</span>
                <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} units</span>
              </div>
              
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="bg-cyan-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-cyan-800 font-semibold mb-1">💼 Pricing Information</p>
                  <p className="text-xs text-cyan-700">
                  Request a cart to receive current pricing for your specific requirements.
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleRequestCart}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Request Cart for All Items
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              📧 Opens your email client with pre-filled cart request
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
