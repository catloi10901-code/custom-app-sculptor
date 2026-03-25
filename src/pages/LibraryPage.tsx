import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import PageHero from '@/components/layout/PageHero';
import { BookOpen, X } from 'lucide-react';

interface LibraryItem {
  id: string;
  icon: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const LibraryPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const closeModal = useCallback(() => setSelectedItem(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  useEffect(() => {
    const fetchData = async () => {
      const [itemsRes, catsRes] = await Promise.all([
        supabase
          .from('library_items')
          .select('id, icon, title, excerpt, content, category_id')
          .eq('is_published', true)
          .order('category_id')
          .order('sort_order'),
        supabase
          .from('blog_categories')
          .select('id, name, slug, icon')
          .eq('type', 'library')
          .order('sort_order'),
      ]);
      if (itemsRes.data) setItems(itemsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const catColorMap: Record<number, { cls: string }> = {
    0: { cls: 'bg-blue-400/15 text-blue-300' },
    1: { cls: 'bg-green-400/15 text-green-300' },
    2: { cls: 'bg-primary/20 text-primary' },
    3: { cls: 'bg-red-400/15 text-red-300' },
    4: { cls: 'bg-purple-400/15 text-purple-300' },
    5: { cls: 'bg-yellow-400/15 text-yellow-300' },
    6: { cls: 'bg-blue-400/20 text-blue-300' },
  };

  const getCatColor = (catId: string | null) => {
    if (!catId) return 'bg-muted text-muted-foreground';
    const idx = categories.findIndex(c => c.id === catId);
    return (catColorMap[idx] || catColorMap[0]).cls;
  };

  const getCatName = (catId: string | null) => {
    if (!catId) return '';
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '';
  };

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(i => i.category_id === activeCategory);

  const allCategories = [
    { id: 'all', name: t('library.all'), icon: null },
    ...categories,
  ];

  return (
    <div>
      <PageHero
        badge={{ icon: <BookOpen className="w-3.5 h-3.5" />, text: t('library.badge') || 'THƯ VIỆN CẦU NGUYỆN' }}
        title={<>{t('library.title')}</>}
        subtitle={t('library.sub')}
        pills={[
          { icon: '📖', text: `${items.length} ${t('library.pillItems') || 'Bài cầu nguyện'}` },
          { icon: '🗂️', text: `${categories.length} ${t('library.pillCategories') || 'Chủ đề'}` },
          { icon: '🌐', text: t('library.pillMultilang') || 'Đa ngôn ngữ' },
        ]}
        bgKey="hero_bg_library"
      />
      <section className="py-12">
        <div className="container">
          {isMobile ? (
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm font-semibold mb-8 focus:outline-none focus:border-primary"
            >
              {allCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}{c.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2 flex-wrap mb-8">
              {allCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 rounded-full border text-[0.83rem] cursor-pointer transition-all duration-300 inline-flex items-center gap-1.5 ${
                    activeCategory === c.id
                      ? 'bg-secondary border-secondary text-secondary-foreground'
                      : 'border-white/10 bg-transparent text-muted-foreground hover:bg-secondary hover:text-white hover:border-secondary'
                  }`}
                >
                  {c.icon && <span>{c.icon}</span>}
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center text-muted-foreground py-12">{t('common.loading')}</div>
          ) : (
            <>
              <div className="text-[0.78rem] text-muted-foreground mb-4">
                {t('library.count', { count: filtered.length })}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-[18px] transition-all duration-300 cursor-pointer hover:bg-white/[0.07] hover:border-border hover:-translate-y-0.5 flex flex-col"
                  >
                    <div className="text-3xl mb-2.5">{item.icon}</div>
                    <h3 className="font-semibold text-foreground text-[0.92rem] mb-1.5">{item.title}</h3>
                    <p className="text-[0.8rem] text-muted-foreground leading-relaxed mb-3 flex-1">{item.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[0.72rem] px-2 py-0.5 rounded-lg font-semibold ${getCatColor(item.category_id)}`}>
                        {getCatName(item.category_id)}
                      </span>
                      <span className="text-[0.75rem] text-primary font-semibold hover:underline">{t('library.read')} 📖</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative z-10 bg-card border border-border rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-border/60 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-4xl leading-none">{selectedItem.icon}</span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-foreground leading-snug">
                    {selectedItem.title}
                  </h2>
                  {selectedItem.category_id && (
                    <span className={`text-[0.72rem] px-2 py-0.5 rounded-lg font-semibold mt-1 inline-block ${getCatColor(selectedItem.category_id)}`}>
                      {getCatName(selectedItem.category_id)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border-none cursor-pointer text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto p-5 space-y-4">
              {selectedItem.excerpt && (
                <p className="text-[0.88rem] text-muted-foreground italic border-l-2 border-primary/40 pl-3">
                  {selectedItem.excerpt}
                </p>
              )}
              {selectedItem.content ? (
                <p className="text-[0.92rem] text-foreground leading-relaxed whitespace-pre-line">
                  {selectedItem.content}
                </p>
              ) : (
                <p className="text-muted-foreground text-sm italic text-center py-6">
                  {t('library.noContent')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
