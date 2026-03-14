import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LiveWidgetSection = () => {
  const { t } = useTranslation();

  const liveCards = [
    { time: '🔴 LIVE', title: t('live.card1.title'), host: t('live.card1.host'), viewers: '3,241', isLive: true },
    { time: t('live.card2.time'), title: t('live.card2.title'), host: t('live.card2.host'), viewers: '', isLive: false },
    { time: t('live.card3.time'), title: t('live.card3.title'), host: t('live.card3.host'), viewers: '', isLive: false },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-serif text-primary mb-2">
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" style={{ animation: 'livePulse 1.2s ease-in-out infinite' }} />
              LIVE
            </span>{' '}
            <span className="text-white whitespace-nowrap">{t('live.title')}</span>
          </h2>
          <Link to="/pray?tab=live" className="text-muted-foreground text-sm hover:text-primary transition-colors no-underline">
            {t('live.viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveCards.map((card, i) => (
            <Link
              key={i}
              to="/pray?tab=live"
              className={`bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.07] h-full flex flex-col no-underline ${!card.isLive ? 'opacity-70' : ''}`}
            >
              <div className={`text-[0.78rem] font-semibold mb-1.5 ${card.isLive ? 'text-red-400' : 'text-primary'}`}>
                {card.time}
              </div>
              <div className="font-semibold text-foreground text-[0.9rem] mb-1 text-balance flex-1">{card.title}</div>
              <div className="text-[0.78rem] text-muted-foreground">{card.host}</div>
              {card.viewers && (
                <div className="text-[0.75rem] text-muted-foreground mt-2">
                  👥 {card.viewers} {t('live.viewers')}
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