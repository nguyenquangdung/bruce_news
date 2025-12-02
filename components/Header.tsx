import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const location = useLocation();

  // Helper to check active state
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <header className="flex flex-col font-sans">
      {/* 1. Top Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-[1200px] px-4 py-1.5 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-[11px] font-medium text-news-gray tracking-wide">
          
          {/* Left: Date */}
          <div className="mb-1 md:mb-0">
            <span className="font-bold text-black">{dateStr}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>Today’s Paper</span>
          </div>

          {/* Center: Domain */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 font-bold text-gray-400">
            brucenews.com
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="bg-[#1a3c5e] text-white px-3 py-1 rounded-[3px] font-bold hover:bg-blue-900 transition-colors uppercase text-[9px] tracking-wider">
              Subscribe
            </button>
            <Link to="/admin/login" className="border border-[#1a3c5e] text-[#1a3c5e] px-3 py-1 rounded-[3px] font-bold hover:bg-gray-50 transition-colors uppercase text-[9px] tracking-wider">
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Logo Area */}
      <div className="py-6 md:py-8 text-center bg-white">
        <Link to="/" className="inline-block group">
          <h1 className="font-serif-headline text-4xl md:text-6xl lg:text-[64px] font-black text-news-black leading-none tracking-tight group-hover:opacity-90">
            Bruce News
          </h1>
        </Link>
      </div>

      {/* 3. Navigation Bar */}
      <div className="border-t border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm md:shadow-none md:static">
        <div className="container mx-auto max-w-[1200px] px-4">
          <div className="flex items-center justify-between md:justify-center h-10 md:h-12">
            
            {/* Mobile Menu Icon */}
            <button className="md:hidden text-news-black">
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-news-black font-sans">
              <Link 
                to="/section/ai" 
                className={`${isActive('/section/ai') ? 'border-b-2 border-black pb-0.5' : 'text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2'}`}
              >
                AI
              </Link>
              <Link 
                to="/section/chung-khoan" 
                className={`${isActive('/section/chung-khoan') ? 'border-b-2 border-black pb-0.5' : 'text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2'}`}
              >
                Chứng khoán
              </Link>
              <Link 
                to="/section/crypto" 
                className={`${isActive('/section/crypto') ? 'border-b-2 border-black pb-0.5' : 'text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2'}`}
              >
                Crypto
              </Link>
              <Link 
                to="/section/us" 
                className={`${isActive('/section/us') ? 'border-b-2 border-black pb-0.5' : 'text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2'}`}
              >
                US
              </Link>
              <Link 
                to="/section/vietnam" 
                className={`${isActive('/section/vietnam') ? 'border-b-2 border-black pb-0.5' : 'text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2'}`}
              >
                Vietnam
              </Link>
            </nav>

             {/* Search Icon (Mobile placeholder) */}
             <button className="md:hidden text-news-black">
               <Search className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};