import HeroSection from '@/components/home/HeroSection';
import LiveTicker from '@/components/home/LiveTicker';
import QuickPraySection from '@/components/home/QuickPraySection';
import LiveWidgetSection from '@/components/home/LiveWidgetSection';
import WorldMapSection from '@/components/home/WorldMapSection';
import ImpactStatsSection from '@/components/home/ImpactStatsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';


const Index = () => {
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
      
    </div>
  );
};

export default Index;
