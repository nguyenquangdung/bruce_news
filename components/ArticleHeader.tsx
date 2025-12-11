import React from 'react';
import { NewsItem } from '../types';
import { formatCategoryName } from '../constants';
import { Clock, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleHeaderProps {
  news: NewsItem;
  readTime: number;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ news, readTime }) => {
  return (
    <header className="mb-10">
      {/* Category & Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-6 font-sans text-sm">
        <Link 
          to={`/section/${news.category}`}
          className="px-3 py-1 bg-primary/10 text-primary font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-white transition-colors"
        >
          {formatCategoryName(news.category)}
        </Link>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{news.date}</span>
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{readTime} min read</span>
        </div>
         <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-gray-500">
          <Eye className="w-4 h-4" />
          <span>{news.views.toLocaleString()}</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-8">
        {news.title}
      </h1>

      {/* Hero Image */}
      {news.imageUrl && (
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden shadow-lg mb-8 bg-gray-100 group">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
          
          {/* Source Credit */}
          <div className="absolute bottom-4 right-4 text-xs text-white/90 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
            Source: {news.sourceName}
          </div>
        </div>
      )}

      {/* Summary / Lead */}
      {news.summary && (
        <div className="prose prose-lg max-w-none border-l-4 border-accent bg-accent-light/50 p-6 rounded-r-lg">
          <p className="text-xl md:text-2xl font-serif italic text-gray-700 m-0 leading-relaxed">
            {news.summary}
          </p>
        </div>
      )}
    </header>
  );
};