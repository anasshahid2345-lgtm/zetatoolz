'use client';

import Breadcrumb from '../components/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'About Us', href: null }]} />

      {/* Hero Section */}
      <div className="mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">About Zetatoolz</h1>
      </div>
{/* Certifications */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="h-32 flex items-center justify-center mb-4">
              <img 
                src="/Cirtificates/ISO-9001.png" 
                alt="ISO 9001:2015 Certified" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">ISO 9001:2015</h3>
          </div>
          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="h-32 flex items-center justify-center mb-4">
              <img 
                src="/Cirtificates/CE.png" 
                alt="CE Certified" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">CE Certified</h3>
          </div>
          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="h-32 flex items-center justify-center mb-4">
              <img 
                src="/Cirtificates/SCCI.png" 
                alt="SCCI Member" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">SCCI Member</h3>
          </div>
          <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="h-32 flex items-center justify-center mb-4">
              <img 
                src="/Cirtificates/SIMAP.png" 
                alt="SIMAP Member" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="font-bold text-gray-900 text-center mb-2">SIMAP Member</h3>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center border border-cyan-200">
          <div className="text-4xl font-bold text-cyan-600 mb-2">28+</div>
          <div className="text-gray-700 font-medium">Years Experience</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center border border-cyan-200">
          <div className="text-4xl font-bold text-cyan-600 mb-2">150+</div>
          <div className="text-gray-700 font-medium">Countries Served</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center border border-cyan-200">
          <div className="text-4xl font-bold text-cyan-600 mb-2">5000+</div>
          <div className="text-gray-700 font-medium">Product Varieties</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 text-center border border-cyan-200">
          <div className="text-4xl font-bold text-cyan-600 mb-2">100%</div>
          <div className="text-gray-700 font-medium">Quality Certified</div>
        </div>
      </div> */}

      {/* Our Story */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">A Legacy of Craftsmanship. A Future of Innovation.</h2>
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4 leading-relaxed">
              Based in the heart of <strong>Sialkot, Pakistan</strong> — a city known worldwide for its manufacturing excellence — we are a <strong>family-owned business</strong> with decades of experience in crafting high-quality Beauty Instruments, Dental Instruments, Embroidery hoops & tools, and Lockpicking tools and sets.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              What started as a small workshop has grown into a trusted name for international buyers seeking consistent quality and dependable manufacturing.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed font-semibold">
              We pride ourselves on:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-gray-700">
                <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Using only the finest stainless steel</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Strict quality control at every stage</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom designs and OEM / private label solutions</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast, professional, and reliable customer service</span>
              </li>
            </ul>
            <p className="text-gray-700 mb-2 leading-relaxed text-lg">
              We don't just sell tools — we build long-term partnerships.
            </p>
            <p className="text-cyan-600 font-bold text-lg">
              Let's grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16" >
        <div className="rounded-xl p-8 text-white" style={{ backgroundColor: '#4FB9E3' }}>
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl font-bold">Our Mission</h2>
          </div>
          <p className="text-cyan-50 leading-relaxed">
            To provide high-quality instruments and tools that combine precision, reliability, and innovation, ensuring our customers receive the best products with exceptional service.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border-2 border-cyan-200">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To be a trusted global leader in premium instruments and tools, known for quality, innovation, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
            <p className="text-gray-600">
              Every product undergoes stringent quality checks to ensure it meets international standards and exceeds customer expectations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously invest in research and development to bring cutting-edge precision instruments to market.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Focus</h3>
            <p className="text-gray-600">
              Your success is our success. We provide personalized service and support to ensure complete satisfaction.
            </p>
          </div>
        </div>
      </div>


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
    </div>
  );
}