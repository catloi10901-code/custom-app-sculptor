import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Mail, X } from 'lucide-react';
import PrayerCard from './PrayerCard';
import PrayerForm from './PrayerForm';

const filterEmojis: Record<string, string> = {
  all: '🌐',
  peace: '🕊️',
  prosperity: '⭐',
  poverty: '🌿',
  healing: '💚',
  recovery: '🔄',
  family: '👨‍👩‍👧',
  nation: '🏛️',
};

const PrayerWallTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [prayers, setPrayers] = useState<any[]>([]);
  const [amenedPrayers, setAmenedPrayers] = useState<Set<string>>(new Set());
  const [showLetter, setShowLetter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [realtimeIds, setRealtimeIds] = useState<Set<string>>(new Set());
  const prayersRef = useRef(prayers);
  prayersRef.current = prayers;
  const hoveringRef = useRef(false);

  const filters = [
    { id: 'all', label: t('filter.all') },
    { id: 'peace', label: t('topic.peace') },
    { id: 'prosperity', label: t('topic.prosperity') },
    { id: 'poverty', label: t('topic.poverty') },
    { id: 'healing', label: t('topic.healing') },
    { id: 'recovery', label: t('topic.recovery') },
    { id: 'family', label: t('topic.family') },
    { id: 'nation', label: t('topic.nation') },
  ];

  const fetchPrayers = useCallback(async () => {
    let query = supabase.from('prayers').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(50);
    if (activeFilter !== 'all') query = query.eq('topic', activeFilter);
    const { data, error } = await query;
    if (error) console.error('Error fetching prayers:', error);
    else setPrayers(data || []);
    setLoading(false);
  }, [activeFilter]);

  const fetchUserAmens = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('prayer_amens').select('prayer_id').eq('user_id', user.id);
    if (data) setAmenedPrayers(new Set(data.map(a => a.prayer_id)));
  }, [user]);

  useEffect(() => { fetchPrayers(); fetchUserAmens(); }, [fetchPrayers, fetchUserAmens]);

  // Realtime: prepend new prayers directly from payload
  useEffect(() => {
    const channel = supabase.channel('prayers-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prayers' }, (payload) => {
        const newPrayer = payload.new as any;
        if (!newPrayer.is_approved) return;
        if (activeFilter !== 'all' && newPrayer.topic !== activeFilter) return;
        // If hovering, skip adding new prayers to avoid disruption
        if (hoveringRef.current) return;
        setRealtimeIds(prev => new Set(prev).add(newPrayer.id));
        setPrayers(prev => {
          if (prev.some(p => p.id === newPrayer.id)) return prev;
          return [newPrayer, ...prev].slice(0, 50);
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prayers' }, (payload) => {
        const updated = payload.new as any;
        setPrayers(prev => prev.map(p => p.id === updated.id ? updated : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'prayers' }, (payload) => {
        const deleted = payload.old as any;
        setPrayers(prev => prev.filter(p => p.id !== deleted.id));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeFilter]);

  // Auto-seed prayers every ~600ms, pause on hover
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (!interval) {
        interval = setInterval(() => {
          if (hoveringRef.current) return; // Skip seed while hovering
          supabase.functions.invoke('seed-prayers').catch(() => {});
        }, 600);
      }
    };

    const stop = () => {
      if (interval) { clearInterval(interval); interval = null; }
    };

    const onVisibility = () => {
      document.hidden ? stop() : start();
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const toggleAmen = async (prayerId: string) => {
    if (!user) { toast.error(t('prayerWall.loginAmen')); return; }
    const hasAmened = amenedPrayers.has(prayerId);
    if (hasAmened) {
      await supabase.from('prayer_amens').delete().eq('prayer_id', prayerId).eq('user_id', user.id);
      setAmenedPrayers(prev => { const n = new Set(prev); n.delete(prayerId); return n; });
    } else {
      await supabase.from('prayer_amens').insert({ prayer_id: prayerId, user_id: user.id });
      setAmenedPrayers(prev => new Set(prev).add(prayerId));
    }
    fetchPrayers();
  };

  return (
    <section className="py-20">
      <div className="container">
        {/* Header with gradient banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 p-6 sm:p-8 bg-gradient-to-r from-primary/10 via-blue-500/5 to-purple-500/10 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-primary mb-2 text-xl sm:text-2xl">{t('prayerWall.title')}</h2>
              <p className="text-muted-foreground text-sm sm:text-base">{t('prayerWall.sub')}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLetter(true)}
                className="px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary font-semibold text-sm transition-all duration-300 hover:bg-primary/20 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {t('prayerWall.heartLetter')}
              </button>
              <a href="#submit-form" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:bg-gold-light shadow-lg shadow-primary/20">
                {t('prayerWall.sendBtn')}
              </a>
            </div>
          </div>
        </div>

        {/* Tâm Thư Modal */}
        {showLetter && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowLetter(false)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-card/95 backdrop-blur-sm border-b border-border">
                <h3 className="font-serif text-primary text-lg">📜 {t('prayerWall.heartLetter')}</h3>
                <button onClick={() => setShowLetter(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-4 text-foreground text-[0.9rem] leading-relaxed">
                <div className="text-muted-foreground text-sm space-y-1">
                  <p><strong className="text-foreground">{t('hl.to')}:</strong> {t('hl.toVal')}</p>
                  <p><strong className="text-foreground">{t('hl.from')}:</strong> {t('hl.fromVal')}</p>
                  <p><strong className="text-foreground">{t('hl.date')}:</strong> {t('hl.dateVal')}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p>{t('hl.greeting')}</p>
                  <p className="mt-3">{t('hl.p1')}</p>
                  <p className="mt-3">{t('hl.p2')}</p>
                  <p className="mt-3"><em>{t('hl.p3')}</em></p>
                  <p className="mt-3 font-semibold">{t('hl.bold1')}</p>
                </div>

                <div className="bg-primary/[0.06] border border-primary/20 rounded-xl p-4">
                  <h4 className="font-serif text-primary text-lg mb-2">{t('hl.campaignTitle')}</h4>
                  <p className="font-semibold text-primary text-sm">{t('hl.campaignSub')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">{t('hl.s1Title')}</h4>
                  <p>{t('hl.s1')}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">{t('hl.s2Title')}</h4>
                  <p>{t('hl.s2')}</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-[0.85rem]">
                    <li>{t('hl.s2i1')}</li>
                    <li>{t('hl.s2i2')}</li>
                    <li>{t('hl.s2i3')}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-2">{t('hl.s3Title')}</h4>
                  <p>{t('hl.s3')}</p>
                </div>

                <div className="bg-primary/[0.06] border border-primary/20 rounded-xl p-4 italic text-sm">
                  <p>{t('hl.verse')}</p>
                  <p className="text-primary font-semibold mt-1 not-italic">{t('hl.verseRef')}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">{t('hl.c1')}</p>
                  <p>{t('hl.c2')}</p>
                  <p>{t('hl.c3')}</p>
                  <p className="font-semibold text-primary">{t('hl.c4')}</p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p>{t('hl.c5')}</p>
                  <p>{t('hl.c6')}</p>
                  <p>{t('hl.c7')}</p>
                  <p className="font-semibold mt-3">{t('hl.sign1')}</p>
                  <p className="text-primary font-semibold">{t('hl.sign2')}</p>
                  <p className="text-muted-foreground text-sm mt-2 whitespace-pre-line">{t('hl.sign3')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Filter pills with emojis */}
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-1.5 rounded-full border text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 ${
                activeFilter === f.id
                  ? 'bg-gold-dim border-primary text-primary shadow-md shadow-primary/15'
                  : 'border-border bg-transparent text-muted-foreground hover:bg-gold-dim hover:border-primary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t('prayerWall.loading')}</div>
        ) : prayers.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-2xl mb-2">🙏</p>
            <p>{t('prayerWall.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {prayers.map((prayer, i) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                index={i}
                hasAmened={amenedPrayers.has(prayer.id)}
                onToggleAmen={toggleAmen}
                isRealtime={realtimeIds.has(prayer.id)}
                onMouseEnter={() => { hoveringRef.current = true; }}
                onMouseLeave={() => { hoveringRef.current = false; }}
              />
            ))}
          </div>
        )}

        <PrayerForm onSuccess={fetchPrayers} />
      </div>
    </section>
  );
};

export default PrayerWallTab;
