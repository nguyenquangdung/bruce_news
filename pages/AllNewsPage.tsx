import React, { useEffect, useState } from 'react';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { Loader2 } from 'lucide-react';

export const AllNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await NewsService.getAllNews(); // Fetch all items (no limit)
        setNews(data);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <main className="container mx-auto px-4 flex-grow max-w-7xl">
        <h1 className="font-serif text-4xl font-bold mb-8 border-b-4 border-black pb-4 mt-4">All News Archives</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {news.map((item) => (
              <div key={item.id} className="h-full">
                <NewsCard item={item} />
              </div>
            ))}
            
            {news.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                    <p className="font-serif text-xl">No news articles found in the archives.</p>
                </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};