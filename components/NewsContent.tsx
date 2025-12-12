import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Lightbulb, Terminal, ExternalLink, Quote, Link2 } from 'lucide-react';

interface NewsContentProps {
  content: string;
}

// Utility to extract raw text from React Children
const extractText = (children: any): string => {
    if (!children) return '';
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(extractText).join('');
    if (children.props && children.props.children) return extractText(children.props.children);
    return '';
};

// Utility to parse text and extract custom ID: "Heading {#my-id}" -> { text: "Heading", id: "my-id" }
const parseHeading = (rawText: string) => {
    let text = rawText;
    let id = '';
    const idMatch = rawText.match(/{#([^}]+)}/);
    if (idMatch) {
        id = idMatch[1];
        text = text.replace(/{#([^}]+)}/, '').trim();
    } else {
        // Fallback slugify
        id = text.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-\u00C0-\u1EF9]/g, '');
    }
    return { id, text };
};

export const NewsContent: React.FC<NewsContentProps> = ({ content }) => {
  return (
    <div className="news-content font-serif text-gray-800">
      <div className="prose prose-lg prose-slate max-w-none 
        prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 
        prose-p:text-gray-800 prose-p:leading-8 prose-p:font-serif prose-p:text-[1.125rem]
        prose-li:text-gray-800 prose-li:font-serif
        prose-strong:text-gray-900 prose-strong:font-bold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
      ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Styled H2
          h2: ({ node, children, ...props }) => {
            const rawText = extractText(children);
            const { id, text } = parseHeading(rawText);
            
            return (
              <h2 id={id} className="scroll-mt-24 text-2xl md:text-3xl font-bold mt-12 mb-6 text-black border-b border-gray-200 pb-2" {...props}>
                {text}
              </h2>
            );
          },
          // Styled H3
          h3: ({ node, children, ...props }) => {
             const rawText = extractText(children);
             const { id, text } = parseHeading(rawText);

             return (
                <h3 id={id} className="scroll-mt-24 text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-800" {...props}>
                  {text}
                </h3>
             );
          },
          // Styled Blockquote
          blockquote: ({ node, children, ...props }) => (
            <div className="my-8 pl-6 border-l-4 border-accent italic text-xl text-gray-700 bg-gray-50 py-4 pr-4 rounded-r-lg">
               {children}
            </div>
          ),
          // Styled Table
          table: ({ node, children, ...props }) => (
            <div className="my-8 overflow-hidden rounded-lg border border-gray-200 shadow-sm font-sans">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600" {...props}>
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="text-xs text-gray-900 uppercase bg-gray-100 font-bold" {...props}>
              {children}
            </thead>
          ),
          th: ({ node, children, ...props }) => (
            <th scope="col" className="px-6 py-4" {...props}>
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
            // Check if the text is exactly "Source" or "Nguồn" for special styling
            const childText = extractText(children).toLowerCase();
            const isSourceLink = childText.includes('nguồn') || childText.includes('source');
            
            if (isSourceLink) {
                return (
                    <a 
                        href={href} 
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-dark transition-colors font-sans text-base no-underline group"
                        {...props}
                    >
                        {children}
                        <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                    </a>
                )
            }

            return (
                <a 
                    href={href} 
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="text-primary hover:text-primary-dark underline decoration-primary/30 hover:decoration-primary decoration-2 underline-offset-2 transition-all"
                    {...props}
                >
                    {children}
                </a>
            )
          },
          // Styled Code
          code: ({ node, className, children, ...props }) => {
             const isBlock = /language-(\w+)/.exec(className || '');
             if (isBlock) {
                 return (
                     <div className="bg-[#1e1e1e] rounded-lg p-4 my-6 overflow-x-auto relative group font-sans text-sm shadow-inner">
                        <div className="absolute top-3 right-3 text-xs text-gray-500 font-mono">
                            <Terminal className="w-4 h-4" />
                        </div>
                        <code className="font-mono text-gray-200" {...props}>
                            {children}
                        </code>
                     </div>
                 )
             }
             return (
                 <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-sm border border-gray-200 font-bold" {...props}>
                     {children}
                 </code>
             )
          },
          // Styled List
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc list-outside ml-6 space-y-2 marker:text-gray-400" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal list-outside ml-6 space-y-2 marker:font-bold marker:text-gray-900" {...props}>
              {children}
            </ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      </div>
    </div>
  );
};