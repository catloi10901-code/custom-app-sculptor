import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const cards = [
  { icon: '🕊', titleKey: 'card.peace.title', descKey: 'card.peace.desc', topic: 'peace' },
  { icon: '🌾', titleKey: 'card.poverty.title', descKey: 'card.poverty.desc', topic: 'poverty' },
  { icon: '💚', titleKey: 'card.healing.title', descKey: 'card.healing.desc', topic: 'healing' },
];

const QuickPraySection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-primary mb-2 tracking-wide">{t('section.quickpray.title')}</h2>
          <p className="text-muted-foreground text-base text-balance">{t('section.quickpray.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {cards.map((card) => (
            <Link
              key={card.topic}
              to={`/pray?topic=${card.topic}`}
              className="group relative overflow-hidden bg-card border border-border rounded-2xl p-7 text-center cursor-pointer transition-all duration-300 no-underline hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] h-full flex flex-col"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.1),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="text-[2.5rem] block mb-3 relative z-10">{card.icon}</span>
              <h3 className="text-lg text-primary mb-2 relative z-10">{t(card.titleKey)}</h3>
              <p className="text-[0.95rem] text-muted-foreground leading-relaxed relative z-10 text-balance flex-1">{t(card.descKey)}</p>
              <div className="mt-4 relative z-10">
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gold-dim border border-primary/30 text-primary text-sm font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {t('card.pray')}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/pray" className="text-primary font-semibold text-sm no-underline hover:underline">
            {t('section.prayerwall.link')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickPraySection;
