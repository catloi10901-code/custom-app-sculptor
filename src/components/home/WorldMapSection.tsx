import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import WorldMapGlobe2D from './WorldMapGlobe2D';
import type { PrayerLocation, RippleEvent } from './WorldMapGlobe2D';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

// Country name → lat/lon mapping
const COUNTRY_COORDS: Record<string, { lat: number; lon: number }> = {
  'USA': { lat: 39.8, lon: -98.6 }, 'US': { lat: 39.8, lon: -98.6 }, 'United States': { lat: 39.8, lon: -98.6 },
  'Vietnam': { lat: 16, lon: 106 }, 'Việt Nam': { lat: 16, lon: 106 },
  'Brazil': { lat: -14.2, lon: -51.9 }, 'UK': { lat: 51.5, lon: -0.1 }, 'United Kingdom': { lat: 51.5, lon: -0.1 },
  'France': { lat: 46.6, lon: 2.2 }, 'Germany': { lat: 51.2, lon: 10.4 }, 'Italy': { lat: 41.9, lon: 12.5 },
  'Spain': { lat: 40.5, lon: -3.7 }, 'Russia': { lat: 55.8, lon: 37.6 }, 'India': { lat: 20.6, lon: 79 },
  'China': { lat: 35.9, lon: 104.2 }, 'Japan': { lat: 36.2, lon: 138.3 },
  'South Korea': { lat: 35.9, lon: 127.8 }, 'Korea': { lat: 35.9, lon: 127.8 },
  'Australia': { lat: -25.3, lon: 133.8 }, 'Canada': { lat: 56.1, lon: -106.3 },
  'Mexico': { lat: 23.6, lon: -102.6 }, 'Argentina': { lat: -38.4, lon: -63.6 },
  'Colombia': { lat: 4.6, lon: -74.1 }, 'Peru': { lat: -9.2, lon: -75 }, 'Chile': { lat: -35.7, lon: -71.5 },
  'Nigeria': { lat: 9.1, lon: 8.7 }, 'South Africa': { lat: -30.6, lon: 22.9 },
  'Kenya': { lat: -0.02, lon: 37.9 }, 'Egypt': { lat: 26.8, lon: 30.8 }, 'Ghana': { lat: 7.9, lon: -1.0 },
  'Philippines': { lat: 12.9, lon: 121.8 }, 'Indonesia': { lat: -0.8, lon: 113.9 },
  'Thailand': { lat: 15.9, lon: 100.9 }, 'Singapore': { lat: 1.4, lon: 103.8 },
  'Malaysia': { lat: 4.2, lon: 101.9 }, 'Netherlands': { lat: 52.1, lon: 5.3 },
  'Poland': { lat: 51.9, lon: 19.1 }, 'Sweden': { lat: 60.1, lon: 18.6 },
  'Norway': { lat: 60.5, lon: 8.5 }, 'Portugal': { lat: 39.4, lon: -8.2 },
  'Turkey': { lat: 38.9, lon: 35.2 }, 'Saudi Arabia': { lat: 23.9, lon: 45 },
  'UAE': { lat: 23.4, lon: 53.8 }, 'Israel': { lat: 31.1, lon: 34.9 },
  'Pakistan': { lat: 30.4, lon: 69.3 }, 'Bangladesh': { lat: 23.7, lon: 90.4 },
  'Myanmar': { lat: 21.9, lon: 95.9 }, 'Cambodia': { lat: 12.6, lon: 104.9 },
  'Taiwan': { lat: 23.7, lon: 121 }, 'New Zealand': { lat: -40.9, lon: 174.9 },
  'Ethiopia': { lat: 9, lon: 38.7 }, 'Tanzania': { lat: -6.4, lon: 34.9 },
  'Uganda': { lat: 1.4, lon: 32.3 }, 'DR Congo': { lat: -4.3, lon: 15.3 },
  'Morocco': { lat: 31.8, lon: -7.1 }, 'Algeria': { lat: 28, lon: 1.7 },
  'Iraq': { lat: 33.2, lon: 43.7 }, 'Iran': { lat: 32.4, lon: 53.7 },
  'Ukraine': { lat: 48.4, lon: 31.2 }, 'Romania': { lat: 45.9, lon: 25 },
  'Greece': { lat: 39.1, lon: 21.8 }, 'Switzerland': { lat: 46.8, lon: 8.2 },
  'Austria': { lat: 47.5, lon: 14.6 }, 'Belgium': { lat: 50.5, lon: 4.5 },
  'Czech Republic': { lat: 49.8, lon: 15.5 }, 'Hungary': { lat: 47.2, lon: 19.5 },
  'Denmark': { lat: 56.3, lon: 9.5 }, 'Finland': { lat: 61.9, lon: 25.7 },
  'Ireland': { lat: 53.1, lon: -7.7 }, 'Scotland': { lat: 56.5, lon: -4.2 },
};

