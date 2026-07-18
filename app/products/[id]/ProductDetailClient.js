'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';

export default function ProductDetailClient({ id }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    // Find product by ID
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct);
    
    // Initialize variant if available
    if (foundProduct?.variants?.length > 0) {
      setSelectedVariant(foundProduct.variants[0]);
    }
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedVariant]);

  const handleEmailInquiry = () => {
    if (!product) return;
    
    const today = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const variantInfo = selectedVariant ? ` - ${selectedVariant.name}` : '';
    const subject = `Order Status & Tracking Request`;
    const body = `Hello,

I would like to request an update on my recent order. Please find the order details below:

Order Date: ${today}
Product(s) Ordered: ${product.name}${variantInfo}
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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="text-cyan-600 hover:text-cyan-700 font-medium">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Use variant image(s) if selected, otherwise use product images or single image
  const imageGallery = selectedVariant
    ? (selectedVariant.images && selectedVariant.images.length > 0 ? selectedVariant.images : [selectedVariant.image])
    : (product.images && product.images.length > 0 
        ? product.images 
        : [product.image || 'https://placehold.co/800x800/f3f4f6/6b7280?text=' + encodeURIComponent(product.name)]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-cyan-600 transition-colors">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-cyan-600 transition-colors">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-500 hover:text-cyan-600 transition-colors">
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl border-2 border-gray-200 relative cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              {imageGallery[selectedImage] && (
                <Image
                  src={
                    imageErrors[imageGallery[selectedImage]]
                      ? 'https://placehold.co/800x800/f3f4f6/6b7280?text=' + encodeURIComponent(product?.name || '')
                      : imageGallery[selectedImage]
                  }
                  alt={product?.name || 'Product Image'}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-200 ease-out"
                  style={{
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    transformOrigin: isZoomed ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center'
                  }}
                  onError={() => {
                    setImageErrors(prev => ({ ...prev, [imageGallery[selectedImage]]: true }));
                  }}
                />
              )}
              
              {/* Zoom indicator */}
              {isZoomed && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 z-10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                  Zoomed 2x
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {imageGallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                    selectedImage === idx 
                      ? 'border-cyan-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Image
                    src={imageErrors[img] ? 'https://placehold.co/400x400/f3f4f6/6b7280?text=View+' + (idx + 1) : img}
                    alt={`${product?.name || 'Product'} view ${idx + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => {
                      setImageErrors(prev => ({ ...prev, [img]: true }));
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                {product.category}
              </span>
              <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {product.subcategory}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Product ID */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Product ID:</span>
                <span className="text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-md">{product.id}</span>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Product Overview</h3>
              <span className="text-gray-700 leading-relaxed block whitespace-pre-line" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Available Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.name}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                        selectedVariant?.name === variant.name
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => {
                  const cartItem = {
                    ...product,
                    id: selectedVariant ? `${product.id}-${selectedVariant.name}` : product.id,
                    name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
                    image: imageGallery[0],
                    originalId: product.id
                  };
                  addToCart(cartItem);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to Cart
              </button>
              
              <button 
                onClick={handleEmailInquiry}
              className="text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              style={{ backgroundColor: '#00afef' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Inquiry
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-700">ISO Certified</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-700">Fast Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-700">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          </div>
          <div className="space-y-4">
            <span className="text-gray-700 leading-relaxed block whitespace-pre-line text-base animate-fade-in" dangerouslySetInnerHTML={{ __html: product.details?.overview || product.description || '' }} />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-10 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Order?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Contact our sales team for bulk pricing, custom orders, or any questions about this product.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleEmailInquiry}
            className="text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#00afef' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
          >
              Contact Sales Team
            </button>
            <Link 
              href="/products"
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all"
            >
              View More Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
