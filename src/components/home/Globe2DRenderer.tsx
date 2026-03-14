import { useMemo, ReactNode } from 'react';

// Shared constants
export const GLOBE_VIEWBOX = 500;
export const GLOBE_CX = 250;
export const GLOBE_CY = 250;
export const GLOBE_R = 150;
export const WORLD_WIDTH = GLOBE_R * 2; // 300 — one full "wrap" of content

// Country → position on globe as x,y offset from center (250,250)
// Derived from actual continent SVG path coordinates. Max distance < 150 (globe radius).
export const COUNTRY_POSITIONS: Record<string, { x: number; y: number }> = {
  // ── North America ──
  'USA': { x: -85, y: -82 },
  'US': { x: -85, y: -82 },
  'United States': { x: -85, y: -82 },
  'Canada': { x: -95, y: -100 },
  'Mexico': { x: -90, y: -28 },

  // ── Central & South America ──
  'Colombia': { x: -72, y: -12 },
  'Peru': { x: -82, y: 28 },
  'Brazil': { x: -48, y: 10 },
  'Argentina': { x: -66, y: 78 },
  'Chile': { x: -72, y: 72 },

  // ── Europe ──
  'UK': { x: -2, y: -84 },
  'United Kingdom': { x: -2, y: -84 },
  'Ireland': { x: -8, y: -83 },
  'Scotland': { x: -4, y: -86 },
  'France': { x: 10, y: -72 },
  'Germany': { x: 16, y: -76 },
  'Spain': { x: -3, y: -62 },
  'Portugal': { x: -8, y: -60 },
  'Italy': { x: 11, y: -58 },
  'Netherlands': { x: 8, y: -78 },
  'Belgium': { x: 4, y: -74 },
  'Switzerland': { x: 10, y: -72 },
  'Austria': { x: 20, y: -76 },
  'Poland': { x: 30, y: -84 },
  'Czech Republic': { x: 26, y: -80 },
  'Hungary': { x: 28, y: -76 },
  'Romania': { x: 32, y: -82 },
  'Greece': { x: 26, y: -70 },
  'Ukraine': { x: 34, y: -86 },
  'Sweden': { x: 16, y: -95 },
  'Norway': { x: 14, y: -100 },
  'Denmark': { x: 10, y: -86 },
  'Finland': { x: 18, y: -102 },

  // ── Africa ──
  'Morocco': { x: -5, y: -45 },
  'Algeria': { x: 2, y: -47 },
  'Egypt': { x: 25, y: -42 },
  'Nigeria': { x: 5, y: -8 },
  'Ghana': { x: -2, y: -12 },
  'Ethiopia': { x: 42, y: -17 },
  'Kenya': { x: 36, y: 2 },
  'Tanzania': { x: 34, y: 12 },
  'Uganda': { x: 32, y: -2 },
  'DR Congo': { x: 18, y: 8 },
  'South Africa': { x: 18, y: 42 },

  // ── Middle East ──
  'Turkey': { x: 40, y: -62 },
  'Israel': { x: 34, y: -40 },
  'Saudi Arabia': { x: 46, y: -25 },
  'UAE': { x: 50, y: -22 },
  'Iraq': { x: 42, y: -44 },
  'Iran': { x: 48, y: -42 },

  // ── South / Central Asia ──
  'Pakistan': { x: 62, y: -52 },
  'India': { x: 68, y: -35 },
  'Bangladesh': { x: 76, y: -42 },

  // ── East Asia ──
  'China': { x: 100, y: -60 },
  'Russia': { x: 90, y: -93 },
  'South Korea': { x: 112, y: -64 },
  'Korea': { x: 112, y: -64 },
  'Japan': { x: 122, y: -65 },
  'Taiwan': { x: 117, y: -48 },

  // ── Southeast Asia ──
  'Vietnam': { x: 96, y: -30 },
  'Việt Nam': { x: 96, y: -30 },
  'Thailand': { x: 98, y: -28 },
  'Myanmar': { x: 92, y: -32 },
  'Cambodia': { x: 98, y: -22 },
  'Malaysia': { x: 95, y: -6 },
  'Singapore': { x: 94, y: -2 },
  'Philippines': { x: 117, y: -30 },
  'Indonesia': { x: 105, y: 5 },

  // ── Oceania ──
  'Australia': { x: 122, y: 45 },
  'New Zealand': { x: 130, y: 55 },
};

