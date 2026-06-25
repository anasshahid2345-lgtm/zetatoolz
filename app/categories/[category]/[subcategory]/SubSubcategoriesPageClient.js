'use client';

import Link from 'next/link';
import { getCategoryInfo } from '../../../data/categories';
import Breadcrumb from '../../../components/Breadcrumb';
import ProductCard from '../../../components/ProductCard';

export default function SubSubcategoriesPageClient({ categorySlug, subcategorySlug }) {
  const info = getCategoryInfo(categorySlug, subcategorySlug);

  if (!info) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link href="/categories" className="text-cyan-600 hover:text-cyan-700 font-semibold">
          ← Back to All Categories
        </Link>
      </div>
    );
  }

  const { category, subcategory } = info;
  const subsubcategories = subcategory.subsubcategories || [];
  const products = subcategory.products || [];

  // If there are no sub-subcategories, display products directly
  if (subsubcategories.length === 0 && products.length > 0) {
    return (
      <div className="animate-fade-in">
        <Breadcrumb items={[
          { label: 'All Categories', href: '/categories' },
          { label: category.name, href: `/categories/${categorySlug}` },
          { label: subcategory.name, href: null }
        ]} />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{subcategory.name}</h1>
          <p className="text-gray-600 text-lg mb-6">
            {subcategory.description}
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-gray-700"><strong>{products.length}</strong> Products Available</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">ISO 9001 & CE Certified</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Back Navigation */}
        <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
          <Link 
            href={`/categories/${categorySlug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {category.name}
          </Link>

          <Link 
            href="/categories"
            className="text-gray-500 hover:text-cyan-600 text-sm font-medium transition"
          >
            View All Categories →
          </Link>
        </div>

        {/* Contact CTA */}
        <div className="mt-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Need a Custom Cart?</h3>
          <p className="mb-6 text-cyan-50">
            Contact our sales team for bulk orders, custom requirements, or current market pricing
          </p>
          <a 
            href={`mailto:info@zetatoolz.com?subject=Cart Request for ${subcategory.name}`}
            className="inline-flex items-center gap-2 bg-white text-cyan-600 font-bold py-3 px-8 rounded-lg hover:bg-cyan-50 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Sales Team
          </a>
        </div>
      </div>
    );
  }

  // Otherwise, display sub-subcategories
  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[
        { label: 'All Categories', href: '/categories' },
        { label: category.name, href: `/categories/${categorySlug}` },
        { label: subcategory.name, href: null }
      ]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{subcategory.name}</h1>
        <p className="text-gray-600 text-lg">
          {subcategory.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subsubcategories.map((subsub) => (
          <Link
            key={subsub.slug}
            href={`/categories/${categorySlug}/${subcategorySlug}/${subsub.slug}`}
            className="group bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-cyan-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              <img
                src={subsub.products?.[0]?.image || 'https://placehold.co/600x400/f3f4f6/0891b2?text=' + encodeURIComponent(subsub.name)}
                alt={subsub.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/f3f4f6/0891b2?text=' + encodeURIComponent(subsub.name);
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/10 transition-colors duration-300"></div>
              
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                {subsub.products?.length || 0} Products
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                {subsub.name}
                <svg className="w-5 h-5 text-cyan-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {subsub.description}
              </p>
              
              <div className="mt-4 flex items-center text-cyan-600 text-sm font-semibold">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Browse Products</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Back Button */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <Link 
          href={`/categories/${categorySlug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {category.name}
        </Link>
      </div>
    </div>
  );
}
