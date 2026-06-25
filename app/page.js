'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from './components/ProductCard';
import { products } from './data/products';
import { categoriesData } from './data/categories';

export default function Home() {
  const featuredProducts = products.slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Build slides dynamically from categories data - MEGA CATEGORY SWITCHER
  const slides = Object.keys(categoriesData).map(categorySlug => {
    const category = categoriesData[categorySlug];
    
    // Get top 3 subcategories for this main category
    const subcategoryKeys = Object.keys(category.subcategories).slice(0, 3);
    const topSubcategories = subcategoryKeys.map(subSlug => ({
      slug: subSlug,
      categorySlug: categorySlug,
      ...category.subcategories[subSlug]
    }));

    // Assign colors based on category
    const colorMap = {
      'beauty-instruments': '#8fcfe9ff',
      'medical-instruments': '#8fcfe9ff',
      'industrial-tools': '#8fcfe9ff',
      'jewelry-tools': '#8fcfe9ff'
    };

    return {
      categorySlug,
      categoryName: category.name,
      description: category.description,
      bgColor: colorMap[categorySlug] || '#8fcfe9ff',
      viewAllLink: `/categories/${categorySlug}`,
      subcategories: topSubcategories
    };
  });

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play carousel (only if slides exist)
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);
 

  // Show a welcome message if no categories exist yet
  if (slides.length === 0) {
    return (
      <div className="space-y-12 md:space-y-20">
        {/* Empty State Hero */}
        <section className="relative h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 text-white/80 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-xl">
              Welcome to Zeta Tools
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Your B2B platform for precision instruments is ready. Add your first products via the admin dashboard to get started.
            </p>
            <Link 
              href="/admin"
              className="inline-flex items-center gap-2 bg-white text-cyan-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:scale-105 text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Go to Admin Dashboard
            </Link>
            <p className="text-white/70 mt-6 text-sm">
              Default password: <span className="font-mono bg-white/20 px-3 py-1 rounded">admin123</span>
            </p>
          </div>
        </section>

        {/* Trust Signals / Features Bar */}
        <section className="bg-slate-800 rounded-xl md:rounded-2xl shadow-lg -mt-6 md:-mt-10 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-8 md:py-10">
            {/* Feature 1: On Time Deliveries */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">On Time Deliveries</h3>
              <p className="text-xs md:text-sm text-slate-400 font-light">
                Global shipping with guaranteed delivery timelines for all orders
              </p>
            </div>

            {/* Feature 2: Quality Guaranteed */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">Quality Guaranteed</h3>
              <p className="text-xs md:text-sm text-slate-400 font-light">
                Surgical-grade stainless steel with precision manufacturing standards
              </p>
            </div>

            {/* Feature 3: ISO 9001 & CE Certified */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">ISO 9001 & CE Certified</h3>
              <p className="text-xs md:text-sm text-slate-400 font-light">
                Internationally certified manufacturing meeting medical-grade standards
              </p>
            </div>

            {/* Feature 4: 24/7 Customer Support */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">24/7 Customer Support</h3>
              <p className="text-xs md:text-sm text-slate-400 font-light">
                Dedicated technical support team available worldwide
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-20">
      {/* Hero Carousel Section */}
      <section className="relative h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
        {/* Background with gradient */}
        <div 
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: '#4fb9e3',
            backgroundImage: 'linear-gradient(90deg, rgba(79, 185, 227, 1) 0%, rgba(255, 255, 255, 1) 64%)'
          }}
        />

        {/* Content Container */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          {/* Left Side - Typography */}
          <div className="w-full lg:w-[45%] z-10 animate-fade-in">
            <div className="mb-2 text-white/90 text-xs sm:text-sm font-medium tracking-widest uppercase">
              {slides[currentSlide].description}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-4 sm:mb-6 leading-tight drop-shadow-xl">
              {slides[currentSlide].categoryName}
            </h1>
            <Link 
              href={slides[currentSlide].viewAllLink}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium tracking-wide mt-2 sm:mt-4 border-b border-white/30 hover:border-white pb-1 transition-all text-sm sm:text-base"
            >
              View All Sub-categories
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            {/* Navigation Dots */}
            <div className="flex gap-2 sm:gap-3 mt-8 sm:mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-8 sm:w-12 h-2 sm:h-3 bg-white' 
                      : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Horizontal Subcategory Cards Stacked (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:w-[55%] h-full items-center justify-end relative pr-4">
            <div className="relative w-full h-[520px] flex flex-col justify-center gap-4">
              {slides[currentSlide].subcategories.slice(0, 3).map((sub, idx) => (
                <div
                  key={sub.slug}
                  className={`relative transition-all duration-700 animate-fade-in hover:scale-105 ${
                    idx === 1 ? 'hover:scale-[1.03] z-20' : ''
                  }`}
                  style={{ 
                    width: idx === 1 ? '480px' : '380px', 
                    height: idx === 1 ? '200px' : '140px', 
                    marginLeft: 'auto' 
                  }}
                >
                  <Link href={`/categories/${sub.categorySlug}/${sub.slug}`} className="block w-full h-full">
                    <div className={`relative w-full h-full bg-white rounded-xl shadow-xl overflow-hidden border-2 border-white group ${idx === 1 ? 'rounded-2xl shadow-2xl border-4' : ''}`}>
                      <Image
                        src={sub.image || 'https://placehold.co/600x400/png?text=Image+Not+Found'}
                        alt={sub.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className={`absolute inset-0 flex items-center ${idx === 1 ? 'bg-gradient-to-r from-black/70 via-black/40 to-transparent p-6' : 'bg-gradient-to-r from-black/60 to-transparent p-5'}`}>

                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls - Horizontal on Mobile, Vertical on Desktop */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-30 lg:hidden">
          <button
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Vertical Navigation for Desktop */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>


      

      {/* Featured Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
          <div>
             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Featured Instruments</h2>
          </div>
          <Link href="/products" className="text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 group text-sm sm:text-base whitespace-nowrap">
            View Full Catalog <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

       {/* CTA */}
      <div className="rounded-xl p-10 text-center text-white" style={{ backgroundColor: '#4FB9E3' }}>
        <h2 className="text-3xl font-bold mb-4">Explore Our Full Range</h2>
        <p className="text-cyan-50 mb-6 max-w-2xl mx-auto text-lg">
          Discover our complete collection of precision instruments and find the perfect tools for your professional requirements.
        </p>
        <div className="flex justify-center">
          <a 
            href="/products"
            className="bg-white text-cyan-600 font-bold py-3 px-8 rounded-lg hover:bg-cyan-50 transition"
          >
            Browse Catalog
          </a>
        </div>
      </div>

      {/* Trust Signals / Features Bar */}
      <section className="bg-slate-800 rounded-xl md:rounded-2xl shadow-lg -mt-6 md:-mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 sm:px-6 md:px-8 py-8 md:py-10">
          {/* Feature 1: On Time Deliveries */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">On Time Deliveries</h3>
            <p className="text-xs md:text-sm text-slate-400 font-light">
              Global shipping with guaranteed delivery timelines for all orders
            </p>
          </div>

          {/* Feature 2: Quality Guaranteed */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">Quality Guaranteed</h3>
            <p className="text-xs md:text-sm text-slate-400 font-light">
              Surgical-grade stainless steel with precision manufacturing standards
            </p>
          </div>

          {/* Feature 3: ISO 9001 & CE Certified */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">ISO 9001 & CE Certified</h3>
            <p className="text-xs md:text-sm text-slate-400 font-light">
              Internationally certified manufacturing meeting medical-grade standards
            </p>
          </div>

          {/* Feature 4: 24/7 Customer Support */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-slate-600 flex items-center justify-center mb-3 md:mb-4 group-hover:border-cyan-500 transition-colors">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-slate-300 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">24/7 Customer Support</h3>
            <p className="text-xs md:text-sm text-slate-400 font-light">
              Dedicated technical support team available worldwide
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