// Country → Region mapping
const COUNTRY_REGION: Record<string, string> = {
  'USA': 'North America', 'US': 'North America', 'United States': 'North America',
  'Canada': 'North America', 'Mexico': 'North America',
  'Brazil': 'South America', 'Argentina': 'South America', 'Colombia': 'South America',
  'Peru': 'South America', 'Chile': 'South America',
  'UK': 'Europe', 'United Kingdom': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
  'Italy': 'Europe', 'Spain': 'Europe', 'Russia': 'Europe', 'Netherlands': 'Europe',
  'Poland': 'Europe', 'Sweden': 'Europe', 'Norway': 'Europe', 'Portugal': 'Europe',
  'Ukraine': 'Europe', 'Romania': 'Europe', 'Greece': 'Europe', 'Switzerland': 'Europe',
  'Austria': 'Europe', 'Belgium': 'Europe', 'Czech Republic': 'Europe', 'Hungary': 'Europe',
  'Denmark': 'Europe', 'Finland': 'Europe', 'Ireland': 'Europe', 'Scotland': 'Europe',
  'Turkey': 'Middle East', 'Saudi Arabia': 'Middle East', 'UAE': 'Middle East',
  'Israel': 'Middle East', 'Iraq': 'Middle East', 'Iran': 'Middle East', 'Egypt': 'Middle East',
  'Morocco': 'Middle East', 'Algeria': 'Middle East',
  'Nigeria': 'Africa', 'South Africa': 'Africa', 'Kenya': 'Africa', 'Ghana': 'Africa',
  'Ethiopia': 'Africa', 'Tanzania': 'Africa', 'Uganda': 'Africa', 'DR Congo': 'Africa',
  'India': 'Asia', 'China': 'Asia', 'Japan': 'Asia', 'South Korea': 'Asia', 'Korea': 'Asia',
  'Vietnam': 'Asia', 'Việt Nam': 'Asia', 'Philippines': 'Asia', 'Indonesia': 'Asia',
  'Thailand': 'Asia', 'Singapore': 'Asia', 'Malaysia': 'Asia', 'Pakistan': 'Asia',
  'Bangladesh': 'Asia', 'Myanmar': 'Asia', 'Cambodia': 'Asia', 'Taiwan': 'Asia',
  'Australia': 'Asia', 'New Zealand': 'Asia',
};

const REGIONS = [
  { key: 'Asia', icon: '🌏', label: 'Châu Á' },
  { key: 'Middle East', icon: '🕌', label: 'Trung Đông' },
  { key: 'Africa', icon: '🌍', label: 'Châu Phi' },
  { key: 'Europe', icon: '🏰', label: 'Châu Âu' },
  { key: 'South America', icon: '🌎', label: 'Nam Mỹ' },
  { key: 'North America', icon: '🗽', label: 'Bắc Mỹ' },
];

