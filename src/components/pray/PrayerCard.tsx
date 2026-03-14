import { useTranslation } from 'react-i18next';

const avatarEmojis = ['🙏', '🌸', '💛', '🌺', '✝️', '🌍', '💜', '🕊️', '⭐', '🌟'];

const topicColorMap: Record<string, { border: string; badge: string; badgeText: string; avatarBorder: string; hoverBorder: string; emoji: string }> = {
  peace:      { border: 'border-l-blue-400',    badge: 'bg-blue-400/15 border-blue-400/30',    badgeText: 'text-blue-400',    avatarBorder: 'border-blue-400/60',    hoverBorder: 'hover:border-blue-400/40',    emoji: '🕊️' },
  prosperity: { border: 'border-l-amber-400',   badge: 'bg-amber-400/15 border-amber-400/30',  badgeText: 'text-amber-400',   avatarBorder: 'border-amber-400/60',   hoverBorder: 'hover:border-amber-400/40',   emoji: '⭐' },
  healing:    { border: 'border-l-emerald-400',  badge: 'bg-emerald-400/15 border-emerald-400/30', badgeText: 'text-emerald-400', avatarBorder: 'border-emerald-400/60', hoverBorder: 'hover:border-emerald-400/40', emoji: '💚' },
  family:     { border: 'border-l-pink-400',     badge: 'bg-pink-400/15 border-pink-400/30',    badgeText: 'text-pink-400',    avatarBorder: 'border-pink-400/60',    hoverBorder: 'hover:border-pink-400/40',    emoji: '👨‍👩‍👧' },
  nation:     { border: 'border-l-purple-400',   badge: 'bg-purple-400/15 border-purple-400/30', badgeText: 'text-purple-400',  avatarBorder: 'border-purple-400/60',  hoverBorder: 'hover:border-purple-400/40',  emoji: '🏛️' },
  poverty:    { border: 'border-l-orange-400',   badge: 'bg-orange-400/15 border-orange-400/30', badgeText: 'text-orange-400',  avatarBorder: 'border-orange-400/60',  hoverBorder: 'hover:border-orange-400/40',  emoji: '🌿' },
  recovery:   { border: 'border-l-cyan-400',     badge: 'bg-cyan-400/15 border-cyan-400/30',    badgeText: 'text-cyan-400',    avatarBorder: 'border-cyan-400/60',    hoverBorder: 'hover:border-cyan-400/40',    emoji: '🔄' },
};

const defaultColors = { border: 'border-l-primary', badge: 'bg-primary/10 border-primary/20', badgeText: 'text-primary', avatarBorder: 'border-primary', hoverBorder: 'hover:border-primary/40', emoji: '🙏' };

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
  const colors = topicColorMap[prayer.topic] || defaultColors;

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
      className={`bg-card border border-border border-l-4 ${colors.border} rounded-2xl p-4 sm:p-6 transition-all duration-300 ${colors.hoverBorder}`}
      style={animationStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 line-clamp-4">{prayer.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[0.88rem] text-muted-foreground">
          🙏 <span className="text-primary font-bold">{prayer.amen_count}</span> Amen
        </div>
        <button onClick={() => onToggleAmen(prayer.id)} className={`px-3.5 py-1.5 rounded-md text-[0.82rem] font-bold cursor-pointer transition-all duration-300 ${hasAmened ? 'bg-primary text-primary-foreground' : 'bg-gold-dim border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground'}`}>
          {hasAmened ? t('prayerWall.amened') : t('prayerWall.amen')}
        </button>
      </div>
    </div>
  );
};

export default PrayerCard;
