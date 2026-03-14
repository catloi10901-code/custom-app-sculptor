import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Globe, Calendar, ArrowUpRight, TrendingUp, Heart, Users, MapPin, Droplets } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

type ImpactArticle = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  source_topic: string;
  source_url: string | null;
  language: string;
  created_at: string;
};

const topicKeys: Record<string, { emoji: string; labelKey: string; gradient: string; accent: string; icon: string }> = {
  humanitarian: { emoji: '🤝', labelKey: 'give.alloc.humanitarian', gradient: 'from-amber-500/30 via-orange-600/20 to-red-900/30', accent: '#e8c87a', icon: '❤️' },
  prayer_movement: { emoji: '🙏', labelKey: 'impact.stat1', gradient: 'from-violet-500/30 via-purple-600/20 to-indigo-900/30', accent: '#a78bfa', icon: '✨' },
  clean_water: { emoji: '💧', labelKey: 'impact.stories.4.tag', gradient: 'from-cyan-400/30 via-teal-500/20 to-blue-900/30', accent: '#67e8f9', icon: '🌊' },
  education: { emoji: '🏫', labelKey: 'give.alloc.education', gradient: 'from-blue-400/30 via-indigo-500/20 to-slate-900/30', accent: '#60a5fa', icon: '📚' },
  health: { emoji: '🏥', labelKey: 'impact.stories.2.tag', gradient: 'from-emerald-400/30 via-green-500/20 to-teal-900/30', accent: '#6ee7b7', icon: '💚' },
  peace: { emoji: '🕊️', labelKey: 'give.alloc.peace', gradient: 'from-sky-400/30 via-indigo-400/20 to-violet-900/30', accent: '#93c5fd', icon: '🕊️' },
};

