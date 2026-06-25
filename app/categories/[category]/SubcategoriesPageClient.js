'use client';

import Link from 'next/link';
import { getSubcategories } from '../../data/categories';
import Breadcrumb from '../../components/Breadcrumb';

export default function SubcategoriesPageClient({ categorySlug }) {
  const data = getSubcategories(categorySlug);

  if (!data) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
        <Link href="/categories" className="text-cyan-600 hover:text-cyan-700 font-semibold">
          ← Back to All Categories
        </Link>
      </div>
    );
  }

  const { category, subcategories } = data;

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[
        { label: 'All Categories', href: '/categories' },
        { label: category.name, href: null }
      ]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{category.name}</h1>
        <p className="text-gray-600 text-lg">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.slug}
            href={`/categories/${categorySlug}/${subcategory.slug}`}
            className="group bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-cyan-500 hover:shadow-xl transition-all duration-300"
          >
            <div className="h-48 bg-gray-100 relative overflow-hidden">

              <img
                src={subcategory.image || 'https://placehold.co/600x400/f3f4f6/0891b2?text=' + encodeURIComponent(subcategory.name)}
                alt={subcategory.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/10 transition-colors duration-300"></div>
              
              {/* Badge */}
              <div className="absolute top-3 right-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                View Products
              </div>
            </div>

            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                {subcategory.name}
                <svg className="w-5 h-5 text-cyan-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                {subcategory.description}
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
          href="/categories"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Categories
        </Link>
      </div>
    </div>
  );
}
