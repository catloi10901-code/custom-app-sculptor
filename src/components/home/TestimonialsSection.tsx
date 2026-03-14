import { useTranslation } from 'react-i18next';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    { quoteKey: 'testimonial.1.quote', nameKey: 'testimonial.1.name', orgKey: 'testimonial.1.org', avatar: '👤' },
    { quoteKey: 'testimonial.2.quote', nameKey: 'testimonial.2.name', orgKey: 'testimonial.2.org', avatar: '👤' },
    { quoteKey: 'testimonial.3.quote', nameKey: 'testimonial.3.name', orgKey: 'testimonial.3.org', avatar: '👤' },
  ];

  return (
    <section className="py-20" style={{ background: 'rgba(197,160,89,0.03)' }}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-primary mb-2">{t('section.testimonials.title')}</h2>
          <p className="text-muted-foreground text-balance">{t('section.testimonials.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] h-full flex flex-col">
              <div className="text-[1.8rem] mb-3">💬</div>
              <p className="italic text-muted-foreground mb-4 leading-[1.8] flex-1">{t(item.quoteKey)}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-11 h-11 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-xl">
                  {item.avatar}
                </div>
                <div>
                  <strong className="block text-[0.92rem]">{t(item.nameKey)}</strong>
                  <span className="text-[0.8rem] text-muted-foreground">{t(item.orgKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;