import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-gray-300 py-8 bg-white">
      <div className="container mx-auto px-4 text-center font-sans text-sm text-gray-500">
        <p className="mb-2">© {new Date().getFullYear()} BruceNews. All Rights Reserved.</p>
        <p>Providing clarity in the age of intelligence.</p>
      </div>
    </footer>
  );
};