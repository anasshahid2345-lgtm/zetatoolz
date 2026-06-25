'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { categoriesData } from '../data/categories';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate search delay for better UX
    const timer = setTimeout(() => {
      if (!query) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      // Search logic
      const searchTerm = query.toLowerCase();
      const results = products.filter(product => {
        // Check if product matches the category filter
        const matchesCategory = category === 'All' || 
          product.category?.toLowerCase() === category.toLowerCase() ||
          product.subcategory?.toLowerCase() === category.toLowerCase();

        // Check if product matches the search query
        const matchesQuery = 
          product.name?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm) ||
          product.subcategory?.toLowerCase().includes(searchTerm) ||
          product.id?.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesQuery;
      });

      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, category]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-cyan-600 transition">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results
            {query && ` for "${query}"`}
          </h1>
          
          {category !== 'All' && (
            <p className="text-gray-600">
              in category: <span className="font-semibold text-gray-900">{category}</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Searching products...</p>
          </div>
        )}

        {/* No Query */}
        {!isLoading && !query && (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Search</h2>
            <p className="text-gray-600 mb-6">Enter a keyword to search our product catalog</p>
            <Link 
              href="/products"
              className="inline-block text-white font-medium py-3 px-6 rounded-lg transition"
              style={{ backgroundColor: '#00afef' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && query && (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Found <span className="font-bold text-gray-900">{searchResults.length}</span> {searchResults.length === 1 ? 'result' : 'results'}
              </p>
              
              {searchResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-cyan-500">
                    <option>Relevance</option>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                    <option>Newest First</option>
                  </select>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {searchResults.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching "<strong>{query}</strong>". Try different keywords or browse our categories.
                </p>
                
                {/* Suggestions */}
                <div className="mb-8">
                  <p className="text-sm text-gray-500 mb-4">Try searching for:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link href="/search?q=tweezers" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition">
                      Tweezers
                    </Link>
                    <Link href="/search?q=nippers" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition">
                      Nippers
                    </Link>
                    <Link href="/search?q=scissors" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition">
                      Scissors
                    </Link>
                    <Link href="/search?q=pliers" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition">
                      Pliers
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/products"
                    className="inline-block text-white font-medium py-3 px-6 rounded-lg transition"
                    style={{ backgroundColor: '#00afef' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0099d6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00afef'}
                  >
                    Browse All Products
                  </Link>
                  <Link 
                    href="/categories"
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition"
                  >
                    View Categories
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Popular Categories Section */}
        {!isLoading && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(categoriesData).slice(0, 4).map((slug) => {
                const cat = categoriesData[slug];
                return (
                  <Link
                    key={slug}
                    href={`/categories/${slug}`}
                    className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition group"
                  >
                    <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-100 transition">
                      <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition">
                      {cat.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
