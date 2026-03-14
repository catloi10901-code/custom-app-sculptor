import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import HeroGlobe2D from './HeroGlobe2D';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const HeroSection = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ prayers: 0, nations: 0, members: 0, donated: 0 });

  useEffect(() => {
    const fetchNations = async () => {
      const { data } = await supabase.from('prayers').select('country');
      const countries = new Set((data || []).map(p => p.country).filter(Boolean));
      setStats(prev => ({ ...prev, nations: countries.size }));
    };
    fetchNations();
  }, []);

  useEffect(() => {
    const fetchLiveStats = async () => {
      const { data } = await supabase
        .from('live_stats')
        .select('prayers_count, members_count, donated_total')
        .eq('id', 1)
        .single();
      if (data) {
        setStats(prev => ({
          ...prev,
          prayers: Number(data.prayers_count),
          members: Number(data.members_count),
          donated: Number(data.donated_total),
        }));
      }
    };
    fetchLiveStats();

    const channel = supabase
      .channel('hero-live-stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_stats' }, (payload) => {
        const d = payload.new as any;
        setStats(prev => ({
          ...prev,
          prayers: Number(d.prayers_count),
          members: Number(d.members_count),
          donated: Number(d.donated_total),
        }));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ background: '#0f2347' }}>
      {/* Background layers */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% 0%, #153d8a 0%, transparent 60%),
          radial-gradient(ellipse 80% 60% at 20% 60%, #0e2d6e 0%, transparent 55%),
          radial-gradient(ellipse 60% 70% at 80% 40%, #12357a 0%, transparent 50%),
          linear-gradient(180deg, #0e2d6e 0%, #12357a 40%, #0e2d6e 100%)
        `
      }} />

      {/* Nebula - hidden on small mobile for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute w-[70vw] h-[60vh] -top-[10%] -left-[10%] blur-[40px]" style={{
          background: 'radial-gradient(ellipse at center, rgba(197,160,89,0.10) 0%, rgba(30,80,200,0.12) 30%, transparent 70%)',
          animation: 'nebulaDrift 20s ease-in-out infinite alternate'
        }} />
        <div className="absolute w-[60vw] h-[70vh] -bottom-[20%] -right-[5%] blur-[50px]" style={{
          background: 'radial-gradient(ellipse at center, rgba(37,84,199,0.18) 0%, rgba(197,160,89,0.06) 35%, transparent 70%)',
          animation: 'nebulaDrift 25s ease-in-out infinite alternate-reverse'
        }} />
      </div>

      {/* Shooting stars - hidden on mobile */}
      <div className="absolute w-[2px] h-[2px] bg-white rounded-full top-[15%] left-[10%] opacity-0 hidden md:block" style={{ animation: 'shoot 8s linear infinite' }}>
        <div className="absolute top-1/2 right-[2px] w-20 h-px bg-gradient-to-l from-transparent to-white -translate-y-1/2" />
      </div>

      {/* Aurora */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 30% 100%, rgba(197,160,89,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 30% at 70% 100%, rgba(20,145,155,0.08) 0%, transparent 55%)
        `,
        animation: 'auroraPulse 12s ease-in-out infinite alternate'
      }} />

      {/* Mist */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(197,160,89,0.04) 0%, rgba(26,47,82,0.55) 40%, transparent 100%)'
      }} />

      {/* Content */}
      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-4 sm:gap-8 items-center py-6 sm:py-8 md:pt-8 md:pb-8">
        {/* Left */}
        <div className="relative z-10 order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-gold-dim border border-primary/40 text-primary px-3 sm:px-4 py-1.5 rounded-full text-[0.65rem] sm:text-[0.82rem] font-bold tracking-widest uppercase mb-4 sm:mb-6" style={{ animation: 'fadeDown 0.8s ease both' }}>
            <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" style={{ animation: 'pulse 2s infinite' }} />
            <span className="whitespace-nowrap">{t('hero.badge')}</span>
          </div>

          <h1 className="text-white mb-3 sm:mb-5" style={{ animation: 'fadeUp 0.9s ease 0.2s both', fontSize: 'clamp(1.1rem, 2.8vw, 2.5rem)' }}>
            <span className="block">{t('hero.title1')}</span>
            <span className="block text-primary">{t('hero.title2')}</span>
          </h1>

          <p className="text-muted-foreground text-sm sm:text-lg leading-[1.7] mb-6 sm:mb-9 max-w-[620px] mx-auto lg:mx-0" style={{ animation: 'fadeUp 0.9s ease 0.4s both' }}>
            {t('hero.sub')}
          </p>

          <div className="flex gap-2.5 sm:gap-4 flex-wrap justify-center lg:justify-start mb-8 sm:mb-14" style={{ animation: 'fadeUp 0.9s ease 0.6s both' }}>
            <Link to="/pray" className="inline-flex items-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-[0.82rem] sm:text-[0.95rem] tracking-wide no-underline shadow-[0_4px_20px_rgba(197,160,89,0.35)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(197,160,89,0.5)]">
              {t('hero.cta1')}
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-lg bg-transparent text-primary border-[1.5px] border-primary font-bold text-[0.82rem] sm:text-[0.95rem] no-underline transition-all duration-300 hover:bg-gold-dim hover:-translate-y-0.5">
              {t('hero.cta2')}
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-8" style={{ animation: 'fadeUp 0.9s ease 0.8s both' }}>
            <div className="text-center lg:text-left">
              <AnimatedCounter value={stats.prayers} className="font-serif text-[1.2rem] sm:text-[1.8rem] font-bold text-primary block tabular-nums" />
              <span className="text-[0.65rem] sm:text-[0.82rem] text-muted-foreground uppercase tracking-wide">{t('hero.stat.prayers')}</span>
            </div>
            <div className="text-center lg:text-left">
              <AnimatedCounter value={stats.nations} className="font-serif text-[1.2rem] sm:text-[1.8rem] font-bold text-primary block tabular-nums" />
              <span className="text-[0.65rem] sm:text-[0.82rem] text-muted-foreground uppercase tracking-wide">{t('hero.stat.nations')}</span>
            </div>
            <div className="text-center lg:text-left">
              <AnimatedCounter value={stats.members} className="font-serif text-[1.2rem] sm:text-[1.8rem] font-bold text-primary block tabular-nums" />
              <span className="text-[0.65rem] sm:text-[0.82rem] text-muted-foreground uppercase tracking-wide">{t('hero.stat.members')}</span>
            </div>
          </div>
        </div>

        {/* Right - Globe */}
        <div className="relative flex items-center justify-center order-1 lg:order-2 overflow-visible">
          <div className="absolute w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] md:w-[440px] md:h-[440px] rounded-full opacity-40 pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(197,160,89,0.25) 0%, rgba(197,160,89,0.08) 40%, transparent 70%)',
            filter: 'blur(30px)',
          }} />
          <div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] md:w-[500px] md:h-[500px] relative z-10 overflow-visible">
              <HeroGlobe2D />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
