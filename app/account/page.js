'use client';

import { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user data - in production this would come from authentication
  const user = {
    name: 'John Smith',
    email: 'john.smith@company.com',
    company: 'ABC Medical Supplies Inc.',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, New York, NY 10001',
    memberSince: 'January 2023'
  };

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      items: 5,
      status: 'Delivered',
      total: 'Cart Approved'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      items: 3,
      status: 'In Transit',
      total: 'Cart Approved'
    },
    {
      id: 'ORD-2023-089',
      date: '2023-12-20',
      items: 12,
      status: 'Delivered',
      total: 'Cart Approved'
    }
  ];

  const cartRequests = [
    {
      id: 'QT-2024-015',
      date: '2024-01-18',
      items: 7,
      status: 'Pending Response'
    },
    {
      id: 'QT-2024-012',
      date: '2024-01-14',
      items: 4,
      status: 'Cart Sent'
    }
  ];

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'My Account', href: null }]} />

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile, orders, and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  activeTab === 'profile'
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </div>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  activeTab === 'orders'
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Orders
                </div>
              </button>

              <button
                onClick={() => setActiveTab('carts')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  activeTab === 'carts'
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Cart Requests
                </div>
              </button>

              <Link
                href="/cart"
                className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Cart
                </div>
              </Link>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                  activeTab === 'settings'
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </div>
              </button>
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      defaultValue={user.company}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
                    <textarea
                      defaultValue={user.address}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Member since {user.memberSince}</span>
                  <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-lg transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-gray-900 mb-1">Order #{order.id}</div>
                          <div className="text-sm text-gray-600">Placed on {order.date}</div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Items</div>
                            <div className="font-semibold text-gray-900">{order.items}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Total</div>
                            <div className="font-semibold text-gray-900">{order.total}</div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <button className="text-cyan-600 hover:text-cyan-700 font-semibold">
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Carts Tab */}
          {activeTab === 'carts' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Requests</h2>
                
                <div className="space-y-4">
                  {cartRequests.map((cart) => (
                    <div key={cart.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-gray-900 mb-1">Cart #{cart.id}</div>
                          <div className="text-sm text-gray-600">Requested on {cart.date}</div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Items</div>
                            <div className="font-semibold text-gray-900">{cart.items}</div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              cart.status === 'Cart Sent' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {cart.status}
                            </span>
                          </div>
                          <button className="text-cyan-600 hover:text-cyan-700 font-semibold">
                            View Cart →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/cart" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Request New Cart
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Password & Security</h3>
                    <button className="text-cyan-600 hover:text-cyan-700 font-semibold">
                      Change Password →
                    </button>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600" />
                        <span className="text-gray-700">Order updates and shipping notifications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-cyan-600" />
                        <span className="text-gray-700">Cart responses and pricing updates</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-cyan-600" />
                        <span className="text-gray-700">New product announcements</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back.</p>
                    <button className="text-red-600 hover:text-red-700 font-semibold border border-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
