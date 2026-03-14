import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LiveSession = {
  id: string;
  title: string;
  host: string;
  scheduled_time: string | null;
  is_live: boolean;
  viewers: number;
};

const LiveWidgetSection = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  useEffect(() => {
    supabase
      .from('live_sessions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setSessions(data);
      });
  }, []);

  // Fallback
  const fallbackCards = [
    { id: '1', title: t('live.card1.title'), host: t('live.card1.host'), scheduled_time: null, is_live: true, viewers: 3241 },
    { id: '2', title: t('live.card2.title'), host: t('live.card2.host'), scheduled_time: null, is_live: false, viewers: 0 },
    { id: '3', title: t('live.card3.title'), host: t('live.card3.host'), scheduled_time: null, is_live: false, viewers: 0 },
  ];

  const cards = sessions.length > 0 ? sessions : fallbackCards;

  const formatTime = (s: LiveSession) => {
    if (s.is_live) return '🔴 LIVE';
    if (s.scheduled_time) return new Date(s.scheduled_time).toLocaleString('vi', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    return t('live.card2.time');
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-serif text-primary mb-2 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive" style={{ animation: 'livePulse 1.2s ease-in-out infinite' }} />
              <span className="text-primary">LIVE</span>
            </span>
            <span className="text-foreground">{t('live.title')}</span>
          </h2>
          <Link to="/pray?tab=live" className="text-muted-foreground text-sm hover:text-primary transition-colors no-underline">
            {t('live.viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              to="/pray?tab=live"
              className={`bg-card/50 border border-border rounded-xl p-4 transition-all duration-300 hover:bg-card h-full flex flex-col no-underline ${!card.is_live ? 'opacity-70' : ''}`}
            >
              <div className={`text-[0.78rem] font-semibold mb-1.5 ${card.is_live ? 'text-destructive' : 'text-primary'}`}>
                {formatTime(card)}
              </div>
              <div className="font-semibold text-foreground text-[0.9rem] mb-1 text-balance flex-1">{card.title}</div>
              <div className="text-[0.78rem] text-muted-foreground">{card.host}</div>
              {card.is_live && card.viewers > 0 && (
                <div className="text-[0.75rem] text-muted-foreground mt-2">
                  👥 {card.viewers.toLocaleString()} {t('live.viewers')}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveWidgetSection;
