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

interface UserTestimony {
  id: string;
  full_name: string;
  birth_date: string | null;
  facebook: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  title: string;
  before_prayer: string;
  after_prayer: string;
  current_status: string | null;
  message: string | null;
  media_urls: string[];
  status: string;
  created_at: string;
}


const statusConfig: Record<string, { label: string; className: string }> = {
  approved:  { label: 'Đã duyệt',  className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  pending:   { label: 'Đang chờ',  className: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
  rejected:  { label: 'Từ chối',   className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

// ── Detail modal ─────────────────────────────────────────────────────────────
const TestimonyDetailModal = ({ item, onClose }: { item: UserTestimony; onClose: () => void }) => {
  const { t } = useTranslation();
  const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);
  const hasMedia = item.media_urls?.length > 0;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
            {item.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight">{item.full_name}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              {fmt(item.created_at)}
              {item.address && <span> · {item.address}</span>}
              {item.birth_date && <span> · {new Date(item.birth_date).getFullYear()}</span>}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-border transition-colors cursor-pointer shrink-0">
            <span className="text-muted-foreground text-sm">✕</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* Status badge */}
          <div className="flex items-center gap-2">
            {(() => {
              const s = statusConfig[item.status] || statusConfig.pending;
              return <span className={`px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold ${s.className}`}>{s.label}</span>;
            })()}
          </div>

          {/* Title */}
          <h2 className="font-serif text-primary font-semibold leading-snug" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            "{item.title}"
          </h2>

          {/* Personal info block */}
          {(item.birth_date || item.phone || item.email || item.facebook) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-white/5 rounded-xl px-3.5 py-3 text-xs">
              {item.birth_date && <>
                <span className="text-muted-foreground">{t('testimonials.field.dob')}</span>
                <span className="text-foreground/80 font-medium">{fmt(item.birth_date)}</span>
              </>}
              {item.phone && <>
                <span className="text-muted-foreground">{t('testimonials.field.phone')}</span>
                <span className="text-foreground/80 font-medium">{item.phone}</span>
              </>}
              {item.email && <>
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground/80 font-medium truncate">{item.email}</span>
              </>}
              {item.facebook && <>
                <span className="text-muted-foreground">Facebook</span>
                <span className="text-foreground/80 font-medium truncate">{item.facebook}</span>
              </>}
            </div>
          )}

          {/* Before */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('testimonials.field.before')}</p>
            <p className="text-sm text-foreground/75 leading-relaxed bg-white/5 rounded-lg px-3 py-2.5">{item.before_prayer}</p>
          </div>

          {/* After */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">⭐ {t('testimonials.field.after')}</p>
            <p className="text-sm text-foreground/80 leading-relaxed bg-primary/5 border border-primary/15 rounded-lg px-3 py-2.5">{item.after_prayer}</p>
          </div>

          {/* Current status */}
          {item.current_status && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('testimonials.field.current')}</p>
              <p className="text-sm text-foreground/75 leading-relaxed">{item.current_status}</p>
            </div>
          )}

          {/* Message */}
          {item.message && (
            <div className="border-l-2 border-primary/40 pl-3 py-1">
              <p className="text-sm text-foreground/70 italic leading-relaxed">"{item.message}"</p>
            </div>
          )}

          {/* Media */}
          {hasMedia && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Media</p>
              <div className="grid grid-cols-4 gap-1.5">
                {item.media_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-border hover:opacity-85 transition-opacity">
                    {isVideo(url)
                      ? <video src={url} className="w-full h-full object-cover" muted playsInline />
                      : <img src={url} alt="" className="w-full h-full object-cover" />}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const [prayers, setPrayers] = useState<UserPrayer[]>([]);
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [testimonies, setTestimonies] = useState<UserTestimony[]>([]);
  const [activeTab, setActiveTab] = useState<'prayers' | 'donations' | 'testimonies' | 'settings'>('prayers');
  const [selectedTestimony, setSelectedTestimony] = useState<UserTestimony | null>(null);
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);

  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [prayerRes, donationRes, testimonyRes] = await Promise.all([
        supabase.from('prayers').select('id, content, topic, amen_count, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('donations').select('id, amount, currency, created_at, is_recurring').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('testimonials').select('id, full_name, birth_date, facebook, phone, email, address, title, before_prayer, after_prayer, current_status, message, media_urls, status, created_at').eq('created_by', user.id).order('created_at', { ascending: false }),
      ]);
      if (prayerRes.data) setPrayers(prayerRes.data);
      if (donationRes.data) setDonations(donationRes.data);
      if (testimonyRes.data) setTestimonies(testimonyRes.data);
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
        <div className="container max-w-[800px] flex gap-0 overflow-x-auto" style={{ scrollbarHeight: '4px' }}>
          {[
            { id: 'prayers' as const,     label: t('profile.tab.prayers') },
            { id: 'donations' as const,    label: t('profile.tab.donations') },
            { id: 'testimonies' as const,  label: t('profile.tab.testimonies'), icon: '✝️' },
            { id: 'settings' as const,      label: t('profile.tab.settings') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] py-2.5 sm:py-3 text-xs sm:text-sm font-semibold border-b-[3px] transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-primary border-b-primary'
                  : 'text-muted-foreground border-b-transparent hover:text-foreground'
              }`}
            >
              {tab.icon && <span className='mr-1'>{tab.icon}</span>}{tab.label}
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
          ) : activeTab === 'testimonies' ? (
            testimonies.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">{t('profile.noTestimonies', 'Bạn chưa gửi lời chứng nào.')}</div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {testimonies.map((tm) => {
                  const s = statusConfig[tm.status] || statusConfig.pending;
                  return (
                    <div key={tm.id} className="bg-card border border-border rounded-xl p-4 sm:p-5 cursor-pointer hover:border-primary/40 transition-all" onClick={() => setSelectedTestimony(tm)}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-foreground font-semibold text-sm sm:text-base leading-snug flex-1">{tm.title}</h3>
                        <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold ${s.className}`}>
                          {s.label}
                        </span>
                      </div>
                      {tm.before_prayer && (
                        <p className="text-[0.78rem] text-muted-foreground mb-1.5">
                          <span className="text-red-400 font-semibold">Trước: </span>
                          {tm.before_prayer.length > 100 ? tm.before_prayer.slice(0, 100) + '…' : tm.before_prayer}
                        </p>
                      )}
                      {tm.after_prayer && (
                        <p className="text-[0.78rem] text-muted-foreground">
                          <span className="text-primary font-semibold">Sau: </span>
                          {tm.after_prayer.length > 100 ? tm.after_prayer.slice(0, 100) + '…' : tm.after_prayer}
                        </p>
                      )}
                      <div className="mt-3 pt-2 border-t border-border/50 text-[0.7rem] text-muted-foreground text-right">
                        {new Date(tm.created_at).toLocaleDateString(locale)}
                      </div>
                    </div>
                  );
                })}
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
      {selectedTestimony && (
        <TestimonyDetailModal item={selectedTestimony} onClose={() => setSelectedTestimony(null)} />
      )}
    </div>
  );
};

export default ProfilePage;
