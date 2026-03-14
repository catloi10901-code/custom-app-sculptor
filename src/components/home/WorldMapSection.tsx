import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import WorldMapGlobe2D from './WorldMapGlobe2D';
import type { PrayerLocation, RippleEvent } from './WorldMapGlobe2D';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

// Country name → lat/lon mapping
const COUNTRY_COORDS: Record<string, { lat: number; lon: number }> = {
  'USA': { lat: 39.8, lon: -98.6 },
  'US': { lat: 39.8, lon: -98.6 },
  'United States': { lat: 39.8, lon: -98.6 },
  'Vietnam': { lat: 16, lon: 106 },
  'Việt Nam': { lat: 16, lon: 106 },
  'Brazil': { lat: -14.2, lon: -51.9 },
  'UK': { lat: 51.5, lon: -0.1 },
  'United Kingdom': { lat: 51.5, lon: -0.1 },
  'France': { lat: 46.6, lon: 2.2 },
  'Germany': { lat: 51.2, lon: 10.4 },
  'Italy': { lat: 41.9, lon: 12.5 },
  'Spain': { lat: 40.5, lon: -3.7 },
  'Russia': { lat: 55.8, lon: 37.6 },
  'India': { lat: 20.6, lon: 79 },
  'China': { lat: 35.9, lon: 104.2 },
  'Japan': { lat: 36.2, lon: 138.3 },
  'South Korea': { lat: 35.9, lon: 127.8 },
  'Korea': { lat: 35.9, lon: 127.8 },
  'Australia': { lat: -25.3, lon: 133.8 },
  'Canada': { lat: 56.1, lon: -106.3 },
  'Mexico': { lat: 23.6, lon: -102.6 },
  'Argentina': { lat: -38.4, lon: -63.6 },
  'Colombia': { lat: 4.6, lon: -74.1 },
  'Peru': { lat: -9.2, lon: -75 },
  'Chile': { lat: -35.7, lon: -71.5 },
  'Nigeria': { lat: 9.1, lon: 8.7 },
  'South Africa': { lat: -30.6, lon: 22.9 },
  'Kenya': { lat: -0.02, lon: 37.9 },
  'Egypt': { lat: 26.8, lon: 30.8 },
  'Ghana': { lat: 7.9, lon: -1.0 },
  'Philippines': { lat: 12.9, lon: 121.8 },
  'Indonesia': { lat: -0.8, lon: 113.9 },
  'Thailand': { lat: 15.9, lon: 100.9 },
  'Singapore': { lat: 1.4, lon: 103.8 },
  'Malaysia': { lat: 4.2, lon: 101.9 },
  'Netherlands': { lat: 52.1, lon: 5.3 },
  'Poland': { lat: 51.9, lon: 19.1 },
  'Sweden': { lat: 60.1, lon: 18.6 },
  'Norway': { lat: 60.5, lon: 8.5 },
  'Portugal': { lat: 39.4, lon: -8.2 },
  'Turkey': { lat: 38.9, lon: 35.2 },
  'Saudi Arabia': { lat: 23.9, lon: 45 },
  'UAE': { lat: 23.4, lon: 53.8 },
  'Israel': { lat: 31.1, lon: 34.9 },
  'Pakistan': { lat: 30.4, lon: 69.3 },
  'Bangladesh': { lat: 23.7, lon: 90.4 },
  'Myanmar': { lat: 21.9, lon: 95.9 },
  'Cambodia': { lat: 12.6, lon: 104.9 },
  'Taiwan': { lat: 23.7, lon: 121 },
  'New Zealand': { lat: -40.9, lon: 174.9 },
  'Ethiopia': { lat: 9, lon: 38.7 },
  'Tanzania': { lat: -6.4, lon: 34.9 },
  'Uganda': { lat: 1.4, lon: 32.3 },
  'DR Congo': { lat: -4.3, lon: 15.3 },
  'Morocco': { lat: 31.8, lon: -7.1 },
  'Algeria': { lat: 28, lon: 1.7 },
  'Iraq': { lat: 33.2, lon: 43.7 },
  'Iran': { lat: 32.4, lon: 53.7 },
  'Ukraine': { lat: 48.4, lon: 31.2 },
  'Romania': { lat: 45.9, lon: 25 },
  'Greece': { lat: 39.1, lon: 21.8 },
  'Switzerland': { lat: 46.8, lon: 8.2 },
  'Austria': { lat: 47.5, lon: 14.6 },
  'Belgium': { lat: 50.5, lon: 4.5 },
  'Czech Republic': { lat: 49.8, lon: 15.5 },
  'Hungary': { lat: 47.2, lon: 19.5 },
  'Denmark': { lat: 56.3, lon: 9.5 },
  'Finland': { lat: 61.9, lon: 25.7 },
  'Ireland': { lat: 53.1, lon: -7.7 },
  'Scotland': { lat: 56.5, lon: -4.2 },
};

