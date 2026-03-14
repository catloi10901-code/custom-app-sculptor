import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import PrayerWallTab from '@/components/pray/PrayerWallTab';
import CampaignsTab from '@/components/pray/CampaignsTab';
import LiveSessionsTab from '@/components/pray/LiveSessionsTab';
import CommunityTab from '@/components/pray/CommunityTab';
import PrayerCalendarTab from '@/components/pray/PrayerCalendarTab';

const PrayPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'wall';
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'wall', icon: '🙏', label: t('pray.tab.wall') },
    { id: 'campaigns', icon: '🎯', label: t('pray.tab.campaigns') },
    { id: 'live', icon: null, label: t('pray.tab.live'), isLive: true },
    { id: 'community', icon: '🤝', label: t('pray.tab.community') },
    { id: 'calendar', icon: '📅', label: t('pray.tab.calendar') },
  ];

  return (
    <div>
      <div className="flex gap-0 bg-white/[0.04] border-b border-border sticky top-[60px] z-[100] backdrop-blur-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-[7px] py-3 sm:py-3.5 px-1.5 sm:px-2.5 bg-transparent border-none border-b-[3px] text-[0.78rem] sm:text-[0.88rem] font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-white border-b-primary bg-primary/[0.06]'
                : 'text-muted-foreground border-b-transparent hover:text-foreground hover:bg-white/[0.05]'
            }`}
          >
            {tab.isLive ? (
              <span className="w-[7px] h-[7px] rounded-full bg-red-500 flex-shrink-0" style={{ animation: 'livePulse 1.2s ease-in-out infinite' }} />
            ) : (
              <span className="text-sm sm:text-base">{tab.icon}</span>
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'wall' && <PrayerWallTab />}
      {activeTab === 'campaigns' && <CampaignsTab />}
      {activeTab === 'live' && <LiveSessionsTab />}
      {activeTab === 'community' && <CommunityTab />}
      {activeTab === 'calendar' && <PrayerCalendarTab />}
    </div>
  );
};

export default PrayPage;
