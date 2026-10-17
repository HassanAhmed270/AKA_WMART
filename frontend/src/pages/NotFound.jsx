import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex items-center justify-center px-4 pt-28 pb-16">
      <div className="max-w-md w-full text-center">

        <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>

        <h2 className="mt-4 text-2xl font-semibold">
          Page not found
        </h2>

        <p className="mt-2 opacity-70">
          The page you are looking for doesn't exist or has moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-lg font-semibold bg-[#d4af37] text-[#0f172a] hover:bg-[#c9a633] transition-colors"
          >
            Go to Home
          </Link>

          <Link
            to="/products"
            className="px-6 py-2.5 rounded-lg font-semibold border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors"
          >
            Browse Products
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
