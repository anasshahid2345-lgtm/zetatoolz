'use client';

import Link from 'next/link';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link href="/" className="text-cyan-600 hover:text-cyan-700 font-medium transition">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          {item.href ? (
            <Link href={item.href} className="text-cyan-600 hover:text-cyan-700 font-medium transition">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