export const DEFAULT_POSITIONS = [
  { x: -60, y: -40 },
  { x: 80, y: 20 },
  { x: -30, y: 60 },
  { x: 110, y: -50 },
  { x: 40, y: 30 },
  { x: -90, y: -20 },
];

export const getCountryPosition = (name: string, index: number) => {
  if (COUNTRY_POSITIONS[name]) return COUNTRY_POSITIONS[name];
  return DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length];
};

/** Calculate the horizontal pixel offset from a rotation angle */
export const getTranslateOffset = (rotation: number): number => {
  const normalizedRot = ((rotation % 360) + 360) % 360;
  return -(normalizedRot / 360) * WORLD_WIDTH;
};

const Stars = () => {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      cx: Math.random() * GLOBE_VIEWBOX,
      cy: Math.random() * GLOBE_VIEWBOX,
      r: Math.random() * 1.2 + 0.3,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2,
    })), []
  );

  return (
    <g>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="white"
          className="animate-[twinkle_ease-in-out_infinite_alternate]"
          style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </g>
  );
};

const ContinentPaths = () => (
  <g>
    {/* ===== NORTH AMERICA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path
        d={`
          M113,137 L120,133 L130,130 L140,128 L148,130 L155,133
          L165,137 L175,140 L185,145 L192,150 L196,155
          L198,162 L196,168 L192,175 L188,180 L183,186
          L178,192 L175,198 L170,203 L165,207 L160,210
          L155,213 L150,215 L147,213 L145,208 L143,203
          L140,200 L137,198 L134,195 L130,192 L127,188
          L124,183 L120,178 L117,172 L114,165 L112,158
          L111,150 L112,143 L113,137Z
        `}
        fill="hsl(145, 65%, 48%)" stroke="hsl(145, 50%, 35%)" strokeWidth={0.8} opacity={0.9}
      />
      <path
        d="M108,142 L103,138 L98,140 L100,145 L105,148 L110,147 L112,143Z"
        fill="hsl(145, 65%, 48%)" stroke="hsl(145, 50%, 35%)" strokeWidth={0.6} opacity={0.85}
      />
      <path
        d="M183,186 L186,192 L188,200 L186,206 L183,208 L180,204 L178,198 L178,192Z"
        fill="hsl(145, 65%, 48%)" stroke="hsl(145, 50%, 35%)" strokeWidth={0.6} opacity={0.85}
      />
    </g>

    {/* ===== CENTRAL AMERICA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path
        d="M155,213 L158,218 L162,222 L165,226 L168,230 L170,234
          L168,237 L165,235 L162,232 L158,228 L155,224 L153,220 L153,216 L155,213Z"
        fill="hsl(140, 60%, 45%)" stroke="hsl(140, 50%, 32%)" strokeWidth={0.7} opacity={0.88}
      />
    </g>

    {/* ===== SOUTH AMERICA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path
        d={`
          M170,234 L175,232 L182,233 L190,236 L198,240 L205,244
          L210,250 L214,258 L216,266 L215,275 L212,283
          L208,290 L204,297 L200,303 L196,310 L192,316
          L188,322 L185,328 L183,334 L182,340 L180,344
          L178,340 L176,334 L175,328 L174,322 L172,316
          L170,310 L168,303 L167,296 L166,288 L166,280
          L167,272 L168,264 L168,256 L168,248 L168,240
          L170,234Z
        `}
        fill="hsl(140, 60%, 45%)" stroke="hsl(140, 50%, 32%)" strokeWidth={0.8} opacity={0.9}
      />
    </g>

    {/* ===== EUROPE ===== */}
    <g className="continent-hover" cursor="pointer">
      <path d="M240,188 L244,184 L248,182 L252,183 L254,187 L252,192 L248,194 L244,193 L240,190Z"
        fill="hsl(150, 55%, 50%)" stroke="hsl(150, 45%, 38%)" strokeWidth={0.6} opacity={0.88} />
      <path d="M248,178 L254,174 L260,170 L266,168 L272,167 L276,170 L278,175 L276,180 L272,183 L266,185 L260,184 L254,183 L250,182 L248,178Z"
        fill="hsl(150, 55%, 50%)" stroke="hsl(150, 45%, 38%)" strokeWidth={0.7} opacity={0.88} />
      <path d="M260,184 L262,188 L264,193 L263,198 L260,196 L258,192 L258,187 L260,184Z"
        fill="hsl(150, 55%, 50%)" stroke="hsl(150, 45%, 38%)" strokeWidth={0.5} opacity={0.85} />
      <path d="M258,162 L262,155 L264,148 L266,142 L268,138 L270,142 L270,150 L268,158 L266,164 L262,168 L258,166Z"
        fill="hsl(148, 55%, 52%)" stroke="hsl(148, 45%, 40%)" strokeWidth={0.6} opacity={0.85} />
      <path d="M272,167 L278,163 L284,160 L288,163 L286,168 L282,172 L278,175 L274,173 L272,170Z"
        fill="hsl(150, 55%, 50%)" stroke="hsl(150, 45%, 38%)" strokeWidth={0.6} opacity={0.85} />
      <path d="M244,168 L247,164 L249,160 L251,164 L249,169 L246,172 L244,170Z"
        fill="hsl(148, 55%, 52%)" stroke="hsl(148, 45%, 40%)" strokeWidth={0.5} opacity={0.82} />
      <path d="M240,166 L243,163 L244,166 L243,170 L240,169Z"
        fill="hsl(148, 55%, 52%)" stroke="hsl(148, 45%, 40%)" strokeWidth={0.4} opacity={0.8} />
      <path d="M235,148 L239,146 L242,148 L240,151 L236,151Z"
        fill="hsl(148, 55%, 52%)" stroke="hsl(148, 45%, 40%)" strokeWidth={0.4} opacity={0.78} />
    </g>

    {/* ===== AFRICA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path
        d={`
          M242,200 L250,197 L258,198 L266,200 L274,203 L280,208
          L284,215 L288,222 L290,230 L291,238 L290,247
          L288,255 L286,263 L283,270 L280,278 L276,285
          L272,290 L268,295 L264,298 L260,300 L256,298
          L253,293 L250,286 L248,278 L247,270 L246,262
          L244,254 L243,246 L242,238 L241,228 L240,218
          L240,210 L241,204 L242,200Z
        `}
        fill="hsl(135, 60%, 42%)" stroke="hsl(135, 50%, 30%)" strokeWidth={0.8} opacity={0.9} />
      <path d="M290,230 L295,228 L300,232 L298,237 L294,240 L290,238Z"
        fill="hsl(135, 60%, 42%)" stroke="hsl(135, 50%, 30%)" strokeWidth={0.5} opacity={0.85} />
      <path d="M296,278 L299,274 L302,278 L303,286 L301,292 L298,290 L296,284Z"
        fill="hsl(138, 58%, 44%)" stroke="hsl(138, 48%, 32%)" strokeWidth={0.5} opacity={0.85} />
    </g>

    {/* ===== ASIA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path d={`M288,160 L296,155 L306,150 L318,145 L330,140 L342,137 L354,135 L366,137 L376,140 L384,145 L388,152 L390,160 L388,168 L384,175 L378,180 L370,183 L362,185 L354,183 L346,180 L338,178 L330,175 L322,172 L314,170 L306,168 L298,166 L292,163 L288,160Z`}
        fill="hsl(142, 58%, 46%)" stroke="hsl(142, 48%, 34%)" strokeWidth={0.8} opacity={0.9} />
      <path d="M280,208 L286,203 L292,200 L298,202 L302,208 L300,215 L296,220 L290,222 L284,218 L280,212Z"
        fill="hsl(142, 58%, 46%)" stroke="hsl(142, 48%, 34%)" strokeWidth={0.6} opacity={0.88} />
      <path d="M286,215 L292,213 L298,215 L304,220 L306,228 L302,234 L296,236 L290,233 L286,226 L285,220Z"
        fill="hsl(142, 58%, 46%)" stroke="hsl(142, 48%, 34%)" strokeWidth={0.6} opacity={0.87} />
      <path d={`M310,195 L318,190 L326,192 L330,198 L332,206 L330,215 L326,224 L320,232 L314,238 L310,234 L308,226 L306,218 L307,210 L308,202 L310,195Z`}
        fill="hsl(140, 56%, 44%)" stroke="hsl(140, 46%, 32%)" strokeWidth={0.7} opacity={0.9} />
      <path d="M320,240 L323,238 L324,242 L322,245 L319,243Z"
        fill="hsl(140, 56%, 44%)" stroke="hsl(140, 46%, 32%)" strokeWidth={0.3} opacity={0.8} />
      <path d={`M330,175 L340,172 L350,170 L358,172 L365,176 L370,183 L372,190 L370,198 L366,204 L360,208 L352,210 L344,208 L338,204 L334,198 L330,192 L328,185 L330,175Z`}
        fill="hsl(142, 58%, 46%)" stroke="hsl(142, 48%, 34%)" strokeWidth={0.7} opacity={0.88} />
      <path d="M340,210 L346,208 L352,212 L356,218 L358,226 L355,232 L350,235 L344,233 L340,228 L338,220 L338,214Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.6} opacity={0.85} />
      <path d="M344,235 L347,238 L348,244 L346,250 L343,248 L342,242 L343,238Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.4} opacity={0.82} />
      <path d="M360,182 L363,179 L365,183 L364,189 L361,192 L358,188 L359,184Z"
        fill="hsl(146, 55%, 50%)" stroke="hsl(146, 45%, 38%)" strokeWidth={0.4} opacity={0.83} />
      <path d="M368,178 L371,174 L374,178 L376,184 L375,190 L372,194 L369,190 L367,185 L368,178Z"
        fill="hsl(146, 55%, 50%)" stroke="hsl(146, 45%, 38%)" strokeWidth={0.5} opacity={0.85} />
      <path d="M365,200 L367,198 L369,201 L368,205 L365,204Z"
        fill="hsl(146, 55%, 50%)" stroke="hsl(146, 45%, 38%)" strokeWidth={0.3} opacity={0.8} />
      <path d="M364,215 L367,212 L369,216 L370,222 L368,226 L365,224 L363,220Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.4} opacity={0.82} />
      <path d="M336,252 L340,248 L344,252 L346,258 L343,262 L339,260 L336,256Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.4} opacity={0.82} />
      <path d="M348,262 L354,260 L360,262 L364,264 L362,268 L356,268 L350,266 L348,264Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.4} opacity={0.82} />
      <path d="M352,238 L358,235 L363,238 L364,244 L360,248 L355,248 L351,244Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.5} opacity={0.83} />
      <path d="M366,244 L369,241 L372,244 L371,250 L368,252 L365,249Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.4} opacity={0.8} />
      <path d="M378,244 L384,240 L390,242 L392,248 L388,252 L382,252 L378,248Z"
        fill="hsl(144, 55%, 48%)" stroke="hsl(144, 45%, 36%)" strokeWidth={0.5} opacity={0.83} />
    </g>

    {/* ===== AUSTRALIA ===== */}
    <g className="continent-hover" cursor="pointer">
      <path d={`M352,280 L360,275 L370,272 L380,273 L388,276 L394,282 L396,290 L394,300 L390,308 L384,314 L376,318 L368,318 L360,315 L354,310 L350,303 L348,295 L349,287 L352,280Z`}
        fill="hsl(38, 65%, 55%)" stroke="hsl(38, 55%, 42%)" strokeWidth={0.8} opacity={0.9} />
      <path d="M386,322 L390,320 L392,324 L390,328 L386,326Z"
        fill="hsl(38, 65%, 55%)" stroke="hsl(38, 55%, 42%)" strokeWidth={0.4} opacity={0.82} />
      <path d="M400,310 L403,306 L405,310 L404,316 L402,320 L400,316Z"
        fill="hsl(145, 60%, 48%)" stroke="hsl(145, 50%, 36%)" strokeWidth={0.4} opacity={0.82} />
    </g>

    {/* ===== GREENLAND ===== */}
    <g className="continent-hover" cursor="pointer">
      <path d="M195,120 L205,115 L215,118 L218,125 L215,132 L208,135 L200,132 L195,127Z"
        fill="hsl(150, 40%, 60%)" stroke="hsl(150, 35%, 48%)" strokeWidth={0.6} opacity={0.8} />
    </g>
  </g>
);

