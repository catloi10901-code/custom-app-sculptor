import { ReactNode, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Pill {
  icon: string;
  text: string;
}

interface PageHeroProps {
  badge: { icon: ReactNode; text: string };
  title: ReactNode;
  subtitle: string;
  pills?: Pill[];
  bgKey: 'hero_bg_about' | 'hero_bg_give' | 'hero_bg_news' | 'hero_bg_library';
}

const PageHero = ({ badge, title, subtitle, pills, bgKey }: PageHeroProps) => {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', bgKey)
      .maybeSingle()
      .then(({ data }) => { if (data?.content_value) setBgImage(data.content_value); });
  }, [bgKey]);

  return (
  <section className="relative overflow-hidden py-24 sm:py-32">
    {/* Blurred background image */}
    {bgImage && (
      <div className="absolute inset-0 overflow-hidden">
        <img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'blur(8px)', transform: 'scale(1.1)', opacity: 0.6 }} />
      </div>
    )}
    {/* Gradient overlay */}
    <div className="absolute inset-0" style={{
      background: `
        radial-gradient(ellipse 100% 80% at 50% -10%, rgba(197,160,89,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(96,165,250,0.08) 0%, transparent 50%),
        radial-gradient(ellipse 50% 60% at 20% 70%, rgba(110,231,183,0.06) 0%, transparent 50%),
        linear-gradient(180deg, hsl(221 68% 30% / 0.72) 0%, hsl(221 68% 33% / 0.72) 100%)
      `
    }} />
    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
      backgroundImage: 'linear-gradient(rgba(197,160,89,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.5) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }} />

    <div className="container relative z-10 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-widest uppercase mb-6" style={{ animation: 'fadeDown 0.8s ease both' }}>
        {badge.icon}
        {badge.text}
      </div>

      {/* Title */}
      <h1 className="font-serif text-primary mb-5" style={{ animation: 'fadeUp 0.9s ease 0.2s both', fontSize: 'clamp(1.8rem, 4vw, 3.2rem)' }}>
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-muted-foreground text-lg max-w-[640px] mx-auto leading-relaxed" style={{ animation: 'fadeUp 0.9s ease 0.4s both' }}>
        {subtitle}
      </p>

      {/* Pills */}
      {pills && pills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-10" style={{ animation: 'fadeUp 0.9s ease 0.6s both' }}>
          {pills.map((pill, i) => (
            <div key={i} className="flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/60 rounded-full px-4 py-2 text-[0.82rem] text-muted-foreground">
              <span>{pill.icon}</span>
              <span className="font-medium">{pill.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
  );
};

export default PageHero;
