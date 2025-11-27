import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Loader2, Calendar, ExternalLink, Eye, ArrowLeft, Tag } from 'lucide-react';
import { formatCategoryName } from '../constants';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ category: string; slug: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      try {
        const item = await NewsService.getNewsBySlug(slug);
        setNewsItem(item);
        
        // Increment view count subtly in background
        if (item) {
          NewsService.incrementView(item.id, item.views);
        }
      } catch (error) {
        console.error("Failed to load article", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <h2 className="font-serif text-3xl font-bold mb-4">404 - Article Not Found</h2>
            <p className="text-gray-500 mb-8">The article you are looking for has been moved or archived.</p>
            <Link to="/" className="text-black underline font-bold">Return to Front Page</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />

      <main className="container mx-auto px-4 flex-grow max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-sans text-xs font-bold uppercase tracking-widest mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Headlines
        </Link>

        <article className="bg-white p-8 md:p-12 shadow-sm border border-gray-200">
            {/* Header Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-sans text-gray-500 mb-6 border-b border-gray-100 pb-6">
                <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm">
                    {formatCategoryName(newsItem.category)}
                </span>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{newsItem.date}</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <Eye className="w-4 h-4" />
                    <span>{newsItem.views.toLocaleString()} reads</span>
                </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                {newsItem.title}
            </h1>

            {/* Image */}
            {newsItem.imageUrl && (
                <div className="mb-10 bg-gray-100">
                    <img 
                        src={newsItem.imageUrl} 
                        alt={newsItem.title}
                        className="w-full h-auto max-h-[600px] object-cover"
                    />
                    <p className="text-right text-xs text-gray-400 mt-2 italic">Image source: {newsItem.sourceName}</p>
                </div>
            )}

            {/* Summary Section (Intro) */}
            {newsItem.summary && (
              <div className="mb-8 p-4 bg-gray-50 border-l-4 border-gray-300 font-serif text-xl italic text-gray-700 leading-relaxed">
                {newsItem.summary}
              </div>
            )}

            {/* Content */}
            <div className="font-serif text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-line mb-12 max-w-none">
                {newsItem.markdownContent}
            </div>

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                 {newsItem.tags.map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                   </span>
                 ))}
              </div>
            )}

            {/* Source Footer */}
            <div className="bg-gray-50 p-6 border-l-4 border-black rounded-r">
                <h3 className="font-bold font-sans text-sm uppercase tracking-wide text-gray-500 mb-2">Original Source</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-serif text-lg font-bold">{newsItem.sourceName}</p>
                        <p className="text-sm text-gray-500 truncate max-w-md">{newsItem.sourceUrl}</p>
                    </div>
                    <a 
                        href={newsItem.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors"
                    >
                        Read Full Source <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};