/** Tiled continents: renders 3 copies offset by WORLD_WIDTH for seamless wrapping */
const TiledContinents = ({ offset }: { offset: number }) => (
  <g>
    {[-WORLD_WIDTH, 0, WORLD_WIDTH].map((tileOffset) => (
      <g key={tileOffset} transform={`translate(${offset + tileOffset}, 0)`}>
        <ContinentPaths />
      </g>
    ))}
  </g>
);

const CloudLayer = ({ offset }: { offset: number }) => {
  // Clouds drift slightly faster than continents
  const cloudOffset = offset * 1.15;
  return (
    <g>
      {[-WORLD_WIDTH, 0, WORLD_WIDTH].map((tileOffset) => (
        <g key={tileOffset} transform={`translate(${cloudOffset + tileOffset}, 0)`}>
          <ellipse cx={200} cy={165} rx={44} ry={10} fill="white" opacity={0.25} />
          <ellipse cx={313} cy={213} rx={35} ry={8} fill="white" opacity={0.2} />
          <ellipse cx={225} cy={300} rx={40} ry={9} fill="white" opacity={0.22} />
        </g>
      ))}
    </g>
  );
};

const AnimeHighlight = () => (
  <g>
    <ellipse cx={200} cy={175} rx={31} ry={15} fill="white" opacity={0.35} transform="rotate(-30 200 175)" />
    <ellipse cx={185} cy={194} rx={10} ry={6} fill="white" opacity={0.25} transform="rotate(-30 185 194)" />
  </g>
);

