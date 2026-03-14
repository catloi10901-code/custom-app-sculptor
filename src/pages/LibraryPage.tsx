import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { allLibraryItems } from '@/data/libraryItems';

const LibraryPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('all');

  const tagConfig: Record<string, { label: string; cls: string }> = {
    peace: { label: t('library.cat.peace'), cls: 'bg-blue-400/15 text-blue-300' },
    health: { label: t('library.cat.health'), cls: 'bg-green-400/15 text-green-300' },
    prosperity: { label: t('library.cat.prosperity'), cls: 'bg-primary/20 text-primary' },
    family: { label: t('library.cat.family'), cls: 'bg-red-400/15 text-red-300' },
    work: { label: t('library.cat.work'), cls: 'bg-purple-400/15 text-purple-300' },
    gratitude: { label: t('library.cat.gratitude'), cls: 'bg-yellow-400/15 text-yellow-300' },
    nation: { label: t('library.cat.nation'), cls: 'bg-blue-400/20 text-blue-300' },
  };

  const categories = [
    { id: 'all', label: t('library.all') },
    { id: 'peace', label: t('library.cat.peace') },
    { id: 'health', label: t('library.cat.health') },
    { id: 'prosperity', label: t('library.cat.prosperity') },
    { id: 'family', label: t('library.cat.family') },
    { id: 'work', label: t('library.cat.work') },
    { id: 'gratitude', label: t('library.cat.gratitude') },
    { id: 'nation', label: t('library.cat.nation') },
  ];

  const filtered = activeCategory === 'all' ? allLibraryItems : allLibraryItems.filter(i => i.tag === activeCategory);

  return (
    <div>
      <section className="py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container">
          <h1 className="font-serif text-primary mb-4">{t('library.title')}</h1>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">{t('library.sub')}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          {isMobile ? (
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm font-semibold mb-8 focus:outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2 flex-wrap mb-8">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 rounded-full border text-[0.83rem] cursor-pointer transition-all duration-300 inline-flex items-center gap-1.5 ${
                    activeCategory === c.id
                      ? 'bg-secondary border-secondary text-secondary-foreground'
                      : 'border-white/10 bg-transparent text-muted-foreground hover:bg-secondary hover:text-white hover:border-secondary'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          <div className="text-[0.78rem] text-muted-foreground mb-4">
            {t('library.count', { count: filtered.length })}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const tag = tagConfig[item.tag] || { label: item.tag, cls: 'bg-muted text-muted-foreground' };
              return (
                <div
                  key={item.id}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-[18px] transition-all duration-300 cursor-pointer hover:bg-white/[0.07] hover:border-border hover:-translate-y-0.5"
                >
                  <div className="text-3xl mb-2.5">{item.icon}</div>
                  <h3 className="font-semibold text-foreground text-[0.92rem] mb-1.5">{item.title}</h3>
                  <p className="text-[0.8rem] text-muted-foreground leading-relaxed mb-3">{item.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.72rem] px-2 py-0.5 rounded-lg font-semibold ${tag.cls}`}>{tag.label}</span>
                    <span className="text-[0.75rem] text-muted-foreground">{t('library.read')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LibraryPage;
