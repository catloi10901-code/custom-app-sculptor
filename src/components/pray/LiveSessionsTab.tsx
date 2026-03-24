import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Radio } from 'lucide-react';

type LiveSession = {
  id: string;
  title: string;
  host: string;
  scheduled_time: string | null;
  youtube_url: string | null;
  is_live: boolean;
  viewers: number;
  is_active: boolean;
  sort_order: number;
};

const cardGradients = [
  'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20',
  'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20',
  'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20',
  'bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20',
];

const formatSchedule = (iso: string | null) => {
  if (!iso) return null;
  return new Date(iso).toLocaleString('vi-VN', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
};

const LiveSessionsTab = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('live_sessions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setSessions(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  const liveSession = sessions.find(s => s.is_live && s.youtube_url);
  const allSessions = sessions;

  if (sessions.length === 0) {
    return (
      <section className="py-20">
        <div className="container text-center">
          <p className="text-5xl mb-4">📺</p>
          <p className="text-muted-foreground">Hiện chưa có phiên live nào được lên lịch.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container">

        {/* Live banner */}
        {liveSession && (
          <div className="bg-gradient-to-r from-red-500/15 to-red-600/[0.08] border border-red-500/30 rounded-xl p-3 flex items-center gap-3 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" style={{ animation: 'livePulse 1.2s ease-in-out infinite' }} />
            <span className="text-foreground font-semibold text-sm">{liveSession.title}</span>
            {liveSession.viewers > 0 && (
              <span className="text-red-400 text-sm font-bold ml-auto">👥 {liveSession.viewers.toLocaleString()} đang xem</span>
            )}
          </div>
        )}

        {/* Main player */}
        {liveSession ? (
          <div className="mb-6">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
              <iframe
                src={`${liveSession.youtube_url}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={liveSession.title}
              />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-bold">
                <Radio className="w-3 h-3" />LIVE
              </span>
              <div>
                <p className="font-semibold text-foreground">{liveSession.title}</p>
                {liveSession.host && <p className="text-sm text-muted-foreground">{liveSession.host}</p>}
              </div>
            </div>
          </div>
        ) : (
          /* No live right now — show placeholder */
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-border mb-6 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">🙏</div>
              <h3 className="font-serif text-primary text-xl mb-2">Chưa có livestream đang diễn ra</h3>
              <p className="text-muted-foreground text-sm">Xem lịch phát bên dưới để không bỏ lỡ</p>
            </div>
          </div>
        )}

        {/* Schedule grid */}
        {allSessions.length > 0 && (
          <>
            <h3 className="font-serif text-foreground text-lg mb-4">Lịch phát sóng</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {allSessions.map((s, i) => (
                <div
                  key={s.id}
                  className={`border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                    s.is_live
                      ? 'bg-gradient-to-br from-red-500/15 to-red-600/5 border-red-500/30 shadow-lg shadow-red-500/10'
                      : cardGradients[i % cardGradients.length]
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {s.is_live ? (
                      <span className="flex items-center gap-1 text-[0.78rem] font-bold text-red-400">
                        <Radio className="w-3 h-3" />LIVE
                      </span>
                    ) : (
                      <span className="text-[0.78rem] font-semibold text-primary">
                        {s.scheduled_time ? `⏰ ${formatSchedule(s.scheduled_time)}` : '📅 Sắp tới'}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground text-[0.9rem] mb-1 line-clamp-2">{s.title}</p>
                  {s.host && <p className="text-[0.78rem] text-muted-foreground">{s.host}</p>}
                  {s.youtube_url && !s.is_live && (
                    <a
                      href={s.youtube_url.replace('/embed/', '/watch?v=')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[0.75rem] text-primary hover:underline"
                    >
                      Xem trước →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LiveSessionsTab;
