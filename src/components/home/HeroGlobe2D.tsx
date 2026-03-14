import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Globe2DRenderer, {
  GLOBE_VIEWBOX,
  GLOBE_CX,
  GLOBE_CY,
  GLOBE_KEYFRAMES,
  COUNTRY_POSITIONS,
  DEFAULT_POSITIONS,
  WORLD_WIDTH,
  getTranslateOffset,
} from './Globe2DRenderer';

interface PrayerPoint {
  id: string;
  country: string | null;
  name: string;
  isNew?: boolean;
}

const getPosition = (country: string | null, index: number) => {
  if (country && COUNTRY_POSITIONS[country]) return COUNTRY_POSITIONS[country];
  return DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];
};

const HeroGlobe2D = () => {
  const [prayerPoints, setPrayerPoints] = useState<PrayerPoint[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ point: PrayerPoint; screenX: number; screenY: number } | null>(null);

  // Auto-rotation
  const [rotation, setRotation] = useState(0);
  const animRef = useRef<number | null>(null);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastTime.current) / 1000;
      lastTime.current = now;
      setRotation(prev => prev + delta * 6);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const fetchPrayers = useCallback(async () => {
    const { data } = await supabase
      .from('prayers')
      .select('id, country, name')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setPrayerPoints(data.map(p => ({ ...p, isNew: false })));
    }
  }, []);

  useEffect(() => {
    fetchPrayers();

    const channel = supabase
      .channel('hero-globe-prayers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prayers' },
        (payload) => {
          const newPrayer = payload.new as { id: string; country: string | null; name: string; is_approved: boolean };
          if (!newPrayer.is_approved) return;

          setPrayerPoints(prev => {
            const updated = [{ id: newPrayer.id, country: newPrayer.country, name: newPrayer.name, isNew: true }, ...prev].slice(0, 25);
            return updated;
          });

          setTimeout(() => {
            setPrayerPoints(prev => prev.map(p => p.id === newPrayer.id ? { ...p, isNew: false } : p));
          }, 3000);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPrayers]);

  const handleHover = useCallback((point: PrayerPoint, svgX: number, svgY: number) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / GLOBE_VIEWBOX;
    const scaleY = svgRect.height / GLOBE_VIEWBOX;
    setTooltip({ point, screenX: svgX * scaleX, screenY: svgY * scaleY });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const cx = GLOBE_CX;
  const cy = GLOBE_CY;
  const offset = getTranslateOffset(rotation);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{GLOBE_KEYFRAMES}</style>

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, hsla(210, 80%, 65%, 0.35) 0%, hsla(210, 70%, 55%, 0.15) 50%, transparent 70%)',
          animation: 'breatheGlow 4s ease-in-out infinite',
        }}
      />

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${GLOBE_VIEWBOX} ${GLOBE_VIEWBOX}`}
          className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] relative z-10"
          style={{ animation: 'floatGlobe 6s ease-in-out infinite' }}
        >
          <Globe2DRenderer idPrefix="hero" rotation={rotation}>
            {/* Prayer dots — tiled horizontally with continents */}
            {[-WORLD_WIDTH, 0, WORLD_WIDTH].map((tileOffset) => (
              <g key={tileOffset} transform={`translate(${offset + tileOffset}, 0)`}>
                {prayerPoints.map((point, i) => {
                  const pos = getPosition(point.country, i);
                  const x = cx + pos.x;
                  const y = cy + pos.y;
                  return (
                    <g key={point.id}>
                      {point.isNew && (
                        <circle cx={x} cy={y} r={5} fill="none" stroke="hsl(45, 100%, 70%)" strokeWidth={2} className="animate-[newPrayerBurst_1.5s_ease-out_forwards]" style={{ transformOrigin: `${x}px ${y}px` }} />
                      )}
                      <circle cx={x} cy={y} r={6} fill="none" stroke="hsl(var(--primary))" strokeWidth={1} opacity={0.4} className="animate-[prayerRing_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${x}px ${y}px` }} />
                      <circle cx={x} cy={y} r={point.isNew ? 4 : 3} fill={point.isNew ? 'hsl(45, 100%, 70%)' : 'hsl(var(--primary))'} className="animate-[prayerPulse_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.3}s` }} />
                      <circle
                        cx={x} cy={y} r={15} fill="transparent" className="cursor-pointer"
                        onMouseEnter={() => handleHover(point, x + offset + tileOffset, y)}
                        onMouseLeave={handleLeave}
                      />
                    </g>
                  );
                })}
              </g>
            ))}
          </Globe2DRenderer>
        </svg>

        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none px-3 py-2 rounded-lg border border-primary/30 bg-card/95 backdrop-blur-sm shadow-xl"
            style={{
              left: `${tooltip.screenX}px`,
              top: `${tooltip.screenY - 50}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-[0.78rem] font-semibold text-primary whitespace-nowrap">
              🙏 {tooltip.point.name}
            </div>
            {tooltip.point.country && (
              <div className="text-[0.7rem] text-muted-foreground whitespace-nowrap">
                📍 {tooltip.point.country}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroGlobe2D;
