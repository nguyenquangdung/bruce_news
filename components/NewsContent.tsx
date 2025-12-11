import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lightbulb, Terminal, ExternalLink, Quote } from 'lucide-react';

interface NewsContentProps {
  content: string;
}

export const NewsContent: React.FC<NewsContentProps> = ({ content }) => {
  return (
    <div className="news-content prose prose-lg prose-slate max-w-none 
      prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 
      prose-p:text-gray-700 prose-p:leading-8
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-lg prose-img:shadow-md
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Styled H2
          h2: ({ node, children, ...props }) => {
            // Generate ID from text content for TOC
            const id = children?.toString().toLowerCase().replace(/[^\w]+/g, '-') || '';
            return (
              <h2 id={id} className="scroll-mt-24 text-3xl font-bold mt-12 mb-6 border-l-4 border-primary pl-4 relative group" {...props}>
                {children}
              </h2>
            );
          },
          // Styled H3
          h3: ({ node, children, ...props }) => (
             <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 flex items-center gap-2" {...props}>
               <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
               {children}
             </h3>
          ),
          // Styled Blockquote
          blockquote: ({ node, children, ...props }) => (
            <div className="my-8 relative pl-0">
               <div className="bg-amber-50 border-l-4 border-accent p-6 rounded-r-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Quote className="w-16 h-16 text-accent" />
                  </div>
                  <div className="flex gap-3 relative z-10">
                     <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                     <div className="italic text-gray-700 font-serif text-lg">
                       {children}
                     </div>
                  </div>
               </div>
            </div>
          ),
          // Styled Table
          table: ({ node, children, ...props }) => (
            <div className="my-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500" {...props}>
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="text-xs text-gray-700 uppercase bg-gray-100" {...props}>
              {children}
            </thead>
          ),
          th: ({ node, children, ...props }) => (
            <th scope="col" className="px-6 py-4 font-bold tracking-wider" {...props}>
              {children}
            </th>
          ),
          tr: ({ node, children, ...props }) => (
            <tr className="bg-white border-b hover:bg-gray-50 transition-colors" {...props}>
              {children}
            </tr>
          ),
          td: ({ node, children, ...props }) => (
            <td className="px-6 py-4" {...props}>
              {children}
            </td>
          ),
          // Styled Link
          a: ({ node, href, children, ...props }) => {
            const isExternal = href?.startsWith('http');
            return (
                <a 
                    href={href} 
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-dark transition-colors border-b border-primary/20 hover:border-primary"
                    {...props}
                >
                    {children}
                    {isExternal && <ExternalLink className="w-3 h-3 opacity-70" />}
                </a>
            )
          },
          // Styled Code
          code: ({ node, className, children, ...props }) => {
             const isBlock = /language-(\w+)/.exec(className || '');
             if (isBlock) {
                 return (
                     <div className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto relative group">
                        <div className="absolute top-2 right-2 text-xs text-gray-500 font-mono">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <code className="font-mono text-sm text-gray-100" {...props}>
                            {children}
                        </code>
                     </div>
                 )
             }
             return (
                 <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded font-mono text-sm border border-gray-200" {...props}>
                     {children}
                 </code>
             )
          },
          // Styled HR
          hr: () => (
            <div className="py-8 flex justify-center items-center">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-3/4"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 mx-2"></div>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent w-3/4"></div>
            </div>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};