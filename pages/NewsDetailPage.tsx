import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsService } from '../services/newsService';
import { NewsItem } from '../types';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Loader2, ArrowUpRight } from 'lucide-react';
import { formatCategoryName } from '../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- SUB-COMPONENTS ---

const ArticleHeader: React.FC<{ news: NewsItem; readTime: number }> = ({ news, readTime }) => (
  <div className="mb-12 text-center max-w-4xl mx-auto">
    <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-6">
      <Link to={`/section/${news.category}`} className="text-red-700 hover:underline">
        {formatCategoryName(news.category)}
      </Link>
      <span className="text-slate-300">|</span>
      <span>{news.date}</span>
      <span className="text-slate-300">|</span>
      <span>{readTime} MIN READ</span>
    </div>

    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
      {news.title}
    </h1>

    {news.summary && (
      <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-serif antialiased max-w-2xl mx-auto">
        {news.summary}
      </p>
    )}
  </div>
);

const ArticleImage: React.FC<{ imageUrl?: string; caption?: string; sourceName?: string }> = ({ imageUrl, caption, sourceName }) => {
  if (!imageUrl) return null;
  return (
    <figure className="mb-16 max-w-[1200px] mx-auto">
      <div className="w-full aspect-[21/9] md:aspect-[2/1] bg-slate-100 overflow-hidden rounded-sm">
        <img
          src={imageUrl}
          alt={caption || 'Article Hero'}
          className="w-full h-full object-cover"
        />
      </div>
      {(caption || sourceName) && (
        <figcaption className="mt-3 text-xs text-slate-500 text-center font-sans tracking-wide">
          {caption} {sourceName && <span className="uppercase font-semibold">IMAGE SOURCE: {sourceName}</span>}
        </figcaption>
      )}
    </figure>
  );
};

const TableOfContents: React.FC<{ sections: { id: string; title: string }[] }> = ({ sections }) => {
  if (sections.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto mb-16 border-t border-b border-slate-200 py-8">
      <span className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Contents</span>
      <ul className="flex flex-col md:flex-row md:flex-wrap gap-x-8 gap-y-3">
        {sections.map((sec, idx) => (
          <li key={sec.id} className="flex items-center gap-2">
            <span className="text-slate-300 text-xs font-mono">0{idx + 1}</span>
            <a 
              href={`#${sec.id}`}
              className="font-serif text-lg text-slate-700 hover:text-red-700 hover:underline decoration-1 underline-offset-4 transition-colors"
            >
              {sec.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ArticleSection: React.FC<{ 
  id: string; 
  title?: string; 
  content: string; 
  sourceUrl?: string; 
}> = ({ id, title, content, sourceUrl }) => (
  <section id={id} className="mb-16 scroll-mt-24 max-w-3xl mx-auto">
    {title && (
      <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6 border-l-4 border-slate-900 pl-4 leading-tight">
        {title}
      </h2>
    )}
    
    <div className="prose prose-lg prose-slate max-w-none 
                    prose-p:text-slate-800 prose-p:font-sans prose-p:leading-[1.8] prose-p:mb-6
                    prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900
                    prose-strong:font-bold prose-strong:text-slate-900
                    prose-blockquote:border-l-2 prose-blockquote:border-red-700 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p({ node, children, className, ...props }) {
            // Ghép text tất cả children lại để kiểm tra
            const textContent = (Array.isArray(children)
              ? children.map((c) => (typeof c === "string" ? c : "")).join("")
              : typeof children === "string"
                ? children
                : ""
            ).trim();

            const isSource = textContent.toLowerCase().startsWith('nguồn:') || 
                             textContent.toLowerCase().startsWith('nguồn gốc:');
            
            // Style riêng cho dòng nguồn
            // Dùng !important để override style mặc định của typography plugin (prose)
            const finalClassName = isSource 
               ? `${className || ''} !text-xs !text-sky-700 italic font-medium mt-1` 
               : className;

            return (
              <p {...props} className={finalClassName}>
                {children}
              </p>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>

    {sourceUrl && (
      <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
        <a 
          href={sourceUrl}
          target="_blank" 
          rel="noreferrer"
          className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
        >
          Source Reference <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    )}
  </section>
);

// --- MAIN PAGE COMPONENT ---

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

  // Logic: Scan Markdown, split by '## ' (H2)
  const articleSections = useMemo(() => {
    if (!newsItem?.markdownContent) return [];

    // Regex to split by H2, capturing the H2 title line if possible
    // Strategy: Split by newline followed by '## '
    const rawChunks = newsItem.markdownContent.split(/\n(?=##\s)/);

    return rawChunks.map((chunk, index) => {
      // 1. Identify Title
      const titleMatch = chunk.match(/^##\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : (index === 0 ? undefined : `Section ${index}`);
      
      // 2. Remove the H2 line from content to avoid double rendering
      const content = chunk.replace(/^##\s+.*$/m, '').trim();

      // 3. Map a source from the `sources` array if it exists at this index
      // If index 0 is Intro (no H2), it gets sources[0].
      // This is a rough 1-to-1 mapping as per "source at end of each section" request
      const sectionSource = newsItem.sources?.[index];

      return {
        id: `section-${index}`,
        title, // Intro chunk (index 0) usually has no title unless it started with ##
        content,
        sourceUrl: sectionSource
      };
    });
  }, [newsItem]);

  // Filter sections that actually have a title for the TOC
  const tocItems = useMemo(() => {
    return articleSections
      .filter(s => s.title) // Only show items with titles in TOC
      .map(s => ({ id: s.id, title: s.title! }));
  }, [articleSections]);

  const readTime = useMemo(() => {
    if (!newsItem?.markdownContent) return 0;
    return Math.ceil(newsItem.markdownContent.split(/\s+/).length / 200);
  }, [newsItem]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!newsItem) return <div className="text-center py-20">Article not found</div>;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900">
      <Header />

      <main className="py-12 md:py-20 px-4 md:px-6">
        
        {/* 1. Header (Title, Meta) */}
        <ArticleHeader news={newsItem} readTime={readTime} />

        {/* 2. Hero Image */}
        <ArticleImage 
          imageUrl={newsItem.imageUrl} 
          caption={newsItem.title} 
          sourceName={newsItem.sourceName} 
        />

        {/* 3. Table of Contents */}
        <TableOfContents sections={tocItems} />

        {/* 4. Render Sections */}
        <article className="mb-20">
          {articleSections.map((section) => (
            <ArticleSection 
              key={section.id}
              {...section}
            />
          ))}

          {/* Fallback: If strict sources array didn't cover everything or we want to ensure the main source is visible */}
          {(!newsItem.sources || newsItem.sources.length === 0) && newsItem.sourceUrl && (
             <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200">
                 <p className="text-sm text-slate-500">
                     Original Source: <a href={newsItem.sourceUrl} target="_blank" rel="noreferrer" className="text-red-700 hover:underline">{newsItem.sourceName || newsItem.sourceUrl}</a>
                 </p>
             </div>
          )}
        </article>

        {/* 5. Tags */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3">
              {newsItem.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider text-slate-500 hover:border-slate-400 hover:text-slate-900 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};