export const GLOBE_KEYFRAMES = `
  @keyframes twinkle {
    0% { opacity: 0.2; }
    100% { opacity: 1; }
  }
  @keyframes prayerPulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes prayerRing {
    0% { opacity: 0.5; transform: scale(1); }
    100% { opacity: 0; transform: scale(2.5); }
  }
  @keyframes rippleBurst {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(3); }
    100% { opacity: 0; transform: scale(5); }
  }
  @keyframes breatheGlow {
    0%, 100% { filter: blur(25px) brightness(1); }
    50% { filter: blur(30px) brightness(1.15); }
  }
  @keyframes newPrayerBurst {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(3); }
    100% { opacity: 0; transform: scale(5); }
  }
  @keyframes floatGlobe {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .continent-hover {
    transition: filter 0.3s ease, opacity 0.3s ease;
  }
  .continent-hover:hover {
    filter: brightness(1.4) drop-shadow(0 0 6px hsla(45, 100%, 70%, 0.5));
  }
  .continent-hover:hover path {
    opacity: 1 !important;
  }
`;

interface Globe2DRendererProps {
  idPrefix: string;
  rotation?: number;
  children?: ReactNode;
}

const Globe2DRenderer = ({ idPrefix, rotation = 0, children }: Globe2DRendererProps) => {
  const cx = GLOBE_CX;
  const cy = GLOBE_CY;
  const r = GLOBE_R;
  const offset = getTranslateOffset(rotation);

  return (
    <>
      <defs>
        <radialGradient id={`${idPrefix}OceanGrad`} cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="hsl(205, 85%, 60%)" />
          <stop offset="60%" stopColor="hsl(215, 80%, 48%)" />
          <stop offset="100%" stopColor="hsl(225, 75%, 35%)" />
        </radialGradient>
        <radialGradient id={`${idPrefix}AtmoGrad`} cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="transparent" />
          <stop offset="95%" stopColor="hsla(200, 80%, 70%, 0.2)" />
          <stop offset="100%" stopColor="hsla(200, 80%, 75%, 0.08)" />
        </radialGradient>
        <clipPath id={`${idPrefix}GlobeClip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        {/* Horizontal edge darkening for 3D curvature */}
        <linearGradient id={`${idPrefix}EdgeDarken`} x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor="hsl(225, 75%, 15%)" stopOpacity="0.7" />
          <stop offset="18%" stopColor="hsl(225, 75%, 15%)" stopOpacity="0.08" />
          <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          <stop offset="82%" stopColor="hsl(225, 75%, 15%)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="hsl(225, 75%, 15%)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <Stars />

      {/* Ocean */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#${idPrefix}OceanGrad)`} stroke="hsla(210, 60%, 70%, 0.3)" strokeWidth={2} />

      <g clipPath={`url(#${idPrefix}GlobeClip)`}>
        {/* Tiled continents scrolling horizontally */}
        <TiledContinents offset={offset} />
        <CloudLayer offset={offset} />

        {/* Children (prayer dots etc.) rendered inside clip */}
        {children}

        {/* Edge darkening for 3D curvature illusion */}
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={`url(#${idPrefix}EdgeDarken)`} opacity={0.55} />
      </g>

      <AnimeHighlight />
      <circle cx={cx} cy={cy} r={r + 2} fill="none" stroke="hsla(200, 70%, 75%, 0.25)" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r + 5} fill={`url(#${idPrefix}AtmoGrad)`} />
    </>
  );
};

export default Globe2DRenderer;
