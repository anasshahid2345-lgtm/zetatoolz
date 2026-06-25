'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FilterSidebar({ 
  categories = [], 
  selectedCategory = null,
  onCategoryChange,
  showCategories = true,
  subcategories = [],
  selectedSubcategory = null,
  onSubcategoryChange,
  showSubcategories = false,
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedCertification, setSelectedCertification] = useState([]);
  const [selectedFinish, setSelectedFinish] = useState([]);

  const materials = [
    'Surgical Grade Stainless Steel',
    'Carbon Steel',
    'Titanium',
    'Brass',
    'Aluminum',
  ];

  const certifications = [
    'ISO 9001',
    'CE Certified',
    'FDA Approved',
    'Medical Grade',
  ];

  const finishes = [
    'Mirror Polish',
    'Satin Finish',
    'Matte Black',
    'Gold Plated',
    'Chrome Plated',
  ];

  const toggleMaterial = (material) => {
    setSelectedMaterial(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleCertification = (cert) => {
    setSelectedCertification(prev =>
      prev.includes(cert)
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    );
  };

  const toggleFinish = (finish) => {
    setSelectedFinish(prev =>
      prev.includes(finish)
        ? prev.filter(f => f !== finish)
        : [...prev, finish]
    );
  };

  const clearAllFilters = () => {
    setSelectedMaterial([]);
    setSelectedCertification([]);
    setSelectedFinish([]);
    if (onCategoryChange) onCategoryChange(null);
    if (onSubcategoryChange) onSubcategoryChange(null);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Categories Filter */}
      {showCategories && categories.length > 0 && (
        <div className="pb-6 border-b border-gray-200">
          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Categories</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {categories.map((category) => (
              <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.slug}
                  onChange={() => onCategoryChange && onCategoryChange(category.slug)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Filter */}
      {showSubcategories && subcategories.length > 0 && (
        <div className="pb-6 border-b border-gray-200">
          <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Subcategories</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {subcategories.map((subcategory) => (
              <label key={subcategory.slug} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubcategory?.includes(subcategory.slug)}
                  onChange={() => onSubcategoryChange && onSubcategoryChange(subcategory.slug)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition">
                  {subcategory.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Material Filter */}
      <div className="pb-6 border-b border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Material</h4>
        <div className="space-y-2">
          {materials.map((material) => (
            <label key={material} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedMaterial.includes(material)}
                onChange={() => toggleMaterial(material)}
                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition">
                {material}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Certification Filter */}
      <div className="pb-6 border-b border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Certifications</h4>
        <div className="space-y-2">
          {certifications.map((cert) => (
            <label key={cert} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCertification.includes(cert)}
                onChange={() => toggleCertification(cert)}
                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition flex items-center gap-1">
                {cert}
                {cert.includes('ISO') || cert.includes('CE') ? (
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Finish Filter */}
      <div className="pb-6 border-b border-gray-200">
        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Finish</h4>
        <div className="space-y-2">
          {finishes.map((finish) => (
            <label key={finish} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFinish.includes(finish)}
                onChange={() => toggleFinish(finish)}
                className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-cyan-600 transition">
                {finish}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedMaterial.length > 0 || selectedCertification.length > 0 || selectedFinish.length > 0) && (
        <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
          <h4 className="text-sm font-bold text-cyan-900 mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {[...selectedMaterial, ...selectedCertification, ...selectedFinish].map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1 bg-white text-cyan-700 text-xs font-medium px-2 py-1 rounded-md border border-cyan-300"
              >
                {filter}
                <button
                  onClick={() => {
                    if (selectedMaterial.includes(filter)) toggleMaterial(filter);
                    if (selectedCertification.includes(filter)) toggleCertification(filter);
                    if (selectedFinish.includes(filter)) toggleFinish(filter);
                  }}
                  className="hover:text-cyan-900"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-5 text-white">
        <div className="flex items-start gap-3 mb-3">
          <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-bold mb-1">Need Assistance?</h4>
            <p className="text-xs text-gray-300 mb-3">
              Our team can help you find the perfect products for your needs.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              Contact Us
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="w-full bg-white border-2 border-gray-300 hover:border-cyan-500 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {/* Mobile Filter Panel */}
        {isMobileFilterOpen && (
          <div className="mt-4 bg-white rounded-lg border-2 border-gray-200 p-6">
            <FilterContent />
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
        <FilterContent />
      </div>
    </>
  );
}
