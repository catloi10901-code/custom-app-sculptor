import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const GiveCTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-serif text-primary mb-2">{t('section.give.title')}</h2>
          <p className="text-muted-foreground mb-8 text-base sm:text-lg text-balance leading-relaxed">{t('section.give.sub')}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/give" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-[0.95rem] no-underline shadow-[0_4px_20px_rgba(197,160,89,0.35)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5">
              {t('section.give.cta')}
            </Link>
            <Link to="/impact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-transparent text-primary border-[1.5px] border-primary font-bold text-[0.95rem] no-underline transition-all duration-300 hover:bg-gold-dim hover:-translate-y-0.5">
              {t('section.give.cta2')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiveCTASection;
