import { useTranslation } from 'react-i18next';

const LiveTicker = () => {
  const { t } = useTranslation();

  const tickerItems = [
    { emoji: '🙏', name: 'Nguyễn Thị Hoa', action: t('ticker.prayed'), flag: '🇻🇳', country: 'Việt Nam' },
    { emoji: '✨', name: 'John Smith', action: t('ticker.amened'), flag: '🇺🇸', country: 'USA' },
    { emoji: '🌍', name: 'Amara Diallo', action: t('ticker.prayed'), flag: '🇸🇳', country: 'Senegal' },
    { emoji: '💛', name: 'Maria Garcia', action: t('ticker.donated'), flag: '🇪🇸', country: 'España' },
    { emoji: '🕊️', name: 'Yuki Tanaka', action: t('ticker.prayed'), flag: '🇯🇵', country: '日本' },
    { emoji: '🙏', name: 'David Kim', action: t('ticker.amened'), flag: '🇰🇷', country: '한국' },
    { emoji: '🌟', name: 'Sarah Williams', action: t('ticker.donated'), flag: '🇬🇧', country: 'UK' },
    { emoji: '💚', name: 'Ahmed Hassan', action: t('ticker.prayed'), flag: '🇪🇬', country: 'Egypt' },
  ];

  const items = Array.from({ length: 10 }, () => tickerItems).flat();

  return (
    <div className="bg-primary/[0.08] border-y border-border py-2.5 sm:py-3 overflow-hidden relative">
      <div className="flex whitespace-nowrap" style={{ animation: 'ticker 40s linear infinite', width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 sm:gap-2 text-[0.75rem] sm:text-[0.88rem] text-muted-foreground flex-shrink-0 mx-4 sm:mx-8">
            <span>{item.emoji}</span>
            <strong className="text-primary">{item.name}</strong>
            <span className="hidden sm:inline">{item.action}</span>
            <span>{item.flag}</span>
            <span className="hidden xs:inline">{item.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;
