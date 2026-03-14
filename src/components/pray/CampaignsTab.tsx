import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  icon: string;
  title: string;
  description: string;
  participants: number;
  goal: number;
  is_active: boolean;
  sort_order: number;
}

const CampaignsTab = () => {
  const { t } = useTranslation();
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (data) setCampaigns(data);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  const handleJoin = (id: string) => {
    setJoinedIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4 text-center text-muted-foreground">
        {t('common.loading')}
      </div>
    );
  }

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
        {campaigns.map((campaign) => {
          const progress = Math.round((campaign.participants / campaign.goal) * 100);
          const joined = joinedIds.includes(campaign.id);

          return (
            <div
              key={campaign.id}
              className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{campaign.icon}</span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {campaign.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">
                {campaign.description}
              </p>

              <div className="mt-auto">
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignsTab;