const WorldMapSection = () => {
  const { t } = useTranslation();
  const [prayerLocations, setPrayerLocations] = useState<PrayerLocation[]>([]);
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [liveCount, setLiveCount] = useState(0);
  const [newRipples, setNewRipples] = useState<RippleEvent[]>([]);

  const fetchPrayers = async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('country')
      .eq('is_approved', true)
      .not('country', 'is', null);

    if (error || !data) return;

    const countByCountry: Record<string, number> = {};
    data.forEach((p) => {
      const country = p.country?.trim();
      if (country) {
        countByCountry[country] = (countByCountry[country] || 0) + 1;
      }
    });

    const locations: PrayerLocation[] = [];
    Object.entries(countByCountry).forEach(([country, count]) => {
      const coords = COUNTRY_COORDS[country];
      if (coords) {
        locations.push({ lat: coords.lat, lon: coords.lon, name: country, prayers: count });
      }
    });

    setPrayerLocations(locations);
    setTotalPrayers(data.length);
  };

  useEffect(() => {
    fetchPrayers();

    const channel = supabase
      .channel('globe-prayers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prayers' }, (payload) => {
        // Trigger ripple for the new prayer's country
        const country = (payload.new as any)?.country?.trim();
        if (country) {
          const coords = COUNTRY_COORDS[country];
          if (coords) {
            setNewRipples([{ id: `ripple-${Date.now()}`, lat: coords.lat, lon: coords.lon }]);
          }
        }
        fetchPrayers();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prayers' }, () => {
        fetchPrayers();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'prayers' }, () => {
        fetchPrayers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Read live_stats for prayer count + realtime sync
  useEffect(() => {
    const fetchLiveCount = async () => {
      const { data } = await supabase
        .from('live_stats')
        .select('prayers_count')
        .eq('id', 1)
        .single();
      if (data) setLiveCount(Number(data.prayers_count));
    };
    fetchLiveCount();

    const channel = supabase
      .channel('map-live-stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_stats' }, (payload) => {
        setLiveCount(Number((payload.new as any).prayers_count));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-serif text-primary mb-2">{t('section.map.title')}</h2>
          <p className="text-muted-foreground text-base text-balance">{t('section.map.sub')}</p>
        </div>

        <div
          className="relative h-[320px] sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden border border-primary/20"
          style={{
            background: 'linear-gradient(180deg, #0a1628 0%, #1a3460 50%, #0f2240 100%)',
          }}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                Loading globe...
              </div>
            }
          >
            <WorldMapGlobe2D prayerLocations={prayerLocations} newRipples={newRipples} />
          </Suspense>

          {/* Legend */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-[rgba(4,14,30,0.85)] p-2.5 rounded-lg border border-[#e8c87a]/20 backdrop-blur-lg z-10">
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e8c87a] shadow-[0_0_6px_#e8c87a]" />{' '}
              {t('section.map.legend.prayers')}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7] shadow-[0_0_6px_#6ee7b7]" />{' '}
              {t('section.map.legend.active')}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_#60a5fa]" />{' '}
              {t('section.map.legend.new')}
            </div>
          </div>

          {/* Live counter */}
          <div className="absolute bottom-4 left-4 bg-[rgba(4,14,30,0.9)] px-4 py-2.5 rounded-lg border border-[#e8c87a]/25 text-[0.85rem] text-muted-foreground backdrop-blur-lg z-10">
            🙏 <strong className="text-[#e8c87a] tabular-nums inline-block">
              {liveCount > 0 ? <AnimatedCounter value={liveCount} className="" /> : '—'}
            </strong> {t('section.map.live')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMapSection;
