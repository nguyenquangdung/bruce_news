import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Loader2 } from 'lucide-react';
import { ArticleHeader } from '../components/ArticleHeader';
import { ArticleFooter } from '../components/ArticleFooter';
import { NewsContent } from '../components/NewsContent';
import { TableOfContents } from '../components/TableOfContents';

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
        if (item) NewsService.incrementView(item.id, item.views);
      } catch (error) {
        console.error("Failed to load article", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const readTime = useMemo(() => {
    if (!newsItem?.markdownContent) return 0;
    return Math.ceil(newsItem.markdownContent.split(/\s+/).length / 200);
  }, [newsItem]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 text-gray-500 font-serif italic">Loading article...</p>
      </div>
    );
  }

  if (!newsItem) return (
    <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
                <p className="text-gray-500">The article you are looking for does not exist or has been removed.</p>
            </div>
        </div>
        <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/20 selection:text-primary-dark">
      <Header />

      <main className="container mx-auto max-w-[1280px] px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Content (70% approx - 8 cols) */}
          <article className="lg:col-span-8 lg:col-start-1">
             {/* 1. Header Component */}
             <ArticleHeader news={newsItem} readTime={readTime} />

             {/* 2. Main Markdown Content */}
             <NewsContent content={newsItem.markdownContent} />

             {/* 3. Footer Component */}
             <ArticleFooter news={newsItem} />
          </article>

          {/* RIGHT COLUMN: Sidebar (30% approx - 4 cols) */}
          <aside className="lg:col-span-4 lg:col-start-9 relative">
             <TableOfContents markdown={newsItem.markdownContent} />
          </aside>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};