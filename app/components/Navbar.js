'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { categoriesData } from '../data/categories';
import { products } from '../data/products';

export default function Navbar() {
  const { getCartCount, getCartTotal } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownResults, setDropdownResults] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const isActive = (path) => pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (searchCategory !== 'All') {
        params.set('category', searchCategory);
      }
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Live search as user types
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const searchTerm = searchQuery.toLowerCase();
      const results = products.filter(product => {
        const matchesCategory = searchCategory === 'All' || 
          product.category?.toLowerCase() === searchCategory.toLowerCase() ||
          product.subcategory?.toLowerCase() === searchCategory.toLowerCase();

        const matchesQuery = 
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.id?.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesQuery;
      }).slice(0, 6); // Limit to 6 results in dropdown

      setDropdownResults(results);
      setShowDropdown(true);
    } else {
      setDropdownResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, searchCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const productCategories = Object.keys(categoriesData).map(slug => ({
    name: categoriesData[slug].name,
    href: `/categories/${slug}`,
    subcategories: Object.keys(categoriesData[slug].subcategories).map(subSlug => ({
      name: categoriesData[slug].subcategories[subSlug].name,
      href: `/categories/${slug}/${subSlug}`,
      subsubcategories: Object.keys(categoriesData[slug].subcategories[subSlug].subsubcategories || {}).map(subSubSlug => ({
        name: categoriesData[slug].subcategories[subSlug].subsubcategories[subSubSlug].name,
        href: `/categories/${slug}/${subSlug}/${subSubSlug}`
      }))
    }))
  }));

  // Get all categories for search dropdown
  const allCategories = Object.keys(categoriesData).map(slug => categoriesData[slug].name);

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md">
      {/* 1. Utility Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/zetatoolz?igsh=MTI2NXRkMGJkYmVreQ==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition"
                aria-label="Visit us on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/923016866308" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transition"
                aria-label="Contact us on WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>

            {/* Right Side Utilities */}
            <div className="hidden md:flex items-center gap-4">
              {/* Currency Selector */}
              <Link href="/shipping" className="text-gray-600 hover:text-blue-600 transition">Shipping Info</Link>
              <span className="text-gray-600 border-l pl-4 ml-2">ISO 9001 & CE Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Brand & Search Tier */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-16 w-40 sm:h-24 sm:w-52">
                <Image 
                  src="/ZetaToolsMainLogo.svg" 
                  alt="ZetaToolz Logo" 
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Central Search Bar with Dropdown (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-3xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex items-stretch w-full">
                {/* Category Dropdown */}
                <div className="relative">
                  <select 
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="h-full px-4 pr-8 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                  >
                    <option>All</option>
                    {allCategories.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
                  className="flex-1 px-4 py-2.5 border-t border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                />

                {/* Search Button */}
                <button 
                  type="submit"
                  className="px-6 text-white rounded-r-lg transition flex items-center justify-center"
                  style={{ backgroundColor: '#00afef' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>

              {/* Live Search Dropdown */}
              {showDropdown && dropdownResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-h-[500px] overflow-y-auto">
                  <div className="p-2">
                    {dropdownResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition group text-left"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image || 'https://placehold.co/100x100/f3f4f6/6b7280?text=' + encodeURIComponent(product.name)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/100x100/f3f4f6/6b7280?text=No+Image';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition line-clamp-1 mb-1">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">ID: {product.id}</span>
                            {product.category && (
                              <span className="text-gray-400">• {product.category}</span>
                            )}
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>

                  {/* View All Results Footer */}
                  {searchQuery && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearch(e);
                        }}
                        className="w-full text-center font-medium text-cyan-600 hover:text-cyan-700 transition text-sm py-2"
                      >
                        View all results for "{searchQuery}" →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Actions: Search Button & Cart (Tablet and Mobile) */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Search Button */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-cyan-600 transition"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Cart */}
              <Link 
                href="/cart" 
                className="relative p-2 text-white rounded transition"
                style={{ backgroundColor: '#00afef' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Button (Tablet and Mobile) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-600 hover:text-cyan-600 transition"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* User Action Icons (Desktop only) */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Account */}
              {/* <Link href="/account" className="flex flex-col items-center group">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-gray-600 group-hover:text-cyan-600 transition mt-1">Account</span>
              </Link> */}

              {/* About Us */}
              <Link href="/about" className="flex flex-col items-center group">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-600 group-hover:text-cyan-600 transition mt-1">About Us</span>
              </Link>

              {/* Contact */}
              <Link href="/contact" className="flex flex-col items-center group">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-600 group-hover:text-cyan-600 transition mt-1">Contact</span>
              </Link>

              {/* FAQ */}
              <Link href="/faq" className="flex flex-col items-center group">
                <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-gray-600 group-hover:text-cyan-600 transition mt-1">FAQ</span>
              </Link>
              
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation & Cart Tier (Desktop Only) */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Left: Category Navigation */}
            <nav className="flex items-center gap-1">
              {/* All Categories */}
              <Link 
                href="/categories" 
                className="px-4 py-2 text-sm font-medium text-white rounded transition flex items-center gap-2"
                style={{ backgroundColor: '#00afef' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                All Categories
              </Link>

              {/* Product Categories with Dropdown */}
              {productCategories.map((category) => (
                <div key={category.name} className="relative group h-full flex items-center">
                  <Link 
                    href={category.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition flex items-center gap-1"
                  >
                    {category.name}
                    <svg className="w-3.5 h-3.5 text-gray-500 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top group-hover:translate-y-0 translate-y-2">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden py-2">
                      <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.name}</span>
                      </div>
                      {category.subcategories.map((sub) => (
                        <div key={sub.name} className="relative group/sub pr-4">
                          <Link
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition flex items-center justify-between group/item"
                          >
                            {sub.name}
                            {sub.subsubcategories && sub.subsubcategories.length > 0 ? (
                              <svg className="w-4 h-4 text-gray-400 group-hover/item:text-cyan-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-opacity text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </Link>
                          
                          {/* Nested Submenu for Sub-Subcategories - Appears to the right */}
                          {sub.subsubcategories && sub.subsubcategories.length > 0 && (
                            <div className="absolute left-full top-0 w-64 group-hover/sub:opacity-100 group-hover/sub:visible opacity-100 visible transition-all duration-150 z-[60] pl-1">
                              <div className="bg-white rounded-lg shadow-xl border-2 border-cyan-500 overflow-hidden py-2">
                                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{sub.name}</span>
                                </div>
                                {sub.subsubcategories.map((subsub) => (
                                  <Link
                                    key={subsub.name}
                                    href={subsub.href}
                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition flex items-center justify-between group/subitem"
                                  >
                                    {subsub.name}
                                    <svg className="w-4 h-4 opacity-0 group-hover/subitem:opacity-100 transition-opacity text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Right: Cart */}
            <div className="flex items-center gap-6">

              {/* Shopping Cart */}
              <Link 
                href="/cart" 
                className={`flex items-center gap-2 text-white rounded transition ${getCartCount() > 0 ? 'px-4 py-2' : 'p-3'}`}
                style={{ backgroundColor: '#00afef' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="font-bold text-sm">{getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Menu (Tablet & Mobile) */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[61] lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-600 hover:text-cyan-600 transition rounded-lg hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4">
              <div className="space-y-2">
                {/* Account */}
                {/* <Link 
                  href="/account" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">Account</span>
                </Link> */}

                {/* About Us */}
                <Link 
                  href="/about" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">About Us</span>
                </Link>

                {/* Contact */}
                <Link 
                  href="/contact" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">Contact</span>
                </Link>

                {/* FAQ */}
                <Link 
                  href="/faq" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">FAQ</span>
                </Link>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4" />

                {/* Categories */}
                <Link 
                  href="/categories" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">All Categories</span>
                </Link>

                {/* Cart */}
                <Link 
                  href="/cart" 
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-cyan-50 transition group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 group-hover:text-cyan-600">
                    Cart {getCartCount() > 0 && `(${getCartCount()})`}
                  </span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-gray-600 hover:text-cyan-600 transition"
              aria-label="Close search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-900">Search Products</h2>
          </div>

          {/* Search Form */}
          <div className="p-4">
            <form onSubmit={(e) => {
              handleSearch(e);
              setMobileSearchOpen(false);
            }} className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                >
                  <option>All</option>
                  {allCategories.map(cat => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Enter product name, ID, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 text-sm"
                />
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="w-full py-3 text-white rounded-lg transition flex items-center justify-center gap-2 font-medium"
                style={{ backgroundColor: '#00afef' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Products
              </button>
            </form>

            {/* Live Results */}
            {searchQuery.trim().length > 1 && dropdownResults.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Results</h3>
                <div className="space-y-2">
                  {dropdownResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        handleProductClick(product.id);
                        setMobileSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-4 p-3 bg-gray-50 hover:bg-cyan-50 rounded-lg transition group text-left"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={product.image || 'https://placehold.co/100x100/f3f4f6/6b7280?text=' + encodeURIComponent(product.name)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/100x100/f3f4f6/6b7280?text=No+Image';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition line-clamp-1 mb-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-white px-2 py-0.5 rounded">ID: {product.id}</span>
                          {product.category && (
                            <span className="text-gray-400">• {product.category}</span>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
