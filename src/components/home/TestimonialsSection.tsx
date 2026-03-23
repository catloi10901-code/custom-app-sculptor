import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  full_name: string;
  after_prayer: string;
  address: string | null;
  media_urls: string[];
};

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('id, full_name, after_prayer, address, media_urls')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data as unknown as Testimonial[]);
      });
  }, []);

  const fallback = [
    { id: '1', full_name: t('testimonial.1.name'), after_prayer: t('testimonial.1.quote'), address: t('testimonial.1.org'), media_urls: [] },
    { id: '2', full_name: t('testimonial.2.name'), after_prayer: t('testimonial.2.quote'), address: t('testimonial.2.org'), media_urls: [] },
    { id: '3', full_name: t('testimonial.3.name'), after_prayer: t('testimonial.3.quote'), address: t('testimonial.3.org'), media_urls: [] },
  ];

  const items = testimonials.length > 0 ? testimonials : fallback;

  return (
    <section className="py-20" style={{ background: 'rgba(197,160,89,0.03)' }}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-primary mb-2">{t('section.testimonials.title')}</h2>
          <p className="text-muted-foreground text-balance">{t('section.testimonials.sub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-2xl p-7 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] h-full flex flex-col">
              <div className="text-[1.8rem] mb-3">💬</div>
              <p className="italic text-muted-foreground mb-4 leading-[1.8] flex-1 line-clamp-5">{item.after_prayer}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-11 h-11 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-primary font-bold text-lg">
                  {item.media_urls?.[0]
                    ? <img src={item.media_urls[0]} className="w-full h-full rounded-full object-cover" alt="" />
                    : item.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong className="block text-[0.92rem]">{item.full_name}</strong>
                  {item.address && <span className="text-[0.8rem] text-muted-foreground">{item.address}</span>}
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
