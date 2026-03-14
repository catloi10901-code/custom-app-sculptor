import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'prayer' | 'post' | 'thread';
  title: string;
  excerpt: string;
  link: string;
  icon: string;
}

const GlobalSearch = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const q = `%${query}%`;

      const [prayerRes, postRes, threadRes] = await Promise.all([
        supabase.from('prayers').select('id, name, content, topic').eq('is_approved', true).ilike('content', q).limit(5),
        supabase.from('blog_posts').select('id, title, excerpt, slug').eq('status', 'published').ilike('title', q).limit(5),
        supabase.from('community_threads').select('id, title, content, category').ilike('title', q).limit(5),
      ]);

      const items: SearchResult[] = [];

      prayerRes.data?.forEach(p => items.push({
        id: p.id, type: 'prayer', title: p.name,
        excerpt: p.content.slice(0, 80) + '...', link: '/pray', icon: '🙏',
      }));

      postRes.data?.forEach(p => items.push({
        id: p.id, type: 'post', title: p.title,
        excerpt: (p.excerpt || '').slice(0, 80) + '...', link: `/word/${p.slug}`, icon: '📖',
      }));

      threadRes.data?.forEach(t => items.push({
        id: t.id, type: 'thread', title: t.title,
        excerpt: t.content.slice(0, 80) + '...', link: '/pray', icon: '💬',
      }));

      setResults(items);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (link: string) => {
    navigate(link);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-muted-foreground text-[0.78rem] cursor-pointer transition-all hover:bg-white/[0.1] hover:border-border"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('search.label')}</span>
        <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 rounded bg-white/[0.08] text-[0.65rem] font-mono">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[8vh] sm:pt-[15vh]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[560px] mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="flex-1 bg-transparent border-none outline-none text-foreground text-sm placeholder:text-muted-foreground"
              />
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/[0.1] text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-muted-foreground text-sm">{t('search.searching')}</div>
              ) : query && results.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">{t('search.noResults')}</div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={() => handleSelect(r.link)}
                      className="w-full flex items-start gap-3 px-5 py-3 text-left bg-transparent border-none cursor-pointer transition-all hover:bg-white/[0.06]"
                    >
                      <span className="text-lg mt-0.5">{r.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground text-sm font-semibold truncate">{r.title}</div>
                        <div className="text-muted-foreground text-[0.78rem] truncate">{r.excerpt}</div>
                      </div>
                      <span className="text-[0.68rem] text-muted-foreground bg-white/[0.06] px-2 py-0.5 rounded-full mt-1 flex-shrink-0">
                        {r.type === 'prayer' ? 'Prayer' : r.type === 'post' ? 'Blog' : 'Thread'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : !query ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  {t('search.hint')}
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-border text-[0.72rem] text-muted-foreground">
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.08] font-mono">↵</kbd> {t('search.select')}</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white/[0.08] font-mono">esc</kbd> {t('search.close')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
