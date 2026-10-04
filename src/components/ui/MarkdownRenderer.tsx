import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose-chat text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)] mt-4 mb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-serif font-bold text-[#0E080A] dark:text-[var(--theme-ink)] mt-3.5 mb-1.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-[#0E080A] dark:text-[var(--theme-ink)] mt-3 mb-1.5 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-semibold text-[#4A3A32] dark:text-[var(--theme-body)] mt-2.5 mb-1 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc pl-4 sm:pl-5 my-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 sm:pl-5 my-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-0.5">{children}</li>,
          hr: () => <hr className="my-3 border-t border-[#E5DFD6] dark:border-[var(--theme-line)]" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-[#C4487A] dark:border-[var(--theme-rose)] pl-3 py-1 my-2.5 bg-[#FBF4EE]/50 dark:bg-[var(--theme-canvas)]/50 rounded-r text-[#4A3A32] dark:text-[var(--theme-body)] italic">
              {children}
            </blockquote>
          ),
          code({ className: codeClass, children, ...props }) {
            const match = /language-(\w+)/.exec(codeClass || '')
            const isInline = !codeClass && typeof children === 'string' && !children.includes('\n')
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[var(--theme-raised)] text-[#C4487A] dark:text-[var(--theme-rose)] font-mono text-[11px] sm:text-xs"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <div className="my-2.5 overflow-x-auto rounded-xl bg-[#1A1416] p-3 text-[#F5F0EB] font-mono text-xs shadow-inner">
                {match && (
                  <div className="text-[10px] text-stone-400 dark:text-[var(--theme-muted)] uppercase tracking-wider mb-1 font-sans">
                    {match[1]}
                  </div>
                )}
                <code className={codeClass} {...props}>
                  {children}
                </code>
              </div>
            )
          },
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-[#E5DFD6] dark:border-[var(--theme-line)]">
              <table className="min-w-full divide-y divide-[#E5DFD6] dark:divide-[var(--theme-line)] text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#FBF4EE] dark:bg-[var(--theme-canvas)]">{children}</thead>,
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-[#0E080A] dark:text-[var(--theme-ink)]">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-t border-[#E5DFD6]/60 dark:border-[var(--theme-line)] text-[#4A3A32] dark:text-[var(--theme-body)]">{children}</td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C4487A] dark:text-[var(--theme-rose)] font-medium underline hover:text-[#A83A68] dark:hover:text-[var(--theme-rose)] transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
