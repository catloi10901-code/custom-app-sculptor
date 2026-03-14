import { useTranslation } from 'react-i18next';

const cardGradients = [
  'bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20',
  'bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20',
  'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
  'bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20',
  'bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20',
];

const LiveSessionsTab = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container">
        <div className="bg-gradient-to-r from-red-500/15 to-red-600/[0.08] border border-red-500/30 rounded-xl p-3 flex items-center gap-3 mb-5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" style={{ animation: 'livePulse 1.2s ease-in-out infinite' }} />
          <span className="text-foreground font-semibold text-sm">{t('liveSessions.banner')}</span>
          <span className="text-red-400 text-sm font-bold ml-auto">👥 3,241 {t('liveSessions.viewers')}</span>
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-red-500/10 to-purple-500/10 border border-red-500/20 mb-5 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="font-serif text-primary text-xl mb-2">{t('liveSessions.liveTitle')}</h3>
            <p className="text-muted-foreground text-sm">{t('liveSessions.liveHost')}</p>
            <button className="mt-4 px-6 py-2.5 rounded-lg bg-red-500 text-white font-bold text-sm transition-all duration-300 hover:bg-red-600 shadow-lg shadow-red-500/25">
              {t('liveSessions.joinNow')}
            </button>
          </div>
        </div>

        <h3 className="font-serif text-foreground text-lg mb-4">{t('liveSessions.schedule')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { time: '🔴 LIVE', title: t('liveSessions.peaceTitle'), host: t('live.card1.host'), isLive: true, icon: '🕊️' },
            { time: t('live.card2.time'), title: t('liveSessions.prosperityTitle'), host: t('live.card2.host'), isLive: false, icon: '⭐' },
            { time: t('live.card3.time'), title: t('liveSessions.dawnTitle'), host: t('live.card3.host'), isLive: false, icon: '🌅' },
            { time: '⏰ 14:00', title: t('liveSessions.healingTitle'), host: 'Pastor Grace Lee', isLive: false, icon: '💊' },
            { time: '⏰ 19:00', title: t('liveSessions.worshipTitle'), host: 'Worship Team', isLive: false, icon: '🎵' },
            { time: '⏰ 08:00', title: t('liveSessions.globalTitle'), host: 'UNPray International', isLive: false, icon: '🌍' },
          ].map((card, i) => (
            <div
              key={i}
              className={`border rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                card.isLive
                  ? 'bg-gradient-to-br from-red-500/15 to-red-600/5 border-red-500/30 shadow-lg shadow-red-500/10'
                  : `${cardGradients[i % cardGradients.length]}`
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{card.icon}</span>
                <span className={`text-[0.78rem] font-semibold ${card.isLive ? 'text-red-400' : 'text-primary'}`}>{card.time}</span>
              </div>
              <div className="font-semibold text-foreground text-[0.9rem] mb-1">{card.title}</div>
              <div className="text-[0.78rem] text-muted-foreground">{card.host}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveSessionsTab;