const ImpactPage = () => {
  const { t, i18n } = useTranslation();
  const { isAdmin } = useAuth();
  const [articles, setArticles] = useState<ImpactArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [liveStats, setLiveStats] = useState({ prayers_count: 0, members_count: 0, donated_total: 0 });
  const [countriesCount, setCountriesCount] = useState(0);

  // Fetch live stats + realtime
  useEffect(() => {
    const fetchLive = async () => {
      const { data } = await supabase
        .from('live_stats')
        .select('prayers_count, members_count, donated_total')
        .eq('id', 1)
        .single();
      if (data) setLiveStats({ prayers_count: Number(data.prayers_count), members_count: Number(data.members_count), donated_total: Number(data.donated_total) });
    };
    const fetchCountries = async () => {
      const { data } = await supabase.from('prayers').select('country').not('country', 'is', null);
      if (data) {
        const unique = new Set(data.map(d => d.country).filter(Boolean));
        setCountriesCount(unique.size);
      }
    };
    fetchLive();
    fetchCountries();

    const channel = supabase
      .channel('impact-live-stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_stats' }, (payload) => {
        const d = payload.new as any;
        setLiveStats({ prayers_count: Number(d.prayers_count), members_count: Number(d.members_count), donated_total: Number(d.donated_total) });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('impact_articles')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setArticles(data as ImpactArticle[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleFetchNewArticles = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-impact-articles', {
        body: { count: 3, language: i18n.language === 'vi' ? 'vi' : 'en' },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(t('impact.ai.success').replace('{count}', String(data.count)));
        fetchArticles();
      } else {
        toast.error(data?.error || t('impact.ai.error'));
      }
    } catch (e) {
      console.error(e);
      toast.error(t('impact.ai.error'));
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const { error } = await supabase.from('impact_articles').delete().eq('id', id);
    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id));
      toast.success(t('impact.ai.deleted'));
    }
  };

  const stats = [
    { value: liveStats.prayers_count, prefix: '', suffix: '+', label: t('impact.stat1'), change: t('impact.change1'), icon: Heart, color: '#e8c87a' },
    { value: liveStats.donated_total, prefix: '$', suffix: '', label: t('impact.stat2'), change: t('impact.change2'), icon: TrendingUp, color: '#6ee7b7' },
    { value: countriesCount, prefix: '', suffix: '', label: t('impact.stat3'), change: t('impact.change3'), icon: MapPin, color: '#60a5fa' },
    { value: liveStats.members_count, prefix: '', suffix: '', label: t('impact.stat4'), change: t('impact.change4'), icon: Users, color: '#a78bfa' },
  ];

  const stories = [
    { emoji: '🏫', tag: t('impact.stories.1.tag'), title: t('impact.stories.1.title'), desc: t('impact.stories.1.desc'), gradient: 'from-blue-500/40 via-indigo-600/30 to-blue-900/50', metric: '2,400', metricLabel: t('impact.stories.metric.students'), accentColor: '#60a5fa' },
    { emoji: '🏥', tag: t('impact.stories.2.tag'), title: t('impact.stories.2.title'), desc: t('impact.stories.2.desc'), gradient: 'from-emerald-500/40 via-teal-600/30 to-green-900/50', metric: '5,000', metricLabel: t('impact.stories.metric.patients'), accentColor: '#6ee7b7' },
    { emoji: '🍚', tag: t('impact.stories.3.tag'), title: t('impact.stories.3.title'), desc: t('impact.stories.3.desc'), gradient: 'from-amber-500/40 via-orange-600/30 to-yellow-900/50', metric: '50,000', metricLabel: t('impact.stories.metric.meals'), accentColor: '#fbbf24' },
    { emoji: '💧', tag: t('impact.stories.4.tag'), title: t('impact.stories.4.title'), desc: t('impact.stories.4.desc'), gradient: 'from-cyan-400/40 via-sky-500/30 to-teal-900/50', metric: '8,000', metricLabel: t('impact.stories.metric.people'), accentColor: '#22d3ee' },
  ];

  const allocations = [
    { label: t('give.alloc.humanitarian'), pct: 45, color: '#e8c87a', icon: '🤝' },
    { label: t('give.alloc.education'), pct: 25, color: '#6ee7b7', icon: '📚' },
    { label: t('give.alloc.peace'), pct: 20, color: '#60a5fa', icon: '🕊️' },
    { label: t('give.alloc.operations'), pct: 10, color: '#a78bfa', icon: '⚙️' },
  ];

  const milestones = [
    { year: '2021', event: t('impact.timeline.2021'), icon: '🌱' },
    { year: '2022', event: t('impact.timeline.2022'), icon: '🙏' },
    { year: '2023', event: t('impact.timeline.2023'), icon: '🌍' },
    { year: '2024', event: t('impact.timeline.2024'), icon: '💰' },
    { year: '2025', event: t('impact.timeline.2025'), icon: '✨' },
    { year: '2026', event: t('impact.timeline.2026'), icon: '🎓' },
  ];

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Layered background */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 100% 80% at 50% -10%, rgba(197,160,89,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(96,165,250,0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 20% 70%, rgba(110,231,183,0.06) 0%, transparent 50%),
            linear-gradient(180deg, hsl(221 68% 30%) 0%, hsl(221 68% 33%) 100%)
          `
        }} />
        {/* Decorative circles */}
        <div className="absolute top-[10%] right-[8%] w-[300px] h-[300px] rounded-full border border-primary/10 opacity-30" style={{ animation: 'auraPulse 8s ease-in-out infinite alternate' }} />
        <div className="absolute bottom-[5%] left-[5%] w-[200px] h-[200px] rounded-full border border-primary/8 opacity-20" style={{ animation: 'auraPulse 12s ease-in-out infinite alternate-reverse' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(197,160,89,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-widest uppercase mb-6" style={{ animation: 'fadeDown 0.8s ease both' }}>
            <Globe className="w-3.5 h-3.5" />
            {t('impact.page.badge')}
          </div>
          <h1 className="font-serif text-primary mb-5" style={{ animation: 'fadeUp 0.9s ease 0.2s both', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
            {t('impact.page.title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-[640px] mx-auto leading-relaxed" style={{ animation: 'fadeUp 0.9s ease 0.4s both' }}>
            {t('impact.page.sub')}
          </p>

          {/* Floating stat pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10" style={{ animation: 'fadeUp 0.9s ease 0.6s both' }}>
            {[
              { icon: '🙏', text: `${liveStats.prayers_count.toLocaleString()}+ ${t('impact.pill.prayers')}` },
              { icon: '🌍', text: `${countriesCount} ${t('impact.pill.nations')}` },
              { icon: '👥', text: `${liveStats.members_count.toLocaleString()} ${t('impact.pill.members')}` },
              { icon: '💰', text: `$${liveStats.donated_total.toLocaleString()} ${t('impact.pill.raised')}` },
            ].map((pill, i) => (
              <div key={i} className="flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/60 rounded-full px-4 py-2 text-[0.82rem] text-muted-foreground">
                <span>{pill.icon}</span>
                <span className="font-medium">{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="group relative bg-card border border-border rounded-2xl p-7 text-center overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                    background: `radial-gradient(circle at 50% 0%, ${s.color}15 0%, transparent 70%)`
                  }} />
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-110" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <span className="font-serif text-[2.2rem] font-bold text-primary block relative z-10">
                    {s.prefix}<AnimatedCounter value={s.value} duration={1500} className="" />{s.suffix}
                  </span>
                  <div className="text-[0.8rem] text-muted-foreground uppercase tracking-wider mt-1.5 font-medium">{s.label}</div>
                  <div className="inline-flex items-center gap-1 text-[0.75rem] mt-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    {s.change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section className="py-16">
        <div className="container max-w-[900px]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-primary mb-2">{t('impact.timeline.title')}</h2>
            <p className="text-muted-foreground">{t('impact.timeline.sub')}</p>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[28px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:-translate-x-px" />
            {milestones.map((m, i) => (
              <div key={i} className={`relative flex items-start gap-5 mb-8 last:mb-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`} style={{ animation: `fadeUp 0.6s ease ${0.1 * i}s both` }}>
                <div className={`flex-1 hidden sm:block ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-card border border-border rounded-xl p-4 inline-block transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <div className="text-primary font-serif text-lg font-bold">{m.year}</div>
                    <div className="text-muted-foreground text-[0.85rem] mt-0.5">{m.event}</div>
                  </div>
                </div>
                {/* Node */}
                <div className="relative z-10 w-[56px] h-[56px] flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(197,160,89,0.15)]">
                  {m.icon}
                </div>
                {/* Mobile card */}
                <div className="sm:hidden flex-1 pl-2">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="text-primary font-serif text-lg font-bold">{m.year}</div>
                    <div className="text-muted-foreground text-[0.85rem] mt-0.5">{m.event}</div>
                  </div>
                </div>
                <div className="flex-1 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ AI ARTICLES ═══════ */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-sm">📰</div>
                <h2 className="font-serif text-primary">{t('impact.ai.title')}</h2>
              </div>
              <p className="text-muted-foreground text-[0.9rem]">{t('impact.ai.sub')}</p>
            </div>
            {isAdmin && (
              <Button
                onClick={handleFetchNewArticles}
                disabled={fetching}
                className="bg-primary text-primary-foreground hover:bg-gold-light gap-2 shadow-[0_4px_15px_rgba(197,160,89,0.25)]"
              >
                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {fetching ? t('impact.ai.fetching') : t('impact.ai.fetch')}
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-muted-foreground text-sm">{t('impact.ai.loading')}</span>
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{t('impact.ai.empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => {
                const topicEntry = topicKeys[article.source_topic] || topicKeys.humanitarian;
                const config = { ...topicEntry, label: t(topicEntry.labelKey) };
                const isExpanded = expandedArticle === article.id;
                return (
                  <div
                    key={article.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_16px_50px_rgba(0,0,0,0.35)] flex flex-col"
                    style={{ animation: `fadeUp 0.5s ease ${0.05 * idx}s both` }}
                  >
                    {/* Card header with rich pattern */}
                    <div className={`relative h-[140px] bg-gradient-to-br ${config.gradient} flex items-center justify-center overflow-hidden`}>
                      {/* Subtle pattern */}
                      <div className="absolute inset-0 opacity-[0.06]" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                        backgroundSize: '40px 40px, 60px 60px, 50px 50px'
                      }} />
                      {/* Floating accent orb */}
                      <div className="absolute w-[100px] h-[100px] rounded-full opacity-20 blur-[30px] transition-transform duration-700 group-hover:scale-150" style={{ background: config.accent }} />
                      {/* Emoji */}
                      <span className="text-5xl relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                        {config.emoji}
                      </span>
                      {/* Topic badge on card */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider backdrop-blur-md border" style={{
                        background: `${config.accent}18`,
                        borderColor: `${config.accent}35`,
                        color: config.accent,
                      }}>
                        {config.label}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[0.72rem] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(article.created_at).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-foreground text-[1rem] font-semibold mb-2.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h3>
                      <p className={`text-muted-foreground text-[0.84rem] leading-relaxed flex-1 ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {article.excerpt || article.content.substring(0, 200)}
                      </p>
                      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedArticle(isExpanded ? null : article.id)}
                          className="text-primary text-[0.8rem] font-medium hover:underline flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? t('impact.ai.collapse') : t('impact.ai.readMore')}
                          <ArrowUpRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {article.source_url && (
                          <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary text-[0.75rem] transition-colors">
                            {t('impact.ai.source')} ↗
                          </a>
                        )}
                        {isAdmin && (
                          <button onClick={() => handleDeleteArticle(article.id)} className="text-destructive text-[0.72rem] hover:underline">
                            {t('impact.ai.delete')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ STORIES ═══════ */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-[0.75rem] font-bold text-primary uppercase tracking-wider mb-4">
              ✦ {t('impact.stories.badge')}
            </div>
            <h2 className="font-serif text-primary mb-3">{t('impact.stories.title')}</h2>
            <p className="text-muted-foreground max-w-[500px] mx-auto">{t('impact.stories.sub')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {stories.map((s, i) => (
              <div key={i} className="group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]" style={{ animation: `fadeUp 0.6s ease ${0.1 * i}s both` }}>
                {/* Rich banner */}
                <div className={`relative h-[200px] bg-gradient-to-br ${s.gradient} flex items-center justify-center overflow-hidden`}>
                  {/* Layered pattern */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: `
                      linear-gradient(45deg, white 25%, transparent 25%),
                      linear-gradient(-45deg, white 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, white 75%),
                      linear-gradient(-45deg, transparent 75%, white 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0'
                  }} />
                  {/* Floating orbs */}
                  <div className="absolute w-[120px] h-[120px] rounded-full top-[-20%] right-[-5%] opacity-15 blur-[25px]" style={{ background: s.accentColor }} />
                  <div className="absolute w-[80px] h-[80px] rounded-full bottom-[-10%] left-[10%] opacity-10 blur-[20px]" style={{ background: s.accentColor }} />
                  {/* Central emoji */}
                  <span className="text-6xl relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3">
                    {s.emoji}
                  </span>
                  {/* Metric badge */}
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2 text-right">
                    <div className="font-serif text-xl font-bold" style={{ color: s.accentColor }}>{s.metric}</div>
                    <div className="text-[0.68rem] text-white/60 uppercase tracking-wider">{s.metricLabel}</div>
                  </div>
                </div>

                <div className="p-7">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-bold uppercase tracking-wider mb-3" style={{
                    background: `${s.accentColor}15`,
                    color: s.accentColor,
                    border: `1px solid ${s.accentColor}30`
                  }}>
                    {s.tag}
                  </span>
                  <h3 className="text-foreground text-lg mb-3 leading-snug font-bold group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                  <p className="text-muted-foreground text-[0.88rem] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FUND ALLOCATION ═══════ */}
      <section className="py-16">
        <div className="container max-w-[800px]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-primary mb-3">{t('impact.fund.title')}</h2>
            <p className="text-muted-foreground">{t('impact.fund.sub')}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            {/* Visual donut summary */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              {/* Simple donut representation */}
              <div className="relative w-[160px] h-[160px] flex-shrink-0">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {allocations.reduce((acc, a, i) => {
                    const circumference = 2 * Math.PI * 60;
                    const offset = acc.offset;
                    const dash = (a.pct / 100) * circumference;
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="80" cy="80" r="60"
                        fill="none"
                        stroke={a.color}
                        strokeWidth="20"
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-1000"
                        style={{ filter: `drop-shadow(0 0 4px ${a.color}40)` }}
                      />
                    );
                    acc.offset += dash;
                    return acc;
                  }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-serif text-xl font-bold text-primary">100%</div>
                    <div className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">{t('impact.fund.transparency')}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                {allocations.map((a, i) => (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between text-[0.88rem] mb-1.5">
                      <span className="flex items-center gap-2 text-foreground font-medium">
                        <span className="text-base">{a.icon}</span>
                        {a.label}
                      </span>
                      <span className="font-serif font-bold text-lg" style={{ color: a.color }}>{a.pct}%</span>
                    </div>
                    <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                        style={{ width: `${a.pct}%`, background: `linear-gradient(90deg, ${a.color}, ${a.color}cc)` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" style={{ animation: 'shimmer 3s infinite' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-[0.8rem] text-muted-foreground">
                🔒 {t('impact.fund.note')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImpactPage;
