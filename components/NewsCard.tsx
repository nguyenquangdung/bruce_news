import React from 'react';
import { NewsItem } from '../types';
import { ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCategoryName } from '../constants';

interface NewsCardProps {
  item: NewsItem;
  isHero?: boolean;
  hideImage?: boolean; // New prop to optionally hide image in tight lists
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isHero = false, hideImage = false }) => {
  // Construct the internal URL: /category-slug/news-slug
  // We clean the category for the URL (e.g. "Machine Learning" -> "machine-learning")
  const categorySlug = item.category?.toLowerCase().replace(/\s+/g, '-') || 'general';
  const detailUrl = `/${categorySlug}/${item.slug}`;

  // Prioritize summary, fall back to markdown content if summary is missing
  const previewText = item.summary || item.markdownContent;

  return (
    <article className={`flex flex-col h-full bg-white group`}>
      
      {/* Category Badge & Meta */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 font-sans flex-wrap">
        <span className="text-red-700 flex-shrink-0">{formatCategoryName(item.category)}</span>
        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span className="text-black truncate max-w-[150px]">{item.sourceName}</span>
        {!isHero && (
          <>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="flex-shrink-0">{item.date}</span>
          </>
        )}
      </div>

      {/* Image (Optional) - Now Clickable */}
      {item.imageUrl && !hideImage && (
        <Link to={detailUrl} className={`block mb-4 overflow-hidden ${isHero ? 'aspect-video' : 'aspect-[3/2]'} bg-gray-100`}>
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'; // Hide if broken
            }}
          />
        </Link>
      )}

      {/* Title - Now Clickable */}
      <Link to={detailUrl} className="block">
        <h2 className={`font-serif font-bold text-news-black leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4 ${isHero ? 'text-4xl md:text-6xl mb-6' : 'text-lg md:text-xl'}`}>
            {item.title}
        </h2>
      </Link>

      {/* Content Preview (Summary) */}
      <div className={`font-sans text-news-gray leading-relaxed whitespace-pre-line mb-4 ${isHero ? 'text-lg md:text-xl line-clamp-6' : 'text-sm line-clamp-3'}`}>
        {previewText}
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-4 flex justify-between items-center">
        {isHero ? (
             <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>{item.date}</span>
                <span className="w-px h-3 bg-gray-300"></span>
                <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-black transition-colors flex items-center gap-1">
                    Source <ExternalLink className="w-3 h-3" />
                </a>
             </div>
        ) : (
            <a 
            href={item.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-wide"
            >
            Source <ExternalLink className="w-3 h-3" />
            </a>
        )}

        {/* View Count */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans" title="Reader Views">
          <Eye className="w-3.5 h-3.5" />
          <span>{item.views.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
};