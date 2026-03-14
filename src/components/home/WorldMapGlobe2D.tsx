import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Globe2DRenderer, {
  GLOBE_VIEWBOX,
  GLOBE_CX,
  GLOBE_CY,
  GLOBE_KEYFRAMES,
  WORLD_WIDTH,
  getCountryPosition,
  getTranslateOffset,
} from './Globe2DRenderer';

export interface PrayerLocation {
  lat: number;
  lon: number;
  name: string;
  prayers: number;
}

export interface RippleEvent {
  id: string;
  lat: number;
  lon: number;
}

interface WorldMapGlobe2DProps {
  prayerLocations: PrayerLocation[];
  newRipples: RippleEvent[];
}

const WorldMapGlobe2D = ({ prayerLocations, newRipples }: WorldMapGlobe2DProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ name: string; prayers: number; screenX: number; screenY: number } | null>(null);

  // Drag-to-rotate state
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const rotationAtDragStart = useRef(0);
  const autoRotateRef = useRef<number | null>(null);
  const lastAutoTime = useRef(Date.now());
  const velocityRef = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);

  // Animation loop: handles auto-rotate + inertia
  const animate = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastAutoTime.current) / 1000;
    lastAutoTime.current = now;

    if (!isDragging) {
      if (Math.abs(velocityRef.current) > 0.5) {
        velocityRef.current *= 0.99;
        setRotation(prev => prev + velocityRef.current * delta);
      } else {
        velocityRef.current = 0;
        setRotation(prev => prev + delta * 6);
      }
    }

    autoRotateRef.current = requestAnimationFrame(animate);
  }, [isDragging]);

  useEffect(() => {
    lastAutoTime.current = Date.now();
    autoRotateRef.current = requestAnimationFrame(animate);
    return () => { if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current); };
  }, [animate]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    rotationAtDragStart.current = rotation;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = Date.now();
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [rotation]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const now = Date.now();
    const dt = (now - lastPointerTime.current) / 1000;
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastPointerX.current) * 0.5 / dt;
    }
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
    const dx = e.clientX - dragStartX.current;
    setRotation(rotationAtDragStart.current + dx * 0.5);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    velocityRef.current = Math.max(-360, Math.min(360, velocityRef.current));
    setIsDragging(false);
  }, [isDragging]);

  const cx = GLOBE_CX;
  const cy = GLOBE_CY;
  const offset = getTranslateOffset(rotation);

  const handleHover = useCallback((name: string, prayers: number, svgX: number, svgY: number) => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = svgRect.width / GLOBE_VIEWBOX;
    const scaleY = svgRect.height / GLOBE_VIEWBOX;
    setTooltip({ name, prayers, screenX: svgX * scaleX, screenY: svgY * scaleY });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const rippleSet = useMemo(() => {
    const set = new Set<string>();
    newRipples.forEach(r => {
      prayerLocations.forEach(loc => {
        if (Math.abs(loc.lat - r.lat) < 1 && Math.abs(loc.lon - r.lon) < 1) {
          set.add(loc.name);
        }
      });
    });
    return set;
  }, [newRipples, prayerLocations]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{GLOBE_KEYFRAMES}</style>

      {/* Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, hsla(210, 80%, 65%, 0.3) 0%, hsla(210, 70%, 55%, 0.1) 50%, transparent 70%)',
          animation: 'breatheGlow 4s ease-in-out infinite',
        }}
      />

      <div
        className="relative select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${GLOBE_VIEWBOX} ${GLOBE_VIEWBOX}`}
          className="w-full h-full max-w-[500px] max-h-[500px] relative z-10"
        >
          <Globe2DRenderer idPrefix="wm" rotation={rotation}>
            {/* Prayer location dots — tiled horizontally */}
            {[-WORLD_WIDTH, 0, WORLD_WIDTH].map((tileOffset) => (
              <g key={tileOffset} transform={`translate(${offset + tileOffset}, 0)`}>
                {prayerLocations.map((loc, i) => {
                  const pos = getCountryPosition(loc.name, i);
                  const x = cx + pos.x;
                  const y = cy + pos.y;
                  const isRippling = rippleSet.has(loc.name);
                  const dotSize = Math.min(2 + Math.sqrt(loc.prayers) * 1.2, 8);

                  return (
                    <g key={loc.name}>
                      {isRippling && (
                        <circle
                          cx={x} cy={y} r={5}
                          fill="none" stroke="hsl(200, 90%, 70%)" strokeWidth={2}
                          className="animate-[rippleBurst_1.5s_ease-out_forwards]"
                          style={{ transformOrigin: `${x}px ${y}px` }}
                        />
                      )}
                      <circle
                        cx={x} cy={y} r={dotSize + 3}
                        fill="none" stroke="hsl(45, 90%, 70%)" strokeWidth={1} opacity={0.4}
                        className="animate-[prayerRing_2.5s_ease-in-out_infinite]"
                        style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${x}px ${y}px` }}
                      />
                      <circle
                        cx={x} cy={y} r={dotSize}
                        fill="hsl(45, 90%, 70%)"
                        className="animate-[prayerPulse_2s_ease-in-out_infinite]"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                      <circle cx={x} cy={y} r={dotSize + 1} fill="hsl(45, 90%, 70%)" opacity={0.3} />
                      <circle
                        cx={x} cy={y} r={15} fill="transparent" className="cursor-pointer"
                        onMouseEnter={() => handleHover(loc.name, loc.prayers, x + offset + tileOffset, y)}
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
            <div className="text-[0.8rem] font-semibold text-primary whitespace-nowrap">
              📍 {tooltip.name}
            </div>
            <div className="text-[0.72rem] text-muted-foreground whitespace-nowrap">
              🙏 {tooltip.prayers} prayers
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldMapGlobe2D;
