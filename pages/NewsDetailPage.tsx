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

// --- HELPER ---
const cleanHeading = (text: string | undefined): string | undefined => {
  if (!text) return undefined;
  // Removes pattern like {#abc-xyz} at the end of string
  return text.replace(/\s*\{#.*\}\s*$/, '').trim();
};

// --- SUB-COMPONENTS ---

const ArticleHeader: React.FC<{ news: NewsItem; readTime: number }> = ({ news, readTime }) => (
  <div className="mb-12 text-center max-w-4xl mx-auto">
    <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-6 font-sans">
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
      <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-serif antialiased max-w-2xl mx-auto italic border-l-4 border-gray-200 pl-6 text-left">
        {news.summary}
      </p>
    )}
  </div>
);

const ArticleImage: React.FC<{ imageUrl?: string; caption?: string; sourceName?: string }> = ({ imageUrl, caption, sourceName }) => {
  if (!imageUrl) return null;
  return (
    <figure className="mb-16 max-w-[1200px] mx-auto">
      <div className="w-full aspect-[21/9] md:aspect-[2/1] bg-slate-100 overflow-hidden rounded-sm shadow-sm">
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
    <div className="max-w-3xl mx-auto mb-16 border-t border-b border-gray-200 py-8 bg-gray-50/50 px-6 rounded-sm">
      <span className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 font-sans">Table of Contents</span>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {sections.map((sec, idx) => (
          <li key={sec.id} className="flex items-start gap-3">
            <span className="text-red-700 text-xs font-mono font-bold mt-1">0{idx + 1}</span>
            <a 
              href={`#${sec.id}`}
              className="font-serif text-lg text-slate-700 hover:text-red-700 hover:underline decoration-1 underline-offset-4 transition-colors leading-snug"
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
  <section id={id} className="mb-14 scroll-mt-24 max-w-3xl mx-auto">
    {title && (
      <h2 className="font-serif text-3xl font-bold text-slate-900 mb-6 mt-8 leading-tight">
        {title}
      </h2>
    )}
    
    {/* Typography enhancements: font-serif, leading-relaxed, better colors */}
    <div className="prose prose-lg max-w-none 
                    text-gray-800
                    prose-p:font-serif prose-p:leading-8 prose-p:mb-6 prose-p:text-lg
                    prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
                    prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900
                    prose-strong:font-bold prose-strong:text-slate-900
                    prose-blockquote:border-l-4 prose-blockquote:border-red-700 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:bg-gray-50
                    prose-li:font-serif prose-li:text-gray-800">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          p({ node, children, className, ...props }) {
            // Flatten children to check text content
            const textContent = (Array.isArray(children)
              ? children.map((c) => (typeof c === "string" ? c : "")).join("")
              : typeof children === "string"
                ? children
                : ""
            ).trim();

            const lowerText = textContent.toLowerCase();
            const isSource = lowerText.startsWith('nguồn:') || 
                             lowerText.startsWith('nguồn gốc:');
            
            // Style specifically for "Nguồn" line
            // Blue text, italic, small, with a slight background for emphasis
            const finalClassName = isSource 
               ? `${className || ''} !text-sm !text-blue-700 font-sans italic font-medium mt-2 mb-2 px-3 py-1 bg-blue-50/50 rounded inline-block border-l-2 border-blue-400` 
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
      <div className="mt-6 flex justify-start">
        <a 
          href={sourceUrl}
          target="_blank" 
          rel="noreferrer"
          className="group inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-700 transition-colors border border-gray-200 px-3 py-1.5 rounded-sm hover:border-blue-200"
        >
          Reference Link <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
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
      
      // Clean title removes {#anchor-tags}
      const rawTitle = titleMatch ? titleMatch[1].trim() : (index === 0 ? undefined : `Section ${index}`);
      const title = cleanHeading(rawTitle);
      
      // 2. Remove the H2 line from content to avoid double rendering
      const content = chunk.replace(/^##\s+.*$/m, '').trim();

      // 3. Map a source from the `sources` array if it exists at this index
      const sectionSource = newsItem.sources?.[index];

      return {
        id: `section-${index}`,
        title, 
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

  if (!newsItem) return <div className="text-center py-20 font-serif text-xl text-gray-500">Article not found</div>;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
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
        <article className="mb-24">
          {articleSections.map((section) => (
            <ArticleSection 
              key={section.id}
              {...section}
            />
          ))}

          {/* Fallback: If strict sources array didn't cover everything */}
          {(!newsItem.sources || newsItem.sources.length === 0) && newsItem.sourceUrl && (
             <div className="max-w-3xl mx-auto pt-8 border-t border-slate-200 mt-12">
                 <p className="text-sm text-slate-500 font-sans">
                     Original Source: <a href={newsItem.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline font-bold">{newsItem.sourceName || newsItem.sourceUrl}</a>
                 </p>
             </div>
          )}
        </article>

        {/* 5. Tags */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="max-w-3xl mx-auto text-center border-t border-gray-100 pt-10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 font-sans">Filed Under</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {newsItem.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer font-sans">
                  {tag}
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