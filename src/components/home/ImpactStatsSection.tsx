import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ImpactStatsSection = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '2.4M+', labelKey: 'impact.stat1', changeKey: 'impact.change1', positive: true },
    { value: '47', labelKey: 'impact.stat3', changeKey: 'impact.change3', positive: true },
    { value: '28', labelKey: 'impact.stat4', changeKey: 'impact.change4', positive: true },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-primary mb-2">{t('section.impact.title')}</h2>
          <p className="text-muted-foreground text-balance">{t('section.impact.sub')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="bg-card border border-border rounded-2xl p-6 text-center">
              <span className="font-serif text-[2.2rem] font-bold text-primary block">{stat.value}</span>
              <div className="text-[0.82rem] text-muted-foreground uppercase tracking-wide mt-1">{t(stat.labelKey)}</div>
              <div className={`text-[0.78rem] mt-1.5 flex items-center justify-center gap-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {t(stat.changeKey)}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/impact" className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border-[1.5px] border-primary bg-transparent text-primary font-bold text-sm no-underline transition-all duration-300 hover:bg-gold-dim hover:-translate-y-0.5">
            {t('impact.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImpactStatsSection;