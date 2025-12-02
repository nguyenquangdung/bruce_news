import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { Loader2, Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
          setNews([]);
          return;
      }
      
      setLoading(true);
      try {
        const data = await NewsService.searchNews(query);
        setNews(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
        setHasSearched(true);
      }
    };

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <main className="container mx-auto px-4 flex-grow max-w-[1200px] py-12">
        <div className="mb-10 border-b-4 border-black pb-6">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-news-black mb-2">
            Search Results
            </h1>
            <p className="text-gray-500 font-sans">
                Showing results for: <span className="font-bold text-black">"{query}"</span>
            </p>
        </div>
        
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Loader2 className="w-10 h-10 animate-spin mb-4" />
             <p>Searching archives...</p>
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
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-400 mb-6">
                      <Search className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any articles matching "{query}". Try adjusting your search terms or browse our categories.
                  </p>
                </div>
             )}
           </>
        )}
      </main>

      <Footer />
    </div>
  );
};