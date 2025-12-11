import React, { useEffect, useState } from 'react';
import { List, AlignRight, X } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  markdown: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ markdown }) => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    // Extract H2 headings from markdown
    const lines = markdown.split('\n');
    const extracted: TocItem[] = [];
    
    lines.forEach(line => {
      const match = line.match(/^##\s+(.*)$/);
      if (match) {
        const text = match[1].trim();
        // Simple slugify matching the renderer
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        extracted.push({ id, text });
      }
    });
    setHeadings(extracted);
  }, [markdown]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveId(id);
        setIsOpenMobile(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold uppercase tracking-wider text-xs border-b border-gray-200 pb-2">
            <List className="w-4 h-4" />
            Table of Contents
          </div>
          <nav className="flex flex-col gap-1">
            {headings.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm py-1.5 px-3 rounded-md transition-all duration-200 border-l-2 ${
                  activeId === item.id
                    ? 'bg-white text-primary font-bold border-primary shadow-sm pl-4'
                    : 'text-gray-500 hover:text-gray-900 border-transparent hover:bg-gray-100'
                }`}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 transition-colors border-2 border-white"
        >
            {isOpenMobile ? <X className="w-6 h-6" /> : <AlignRight className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpenMobile && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpenMobile(false)}>
              <div 
                className="absolute bottom-24 right-6 w-64 bg-white rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200"
                onClick={e => e.stopPropagation()}
              >
                  <div className="p-4 bg-gray-50 font-bold text-gray-700 text-sm border-b">
                      Contents
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto p-2">
                     {headings.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`w-full text-left text-sm py-2 px-3 rounded mb-1 ${
                                activeId === item.id
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {item.text}
                        </button>
                     ))}
                  </div>
              </div>
          </div>
      )}
    </>
  );
};