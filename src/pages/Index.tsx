import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import LiveTicker from '@/components/home/LiveTicker';
import QuickPraySection from '@/components/home/QuickPraySection';
import LiveWidgetSection from '@/components/home/LiveWidgetSection';
import WorldMapSection from '@/components/home/WorldMapSection';
import ImpactStatsSection from '@/components/home/ImpactStatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PartnerLogosSection from '@/components/home/PartnerLogosSection';


const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        const top = el.offsetTop - 210;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div>
      <HeroSection />
      <LiveTicker />
      <div className="h-px bg-border" />
      <QuickPraySection />
      <div className="h-px bg-border" />
      <LiveWidgetSection />
      <div className="h-px bg-border" />
      <WorldMapSection />
      <div className="h-px bg-border" />
      <ImpactStatsSection />
      <div className="h-px bg-border" />
      <TestimonialsSection />
      <div className="h-px bg-border" />
      <PartnerLogosSection />

    </div>
  );
};

export default Index;
