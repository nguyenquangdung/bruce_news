import React, { useEffect, useState } from 'react';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsCard } from '../components/NewsCard';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch only the latest 10 news items for the homepage
        const data = await NewsService.getAllNews(10);
        setNews(data);
      } catch (error) {
        console.error("Failed to load news", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9f9]">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="mt-4 font-serif text-gray-500 italic">Printing today's edition...</p>
      </div>
    );
  }

  // Layout Logic: First item is Hero, rest are sidebar items
  const heroNews = news.length > 0 ? news[0] : null;
  const standardNews = news.length > 1 ? news.slice(1) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <main className="container mx-auto px-4 flex-grow max-w-7xl">
        {/* Newspaper Grid Layout: Big Left (8) vs List Right (4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: HERO STORY */}
          <div className="lg:col-span-8">
            {heroNews ? (
              <section className="h-full">
                <NewsCard item={heroNews} isHero={true} />
              </section>
            ) : (
                <div className="text-center py-20">
                    <h2 className="font-serif text-2xl text-gray-500">No headlines to report today.</h2>
                </div>
            )}
          </div>

          {/* RIGHT COLUMN: RECENT STORIES LIST */}
          <div className="lg:col-span-4 flex flex-col h-full border-t lg:border-t-0 lg:border-l border-black pt-8 lg:pt-0 lg:pl-10">
             
             {/* Section Label */}
             <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-red-700 mb-6 border-b border-gray-200 pb-2">
                  Latest Updates
             </h3>

             {/* Vertical List */}
             <div className="flex flex-col divide-y divide-gray-200">
                {standardNews.map((item) => (
                    <div key={item.id} className="py-6 first:pt-0">
                        <NewsCard item={item} />
                    </div>
                ))}
                
                {standardNews.length === 0 && (
                    <p className="text-sm text-gray-400 italic">More news coming soon.</p>
                )}
             </div>

             {/* See More Button */}
             <div className="mt-8 pt-6 border-t border-gray-200">
                <Link to="/all-news" className="group flex items-center justify-between font-serif font-bold text-lg hover:text-red-700 transition-colors">
                    <span>See All News</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>

          </div>
        </div>

        {/* About Section - Moved to bottom */}
        <section className="mt-20 border-t-4 border-black pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    <h2 className="font-serif text-3xl font-bold mb-4">About BruceNews</h2>
                    <p className="font-serif text-lg text-gray-600 leading-relaxed">
                        The premier destination for AI journalism. Delivering raw signals from the frontier of technology. We are dedicated to providing clarity in the age of intelligence, cutting through the noise to bring you the stories that matter.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-sm border border-gray-200">
                   <p className="font-sans text-sm text-gray-600">
                     <strong>Editor's Note:</strong> All news is published immediately for transparency. Our mission is to democratize access to information about Artificial Intelligence and its impact on society.
                   </p>
                </div>
             </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};