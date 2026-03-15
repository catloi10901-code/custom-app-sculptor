import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const avatarEmojis = ['🙏', '🌸', '💛', '🌺', '✝️', '🌍', '💜', '🕊️', '⭐', '🌟'];

const topicColorMap: Record<string, { gradient: string; badge: string; badgeText: string; avatarBorder: string; glow: string; emoji: string }> = {
  peace:      { gradient: 'from-blue-400 via-blue-500 to-cyan-400',      badge: 'bg-blue-400/15 border-blue-400/30',    badgeText: 'text-blue-400',    avatarBorder: 'border-blue-400/60',    glow: 'rgba(96,165,250,0.15)',  emoji: '🕊️' },
  prosperity: { gradient: 'from-amber-400 via-yellow-500 to-orange-400', badge: 'bg-amber-400/15 border-amber-400/30',  badgeText: 'text-amber-400',   avatarBorder: 'border-amber-400/60',   glow: 'rgba(251,191,36,0.15)',  emoji: '⭐' },
  healing:    { gradient: 'from-emerald-400 via-green-500 to-teal-400',  badge: 'bg-emerald-400/15 border-emerald-400/30', badgeText: 'text-emerald-400', avatarBorder: 'border-emerald-400/60', glow: 'rgba(52,211,153,0.15)', emoji: '💚' },
  family:     { gradient: 'from-pink-400 via-rose-500 to-fuchsia-400',   badge: 'bg-pink-400/15 border-pink-400/30',    badgeText: 'text-pink-400',    avatarBorder: 'border-pink-400/60',    glow: 'rgba(244,114,182,0.15)', emoji: '👨‍👩‍👧' },
  nation:     { gradient: 'from-purple-400 via-violet-500 to-indigo-400', badge: 'bg-purple-400/15 border-purple-400/30', badgeText: 'text-purple-400',  avatarBorder: 'border-purple-400/60',  glow: 'rgba(192,132,252,0.15)', emoji: '🏛️' },
  poverty:    { gradient: 'from-orange-400 via-amber-500 to-yellow-400', badge: 'bg-orange-400/15 border-orange-400/30', badgeText: 'text-orange-400',  avatarBorder: 'border-orange-400/60',  glow: 'rgba(251,146,60,0.15)',  emoji: '🌿' },
  recovery:   { gradient: 'from-cyan-400 via-teal-500 to-blue-400',     badge: 'bg-cyan-400/15 border-cyan-400/30',    badgeText: 'text-cyan-400',    avatarBorder: 'border-cyan-400/60',    glow: 'rgba(34,211,238,0.15)',  emoji: '🔄' },
};

const defaultColors = { gradient: 'from-primary via-primary to-accent', badge: 'bg-primary/10 border-primary/20', badgeText: 'text-primary', avatarBorder: 'border-primary', glow: 'rgba(197,160,89,0.15)', emoji: '🙏' };

interface PrayerCardProps {
  prayer: {
    id: string;
    name: string;
    country: string | null;
    topic: string;
    content: string;
    amen_count: number;
    created_at: string;
  };
  index: number;
  hasAmened: boolean;
  onToggleAmen: (id: string) => void;
  isRealtime?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PrayerCard = ({ prayer, index, hasAmened, onToggleAmen, isRealtime, onMouseEnter, onMouseLeave }: PrayerCardProps) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const colors = topicColorMap[prayer.topic] || defaultColors;

  const handleAmen = (id: string) => {
    setIsAnimating(true);
    onToggleAmen(id);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const topicLabels: Record<string, string> = {
    peace: t('topic.peace'),
    prosperity: t('topic.prosperity'),
    poverty: t('topic.poverty'),
    healing: t('topic.healing'),
    family: t('topic.family'),
    nation: t('topic.nation'),
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('prayerWall.justNow');
    if (mins < 60) return t('prayerWall.minutesAgo', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('prayerWall.hoursAgo', { count: hrs });
    return t('prayerWall.daysAgo', { count: Math.floor(hrs / 24) });
  };

  const animationStyle = isRealtime
    ? { animation: 'realtimeGlow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both' }
    : {
        animation: index < 6 ? `slideDownFade 0.4s ease-out ${index * 0.05}s both` : 'none',
        opacity: index >= 6 ? 1 : undefined,
      };

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300 group h-full flex flex-col"
      style={{
        ...animationStyle,
        boxShadow: `0 4px 24px -4px ${colors.glow}`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Top gradient border */}
      <div className={`h-1 w-full bg-gradient-to-r ${colors.gradient} transition-all duration-300 group-hover:h-1.5`} />

      <div className="bg-card border border-t-0 border-border rounded-b-2xl p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-full bg-card border-[2px] ${colors.avatarBorder} flex items-center justify-center text-lg flex-shrink-0`}>
            {avatarEmojis[index % avatarEmojis.length]}
          </div>
          <div className="flex-1 min-w-0">
            <strong className="block text-[0.9rem]">{prayer.name}</strong>
            <span className="text-[0.78rem] text-muted-foreground">{timeAgo(prayer.created_at)}</span>
          </div>
          {prayer.country && <span className="text-[0.78rem] text-primary bg-gold-dim px-2 py-0.5 rounded-full">{prayer.country}</span>}
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.75rem] font-bold ${colors.badge} ${colors.badgeText} border mb-3`}>
          <span>{colors.emoji}</span>
          {topicLabels[prayer.topic] || prayer.topic}
        </span>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-4 flex-1">{prayer.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[0.88rem] text-muted-foreground">
            🙏 <span className="text-primary font-bold">{prayer.amen_count}</span> {t('prayerWall.amenLabel')}
          </div>
          <div className="relative">
            {/* Sparkle particles */}
            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute text-[0.6rem] animate-amen-sparkle"
                    style={{
                      left: '50%',
                      top: '50%',
                      '--sparkle-x': `${Math.cos((i * 60) * Math.PI / 180) * 28}px`,
                      '--sparkle-y': `${Math.sin((i * 60) * Math.PI / 180) * 28}px`,
                      animationDelay: `${i * 0.05}s`,
                    } as React.CSSProperties}
                  >
                    ✨
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => handleAmen(prayer.id)}
              className={`px-3.5 py-1.5 rounded-md text-[0.82rem] font-bold cursor-pointer transition-all duration-300 ${
                isAnimating ? 'animate-amen-bounce' : ''
              } ${
                hasAmened
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gold-dim border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {hasAmened ? t('prayerWall.amened') : t('prayerWall.amen')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;
