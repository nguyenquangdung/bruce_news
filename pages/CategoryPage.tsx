import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { formatCategoryName } from '../constants';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { NewsCard } from '../components/NewsCard';
import { Loader2 } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const displayCategory = formatCategoryName(category || '');

  useEffect(() => {
    const fetchCategoryNews = async () => {
      setLoading(true);
      if (!category) return;
      try {
        const data = await NewsService.getNewsByCategory(category);
        setNews(data);
      } catch (error) {
        console.error("Failed to load news for category", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
    window.scrollTo(0, 0);
  }, [category]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <main className="container mx-auto px-4 flex-grow max-w-[1200px] py-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-news-black mb-8 border-b-4 border-black pb-4 uppercase">
          {displayCategory} News
        </h1>
        
        {loading ? (
           <div className="flex justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
           </div>
        ) : (
           <>
             {news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                  {news.map((item) => (
                    <div key={item.id} className="h-full">
                      <NewsCard item={item} />
                    </div>
                  ))}
                </div>
             ) : (
                <div className="text-center py-20 text-gray-500 font-serif italic text-lg">
                  No articles found in this section yet.
                </div>
             )}
           </>
        )}
      </main>

      <Footer />
    </div>
  );
};