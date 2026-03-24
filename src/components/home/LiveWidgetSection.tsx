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
  youtube_url: string | null;
  thumbnail_url: string | null;
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
      .limit(5)
      .then(({ data }) => {
        if (data && data.length > 0) setSessions(data);
      });
  }, []);

  const liveSession = sessions.find((s) => s.is_live && s.youtube_url);
  const upcomingSessions = sessions.filter((s) => !s.is_live || !s.youtube_url);

  const formatTime = (s: LiveSession) => {
    if (s.is_live) return '🔴 LIVE';
    if (s.scheduled_time) {
      return new Date(s.scheduled_time).toLocaleString('vi', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      });
    }
    return t('live.card2.time') || '';
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
          <Link
            to="/pray?tab=live"
            className="text-muted-foreground text-sm hover:text-primary transition-colors no-underline"
          >
            {t('live.viewAll')}
          </Link>
        </div>

        {/* ── Live embed ── */}
        {liveSession ? (
          <div className="mb-6">
            <div className="rounded-2xl overflow-hidden border border-border shadow-[0_8px_40px_rgba(0,0,0,.4)]">
              <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />
                <span className="text-destructive text-xs font-black tracking-widest uppercase">NOW LIVING</span>
                <span className="text-foreground text-sm font-semibold flex-1">{liveSession.title}</span>
                {liveSession.viewers > 0 && (
                  <span className="text-muted-foreground text-xs">👥 {liveSession.viewers.toLocaleString()}</span>
                )}
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`${liveSession.youtube_url}?autoplay=1&mute=1&rel=0&modestbranding=1&color=white`}
                  title={liveSession.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Schedule ── */}
        {sessions.length > 0 && (
          <div>
            <p className="text-[0.75rem] font-black tracking-[2px] uppercase text-muted-foreground mb-4">
              {t('live.schedule') || '📅 Lịch phát sóng'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((card) => (
                <Link
                  key={card.id}
                  to="/pray?tab=live"
                  className={`bg-card/50 border border-border rounded-xl p-4 transition-all duration-300 hover:bg-card hover:border-primary/30 no-underline flex flex-col gap-2 ${
                    card.is_live && card.youtube_url ? 'border-primary/30 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[0.72rem] font-bold px-2 py-0.5 rounded-full ${
                        card.is_live
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {formatTime(card)}
                    </span>
                    {card.is_live && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                      </span>
                    )}
                  </div>
                  <span className="text-foreground text-[0.88rem] font-semibold leading-snug flex-1">
                    {card.title}
                  </span>
                  <span className="text-muted-foreground text-[0.78rem]">{card.host}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveWidgetSection;