const WorldMapSection = () => {
  const { t } = useTranslation();
  const [prayerLocations, setPrayerLocations] = useState<PrayerLocation[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [newRipples, setNewRipples] = useState<RippleEvent[]>([]);
  const [countByRegion, setCountByRegion] = useState<Record<string, number>>({});
  const [activeCountries, setActiveCountries] = useState<string[]>([]);

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
      if (country) countByCountry[country] = (countByCountry[country] || 0) + 1;
    });

    const locations: PrayerLocation[] = [];
    const regions: Record<string, number> = {};
    const countries: string[] = [];

    Object.entries(countByCountry).forEach(([country, count]) => {
      const coords = COUNTRY_COORDS[country];
      if (coords) locations.push({ lat: coords.lat, lon: coords.lon, name: country, prayers: count });
      const region = COUNTRY_REGION[country];
      if (region) regions[region] = (regions[region] || 0) + count;
      if (!countries.includes(country)) countries.push(country);
    });

    setPrayerLocations(locations);
    setCountByRegion(regions);
    setActiveCountries(countries);
  };

  useEffect(() => {
    fetchPrayers();
    const channel = supabase
      .channel('globe-prayers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prayers' }, (payload) => {
        const country = (payload.new as any)?.country?.trim();
        if (country) {
          const coords = COUNTRY_COORDS[country];
          if (coords) setNewRipples([{ id: `ripple-${Date.now()}`, lat: coords.lat, lon: coords.lon }]);
        }
        fetchPrayers();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'prayers' }, () => fetchPrayers())
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'prayers' }, () => fetchPrayers())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const fetchLiveCount = async () => {
      const { data } = await supabase.from('live_stats').select('prayers_count').eq('id', 1).single();
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

  // Build full list of country names for ticker (all from COUNTRY_COORDS keys, deduplicated display names)
  const allWorldCountries = Array.from(new Set(Object.keys(COUNTRY_COORDS).filter(c => 
    !['US', 'Việt Nam', 'Korea'].includes(c) // remove duplicates
  )));

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-serif text-primary mb-2">{t('section.map.title')}</h2>
          <p className="text-muted-foreground text-base text-balance">
            Cập nhật theo thời gian thực • <strong className="text-primary">{activeCountries.length}</strong> quốc gia đang hiệp cầu
          </p>
        </div>

        {/* Globe */}
        <div
          className="relative h-[320px] sm:h-[420px] lg:h-[520px] rounded-2xl overflow-hidden border border-primary/20"
          style={{ background: 'linear-gradient(180deg, #0a1628 0%, #1a3460 50%, #0f2240 100%)' }}
        >
          <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">Loading globe...</div>}>
            <WorldMapGlobe2D prayerLocations={prayerLocations} newRipples={newRipples} />
          </Suspense>

          {/* Legend */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-[rgba(4,14,30,0.85)] p-2.5 rounded-lg border border-primary/20 backdrop-blur-lg z-10">
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_hsl(38,47%,56%)]" /> {t('section.map.legend.prayers')}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7] shadow-[0_0_6px_#6ee7b7]" /> {t('section.map.legend.active')}
            </div>
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-[#60a5fa] shadow-[0_0_6px_#60a5fa]" /> {t('section.map.legend.new')}
            </div>
          </div>

          {/* Live counter */}
          <div className="absolute bottom-4 left-4 bg-[rgba(4,14,30,0.9)] px-4 py-2.5 rounded-lg border border-primary/25 text-[0.85rem] text-muted-foreground backdrop-blur-lg z-10">
            🙏 <strong className="text-primary tabular-nums inline-block">
              {liveCount > 0 ? <AnimatedCounter value={liveCount} /> : '—'}
            </strong> {t('section.map.live')}
          </div>
        </div>

        {/* Region Heatmap Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          {REGIONS.map(({ key, icon, label }) => {
            const count = countByRegion[key] || 0;
            return (
              <div
                key={key}
                className="rounded-xl border border-border/50 backdrop-blur-lg p-4 flex flex-col items-center gap-1 transition-all hover:border-primary/40 hover:shadow-[0_0_20px_hsl(38,47%,56%,0.1)]"
                style={{ background: 'rgba(10,22,40,0.8)' }}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  <strong className="text-primary">{count.toLocaleString()}</strong> prayers
                </span>
              </div>
            );
          })}
        </div>

        {/* Scrolling Country Ticker */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border/30 py-3" style={{ background: 'rgba(10,22,40,0.6)' }}>
          <div className="ticker-container">
            <div
              className="ticker-content flex gap-6 whitespace-nowrap text-xs text-muted-foreground/70"
              style={{ animation: 'ticker 60s linear infinite', width: 'max-content' }}
            >
              {[...allWorldCountries, ...allWorldCountries].map((country, i) => (
                <span key={`${country}-${i}`} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMapSection;
