import React from 'react';
import { NewsItem } from '../types';
import { formatCategoryName } from '../constants';
import { Clock, Calendar, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleHeaderProps {
  news: NewsItem;
  readTime: number;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ news, readTime }) => {
  return (
    <header className="mb-12 font-serif">
      {/* Category & Meta */}
      <div className="flex flex-wrap items-center gap-4 mb-6 font-sans text-xs md:text-sm border-b border-gray-200 pb-4">
        <Link 
          to={`/section/${news.category}`}
          className="font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
        >
          {formatCategoryName(news.category)}
        </Link>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-1 text-gray-500 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{news.date}</span>
        </div>
        <span className="text-gray-300">/</span>
        <div className="flex items-center gap-1 text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{readTime} min read</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8 tracking-tight">
        {news.title}
      </h1>

      {/* Dashed Box: Media & Summary ("The Briefing") */}
      {(news.imageUrl || news.summary) && (
        <div className="border-2 border-dashed border-primary/40 rounded-xl p-2 md:p-3 mb-10 bg-white">
            
            {/* Hero Image */}
            {news.imageUrl && (
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg overflow-hidden shadow-sm mb-3">
                <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <div className="text-[10px] text-white/90 font-sans uppercase tracking-wider flex items-center gap-2">
                         <span className="bg-black/50 px-2 py-1 rounded">Source: {news.sourceName}</span>
                    </div>
                </div>
                </div>
            )}

            {/* Summary / Lead Paragraph */}
            {news.summary && (
                <div className="bg-amber-50/80 p-6 rounded-lg border border-amber-100">
                     <p className="text-lg md:text-xl font-serif text-gray-800 leading-relaxed italic">
                        <span className="font-bold text-primary not-italic block text-xs font-sans uppercase tracking-widest mb-2">The Briefing</span>
                        {news.summary}
                     </p>
                </div>
            )}
        </div>
      )}

      {/* Author Line (if needed here, though Footer has it too, usually nice to have byline up top) */}
      <div className="flex items-center gap-3 font-sans text-sm text-gray-600 mb-8">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User className="w-4 h-4" />
          </div>
          <div>
              By <span className="font-bold text-gray-900">Bruce News Automation</span>
          </div>
      </div>
    </header>
  );
};