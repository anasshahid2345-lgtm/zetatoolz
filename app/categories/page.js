'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getMainCategories } from '../data/categories';
import Breadcrumb from '../components/Breadcrumb';

export default function CategoriesPage() {
  const categories = getMainCategories();

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'All Categories', href: null }]} />
      
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Product Categories</h1>
        <p className="text-gray-600 text-lg">
          Browse our comprehensive catalog of precision instruments and industrial tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300"
          >
            <div className="h-56 bg-gray-100 relative overflow-hidden">

              <img
                src={category.image || 'https://placehold.co/600x400/f3f4f6/0891b2?text=' + encodeURIComponent(category.name)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-cyan-600/0 group-hover:bg-cyan-600/10 transition-colors duration-300"></div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors flex items-center justify-between">
                {category.name}
                <svg className="w-5 h-5 text-cyan-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </h2>
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
              
              <div className="mt-4 flex items-center text-cyan-600 text-sm font-semibold">
                <span>Browse Sub-categories</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-12 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help Finding Products?</h3>
            <p className="text-gray-700">
              Contact our sales team at <a href="mailto:info@zetatoolz.com" className="text-cyan-600 hover:text-cyan-700 font-semibold">info@zetatoolz.com</a> for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
