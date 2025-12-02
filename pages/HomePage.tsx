import React, { useEffect, useState } from 'react';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Share2, Bookmark, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await NewsService.getAllNews(12);
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-news-gray" />
      </div>
    );
  }

  // --- CONTENT MAPPING STRATEGY (2 Column Layout) ---
  
  // Main Column: Hero (Index 0)
  const heroNews = news[0];
  
  // Main Column: Sub-stories (Grid below hero) - Take 3 items
  const subHeroNews = news.slice(1, 4);
  
  // Right Column: Sidebar (Index 4+)
  // We prioritize keeping the 'Feature' feel for the top of sidebar
  const featureRight = news[4];
  const smallRight = news.slice(5, 10); // Take rest

  return (
    <div className="min-h-screen bg-white text-news-black font-sans">
      <Header />
      
      <main className="container mx-auto max-w-[1200px] px-4 py-8">
        
        {/* MAIN LAYOUT: Desktop 2 cols (Main 75% - Sidebar 25%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* =========================================
              COLUMN 1: MAIN CONTENT (Hero + Sub-grid)
              lg:col-span-9
             ========================================= */}
          <div className="lg:col-span-9 pr-0 lg:pr-6">
             
             {heroNews ? (
                <section>
                    {/* Hero Title */}
                    <Link to={`/${heroNews.category}/${heroNews.slug}`} className="group block mb-5">
                        <h2 className="font-serif-headline text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-center md:text-left group-hover:opacity-80">
                            {heroNews.title}
                        </h2>
                    </Link>

                    {/* Hero Image Area */}
                    <div className="relative mb-8 group cursor-pointer">
                         <div className="aspect-[16/9] bg-gray-200 w-full relative overflow-hidden">
                            {heroNews.imageUrl ? (
                                <img src={heroNews.imageUrl} alt={heroNews.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-serif-headline italic">
                                    No Image Available
                                </div>
                            )}
                            
                            {/* Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                                <p className="text-white text-sm font-sans opacity-95 font-medium max-w-3xl">
                                    <span className="font-bold text-gray-300 uppercase text-xs mr-2">{heroNews.sourceName}:</span>
                                    {heroNews.summary}
                                </p>
                            </div>
                         </div>

                         {/* Floating Actions Sidebar (Fake) */}
                         <div className="absolute top-4 right-4 flex flex-col gap-2">
                             <div className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-news-black hover:bg-gray-100 cursor-pointer border border-gray-200">
                                 <Share2 className="w-4 h-4" />
                             </div>
                             <div className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-news-black hover:bg-gray-100 cursor-pointer border border-gray-200">
                                 <Bookmark className="w-4 h-4" />
                             </div>
                         </div>
                    </div>

                    {/* Three Related Articles Below Hero (Grid) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-6">
                        {subHeroNews.map(item => (
                             <div key={item.id} className="group flex flex-col h-full">
                                <Link to={`/${item.category}/${item.slug}`} className="flex-grow">
                                    {/* Optional small thumb for sub-items if available */}
                                    {item.imageUrl && (
                                        <div className="aspect-[3/2] mb-3 overflow-hidden bg-gray-100 hidden md:block">
                                            <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                                        </div>
                                    )}
                                    <div className="text-[10px] font-bold text-accent-red uppercase tracking-wider mb-2">
                                        {item.category}
                                    </div>
                                    <h3 className="font-serif-headline font-bold text-xl leading-snug mb-3 group-hover:underline underline-offset-4 decoration-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-news-gray leading-relaxed line-clamp-3 mb-3">
                                        {item.summary || item.markdownContent.slice(0, 80)}...
                                    </p>
                                </Link>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-auto">
                                    <span>{item.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>3 min read</span>
                                </div>
                             </div>
                        ))}
                    </div>
                </section>
             ) : (
                 <div className="text-center py-20 font-serif-headline italic text-gray-400">Loading top stories...</div>
             )}
          </div>


          {/* =========================================
              COLUMN 2: SIDEBAR (Right)
              lg:col-span-3
             ========================================= */}
          <div className="lg:col-span-3 pt-8 lg:pt-0 pl-0 lg:pl-6">
             
             {/* Sidebar Header */}
             <div className="mb-6 flex items-center justify-between">
                 <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-gray-900 border-b border-black pb-1">
                     Trending & Features
                 </h4>
             </div>

             {/* Feature Card */}
             {featureRight && (
                <div className="mb-8 group cursor-pointer">
                    <div className="aspect-[3/2] bg-gray-100 mb-3 overflow-hidden">
                        {featureRight.imageUrl ? (
                            <img src={featureRight.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">Feature Image</div>
                        )}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {featureRight.category} Feature
                    </div>
                    <Link to={`/${featureRight.category}/${featureRight.slug}`}>
                        <h3 className="font-serif-headline font-bold text-lg leading-tight mb-2 group-hover:text-gray-600">
                            {featureRight.title}
                        </h3>
                        <p className="text-sm text-news-gray leading-relaxed mb-2 line-clamp-3">
                            {featureRight.summary || "Read more about this trending topic..."}
                        </p>
                    </Link>
                </div>
             )}

             {/* Vertical List of Small Cards */}
             <div className="flex flex-col gap-6 mb-6">
                {smallRight.map((item, idx) => (
                    <div key={item.id} className="group border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                        <Link to={`/${item.category}/${item.slug}`} className="flex gap-3 items-start">
                             <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                                 {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"/>}
                             </div>
                             <div>
                                <h4 className="font-serif-headline font-bold text-sm leading-snug mb-1 group-hover:text-accent-red line-clamp-3">
                                    {item.title}
                                </h4>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                    {item.sourceName}
                                </span>
                             </div>
                        </Link>
                    </div>
                ))}
             </div>

             {/* Slider Controls (Fake) */}
             <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-[10px] font-bold text-gray-400">PAGE 1 / 4</span>
                <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
             </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};