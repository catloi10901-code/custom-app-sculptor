import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  status: string;
  cover_image: string | null;
  tags: string[] | null;
  like_count: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
  category_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const WordPage = () => {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, postRes] = await Promise.all([
        supabase.from('blog_categories').select('*').order('sort_order'),
        supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(50),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (postRes.data) setPosts(postRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = activeCategory === 'all' ? posts : posts.filter(p => p.category_id === activeCategory);
  const featured = posts[0];
  const gridPosts = filtered.slice(activeCategory === 'all' ? 1 : 0);
  const formatDate = (d: string | null) => { if (!d) return ''; return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }); };
  const readTime = (excerpt: string | null) => { const words = (excerpt || '').split(' ').length; return t('word.readTime', { count: Math.max(3, Math.ceil(words / 40)) }); };
  const hasPosts = posts.length > 0;

  return (
    <div>
      <section className="py-20 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 60%)' }}>
        <div className="container">
          <h1 className="font-serif text-primary mb-4">{t('word.title')}</h1>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">{t('word.sub')}</p>
        </div>
      </section>
      <div className="sticky top-[60px] z-[50] bg-background/95 backdrop-blur-lg border-b border-border py-3">
        <div className="container">
          {isMobile ? (
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-xl text-foreground text-sm font-semibold focus:outline-none focus:border-primary"
            >
              <option value="all">{t('word.all')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
              ))}
            </select>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button onClick={() => setActiveCategory('all')} className={`px-4 py-1.5 rounded-full border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeCategory === 'all' ? 'bg-gold-dim border-primary text-primary' : 'border-border bg-transparent text-muted-foreground hover:bg-gold-dim hover:text-primary hover:border-primary'}`}>{t('word.all')}</button>
              {categories.map((c) => (<button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-4 py-1.5 rounded-full border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeCategory === c.id ? 'bg-gold-dim border-primary text-primary' : 'border-border bg-transparent text-muted-foreground hover:bg-gold-dim hover:text-primary hover:border-primary'}`}>{c.icon ? `${c.icon} ` : ''}{c.name}</button>))}
            </div>
          )}
        </div>
      </div>
      <section className="py-12">
        <div className="container">
          {loading ? (<div className="text-center py-16 text-muted-foreground">{t('word.loading')}</div>) : !hasPosts ? (<div className="text-center py-16 text-muted-foreground"><p className="text-2xl mb-2">📖</p><p>{t('word.empty')}</p></div>) : (<>
            {featured && activeCategory === 'all' && (<Link to={`/word/${featured.slug}`} className="block bg-card border border-primary/30 rounded-2xl p-8 mb-10 transition-all duration-300 hover:border-primary/60 cursor-pointer no-underline"><span className="inline-block px-2.5 py-0.5 bg-gold-dim text-primary rounded-full text-[0.75rem] font-bold mb-3">{t('word.featured')}</span><h2 className="font-serif text-foreground text-2xl mb-3 leading-snug">{featured.title}</h2><p className="text-muted-foreground text-base leading-relaxed mb-4">{featured.excerpt}</p><div className="flex gap-4 flex-wrap text-[0.82rem] text-muted-foreground"><span>{formatDate(featured.published_at || featured.created_at)}</span><span>⏱ {readTime(featured.excerpt)}</span><span>❤️ {featured.like_count}</span><span>👁 {featured.view_count}</span></div></Link>)}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => { const cat = categories.find(c => c.id === post.category_id); return (<Link key={post.id} to={`/word/${post.slug}`} className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] cursor-pointer no-underline block"><div className="h-[140px] bg-gradient-to-br from-secondary to-card flex items-center justify-center text-4xl">{post.cover_image ? <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" /> : '📖'}</div><div className="p-5">{cat && <span className="inline-block px-2 py-0.5 bg-gold-dim text-primary rounded-full text-[0.72rem] font-bold mb-2">{cat.icon ? `${cat.icon} ` : ''}{cat.name}</span>}<h3 className="text-foreground text-[0.95rem] font-semibold mb-2 leading-snug">{post.title}</h3><p className="text-muted-foreground text-[0.85rem] leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p><div className="flex gap-3 text-[0.75rem] text-muted-foreground"><span>{formatDate(post.published_at || post.created_at)}</span><span>⏱ {readTime(post.excerpt)}</span><span>❤️ {post.like_count}</span></div></div></Link>); })}
            </div>
          </>)}
        </div>
      </section>
      <section className="py-12" style={{ background: 'rgba(197,160,89,0.03)' }}>
        <div className="container max-w-[700px] text-center">
          <h2 className="font-serif text-primary mb-6">{t('word.verse.title')}</h2>
          <blockquote className="italic text-lg text-muted-foreground leading-[1.8] mb-4 px-6 border-l-[3px] border-primary text-left rounded-r-lg bg-black/20 py-5">{t('word.verse.text')}</blockquote>
          <p className="text-primary font-semibold">{t('word.verse.ref')}</p>
        </div>
      </section>
    </div>
  );
};

export default WordPage;
