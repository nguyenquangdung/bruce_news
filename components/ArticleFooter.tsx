import React from 'react';
import { NewsItem } from '../types';
import { Share2, Twitter, Facebook, Linkedin, Bookmark } from 'lucide-react';

interface ArticleFooterProps {
  news: NewsItem;
}

export const ArticleFooter: React.FC<ArticleFooterProps> = ({ news }) => {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200">
      
      {/* 1. Tags Cloud */}
      {news.tags && news.tags.length > 0 && (
        <div className="mb-10">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filed Under</h4>
          <div className="flex flex-wrap gap-2">
            {news.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide rounded hover:bg-black hover:text-white transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. Share Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-xl gap-4 mb-10 border border-gray-100">
        <div className="flex items-center gap-3">
            <span className="font-serif font-bold italic text-gray-700">Share this article:</span>
            <div className="flex gap-2">
                <button className="p-2 bg-white rounded-full text-blue-400 shadow-sm hover:shadow hover:bg-blue-50 transition-all border border-gray-100">
                    <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-blue-700 shadow-sm hover:shadow hover:bg-blue-50 transition-all border border-gray-100">
                    <Facebook className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full text-blue-600 shadow-sm hover:shadow hover:bg-blue-50 transition-all border border-gray-100">
                    <Linkedin className="w-4 h-4" />
                </button>
            </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
            <Bookmark className="w-4 h-4" />
            Save for Later
        </button>
      </div>

      {/* 3. Author Card */}
      <div className="flex items-start gap-4 p-6 border-2 border-gray-100 rounded-xl bg-white">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
          BN
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">Bruce News Automation</h4>
          <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">AI Journalism Engine</p>
          <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
            Our automated system aggregates and synthesizes the latest developments in AI, Science, and Technology from verified global sources. Delivering clarity at the speed of innovation.
          </p>
        </div>
      </div>
    </footer>
  );
};