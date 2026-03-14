import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';

const campaignsData = [
  { id: 1, icon: '🕊️', titleKey: 'campaigns.card.peace.title', descKey: 'campaigns.card.peace.desc', participants: 12847, goal: 20000 },
  { id: 2, icon: '💚', titleKey: 'campaigns.card.healing.title', descKey: 'campaigns.card.healing.desc', participants: 8432, goal: 15000 },
  { id: 3, icon: '👨‍👩‍👧', titleKey: 'campaigns.card.family.title', descKey: 'campaigns.card.family.desc', participants: 6215, goal: 10000 },
  { id: 4, icon: '🏛️', titleKey: 'campaigns.card.nation.title', descKey: 'campaigns.card.nation.desc', participants: 9876, goal: 15000 },
  { id: 5, icon: '🌾', titleKey: 'campaigns.card.poverty.title', descKey: 'campaigns.card.poverty.desc', participants: 11234, goal: 18000 },
  { id: 6, icon: '🔥', titleKey: 'campaigns.card.revival.title', descKey: 'campaigns.card.revival.desc', participants: 7650, goal: 12000 },
];

const CampaignsTab = () => {
  const { t } = useTranslation();
  const [joinedIds, setJoinedIds] = useState<number[]>([]);

  const handleJoin = (id: number) => {
    setJoinedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
            {t('campaigns.active')}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t('campaigns.title')}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          {t('campaigns.subtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaignsData.map((campaign) => {
          const progress = Math.round((campaign.participants / campaign.goal) * 100);
          const joined = joinedIds.includes(campaign.id);

          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{campaign.icon}</span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {t(campaign.titleKey)}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {t(campaign.descKey)}
              </p>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{campaign.participants.toLocaleString()} {t('campaigns.participants')}</span>
                  <span>{t('campaigns.goal')}: {campaign.goal.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <button
                onClick={() => handleJoin(campaign.id)}
                disabled={joined}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  joined
                    ? 'bg-primary/10 text-primary border border-primary/20 cursor-default'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                }`}
              >
                {joined ? `✓ ${t('campaigns.joined')}` : `🙏 ${t('campaigns.join')}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignsTab;
