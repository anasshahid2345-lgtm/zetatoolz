'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleEmailInquiry = () => {
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const subject = `Order Status & Tracking Request`;
    const body = `Hello,

I would like to request an update on my recent order. Please find the order details below:

Order Date: {{ORDER_DATE}}
Product(s) Ordered: ${product.name}
Article Number: ${product.id}

Kindly share the current status of the order and the tracking information, if available.

Thank you.

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

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="h-56 bg-gray-100 relative overflow-hidden group block">
        <img 
          src={product.image || 'https://placehold.co/400x400/f3f4f6/6b7280?text=' + encodeURIComponent(product.name)} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.children[0].style.display = 'flex';
          }}
        />
      </Link>
      
      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] hover:text-cyan-600 transition-colors cursor-pointer">{product.name}</h3>
        </Link>
        
        {/* Product ID Badge */}
        <div className="mb-3">
          <span className="inline-block text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
            ID: {product.id}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        

        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button 
            onClick={() => addToCart(product)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm border border-gray-300"
            title="Add to Cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add to Cart
          </button>
          
          <button 
            onClick={handleEmailInquiry}
            className="text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            style={{ backgroundColor: '#00afef' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Inquiry
          </button>
        </div>
      </div>
    </div>
  );
}
