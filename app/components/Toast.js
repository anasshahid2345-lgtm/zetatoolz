'use client';

import { useEffect } from 'react';

export default function Toast({ message, productName, productImage, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-20 right-4 z-[100] animate-slide-in-right">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-cyan-500 overflow-hidden max-w-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white font-semibold text-sm">Added to Cart</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex items-center gap-3">
          {/* Product Image */}
          {productImage && (
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/100x100/f3f4f6/6b7280?text=Product';
                }}
              />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
              {productName}
            </p>
            <p className="text-xs text-gray-500">
              {message}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-progress"
            style={{
              animation: `progress ${duration}ms linear`
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress {
          animation: progress ${duration}ms linear;
        }
      `}</style>
    </div>
  );
}
