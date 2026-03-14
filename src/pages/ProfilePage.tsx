import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserPrayer {
  id: string;
  content: string;
  topic: string;
  amen_count: number;
  created_at: string;
}

interface UserDonation {
  id: string;
  amount: number;
  currency: string;
  created_at: string;
  is_recurring: boolean;
}

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const [prayers, setPrayers] = useState<UserPrayer[]>([]);
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [activeTab, setActiveTab] = useState<'prayers' | 'donations' | 'settings'>('prayers');
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [prayerRes, donationRes] = await Promise.all([
        supabase.from('prayers').select('id, content, topic, amen_count, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('donations').select('id, amount, currency, created_at, is_recurring').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (prayerRes.data) setPrayers(prayerRes.data);
      if (donationRes.data) setDonations(donationRes.data);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (profile) {
      setEditName(profile.display_name || '');
      setEditCountry(profile.country || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('bio').eq('user_id', user.id).single().then(({ data }) => {
      if (data?.bio) setEditBio(data.bio);
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name: editName,
      country: editCountry,
      bio: editBio,
    }).eq('user_id', user.id);

    if (error) {
      toast.error(t('profile.updateError'));
    } else {
      toast.success(t('profile.updateSuccess'));
    }
    setSaving(false);
  };

  const topicLabels: Record<string, string> = {
    peace: t('topic.peace'),
    prosperity: t('topic.prosperity'),
    poverty: t('topic.poverty'),
    healing: t('topic.healing'),
    family: t('topic.family'),
    nation: t('topic.nation'),
  };

  if (!user) {
    return (
      <div className="py-20 text-center">
        <div className="container">
          <p className="text-2xl mb-4">🔐</p>
          <p className="text-muted-foreground">{t('profile.loginRequired')}</p>
        </div>
      </div>
    );
  }

  const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div>
      <section className="py-10 sm:py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 60%)' }}>
        <div className="container max-w-[800px]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-dim border-2 border-primary flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : '👤'}
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-foreground text-xl sm:text-2xl truncate">{profile?.display_name || user.email}</h1>
              <p className="text-muted-foreground text-xs sm:text-sm truncate">{user.email}</p>
              {profile?.country && <p className="text-primary text-xs sm:text-sm mt-1">{profile.country}</p>}
            </div>
          </div>

          <div className="flex gap-4 sm:gap-6 mt-5 sm:mt-6 justify-center sm:justify-start">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{prayers.length}</div>
              <div className="text-[0.7rem] sm:text-[0.78rem] text-muted-foreground">{t('profile.prayers')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">{prayers.reduce((s, p) => s + p.amen_count, 0)}</div>
              <div className="text-[0.7rem] sm:text-[0.78rem] text-muted-foreground">{t('profile.amensReceived')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-primary">${totalDonated}</div>
              <div className="text-[0.7rem] sm:text-[0.78rem] text-muted-foreground">{t('profile.donated')}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[60px] z-[50] bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container max-w-[800px] flex gap-0">
          {[
            { id: 'prayers' as const, label: t('profile.tab.prayers') },
            { id: 'donations' as const, label: t('profile.tab.donations') },
            { id: 'settings' as const, label: t('profile.tab.settings') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-[3px] transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-primary border-b-primary'
                  : 'text-muted-foreground border-b-transparent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-6 sm:py-10">
        <div className="container max-w-[800px]">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">{t('profile.loading')}</div>
          ) : activeTab === 'prayers' ? (
            prayers.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">{t('profile.noPrayers')}</div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {prayers.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-xl p-4 sm:p-5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
                      {topicLabels[p.topic] || p.topic}
                    </span>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2">{p.content}</p>
                    <div className="flex justify-between text-[0.7rem] sm:text-[0.78rem] text-muted-foreground">
                      <span>🙏 {p.amen_count} Amen</span>
                      <span>{new Date(p.created_at).toLocaleDateString(locale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'donations' ? (
            donations.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">{t('profile.noDonations')}</div>
            ) : (
              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d.id} className="bg-card border border-border rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-foreground font-bold text-base sm:text-lg">${Number(d.amount).toFixed(2)}</div>
                      <div className="text-muted-foreground text-[0.7rem] sm:text-[0.78rem]">
                        {new Date(d.created_at).toLocaleDateString(locale)}
                        {d.is_recurring && ` • ${t('profile.recurring')}`}
                      </div>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-[0.7rem] sm:text-[0.78rem] font-semibold whitespace-nowrap">
                      {t('profile.completed')}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[0.8rem] sm:text-[0.85rem] font-bold text-muted-foreground mb-2">{t('profile.displayName')}</label>
                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/20 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[0.8rem] sm:text-[0.85rem] font-bold text-muted-foreground mb-2">{t('profile.country')}</label>
                <input type="text" value={editCountry} onChange={e => setEditCountry(e.target.value)} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/20 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-[0.8rem] sm:text-[0.85rem] font-bold text-muted-foreground mb-2">{t('profile.bio')}</label>
                <textarea rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/20 border border-border rounded-lg text-foreground text-sm resize-y focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={handleSaveProfile} disabled={saving} className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
                  {saving ? t('profile.saving') : t('profile.saveBtn')}
                </button>
                <button onClick={signOut} className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-destructive text-destructive font-bold text-sm hover:bg-destructive hover:text-destructive-foreground transition-all">
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
