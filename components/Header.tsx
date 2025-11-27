import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Newspaper } from 'lucide-react';

export const Header: React.FC = () => {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');

  return (
    <header className="border-b-4 border-black mb-8 bg-white">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs font-sans text-gray-500 border-b border-gray-200">
        <div>{dateStr}</div>
        <div className="space-x-4">
          {!isAdmin && <Link to="/admin/login" className="hover:text-black hover:underline">Admin Login</Link>}
          {isAdmin && <Link to="/" className="hover:text-black hover:underline">Back to Public Site</Link>}
        </div>
      </div>

      {/* Main Title */}
      <div className="container mx-auto px-4 py-6 text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
            <Newspaper className="w-8 h-8 md:w-12 md:h-12 text-black" />
            <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tight text-news-black group-hover:opacity-80 transition-opacity">
            BruceNews
            </h1>
        </Link>
        <p className="mt-2 text-sm font-serif italic text-gray-600">The Daily Chronicle of Artificial Intelligence</p>
      </div>

      {/* Navigation Line (Decorative for Guest, Functional potential) */}
      <div className="border-t border-b border-black py-2">
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
             <nav className="hidden md:flex space-x-8 font-sans text-sm font-bold uppercase tracking-widest text-gray-800">
                <span className="cursor-pointer hover:text-black">World</span>
                <span className="cursor-pointer hover:text-black">Technology</span>
                <span className="cursor-pointer hover:text-black">Machine Learning</span>
                <span className="cursor-pointer hover:text-black">Ethics</span>
                <span className="cursor-pointer hover:text-black">Business</span>
             </nav>
             <button className="md:hidden">
                <Menu className="w-5 h-5" />
             </button>
        </div>
      </div>
    </header>
  );
};