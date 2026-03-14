import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Thread {
  id: string;
  title: string;
  content: string;
  category: string;
  reply_count: number;
  view_count: number;
  created_at: string;
  user_id: string;
  is_pinned: boolean;
}

interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  country: string | null;
}

const CommunityTab = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState<'members' | 'threads'>('threads');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('discussion');
  const [posting, setPosting] = useState(false);

  const badgeMap: Record<string, { label: string; cls: string }> = {
    prayer: { label: t('community.badgePrayer'), cls: 'bg-primary/20 text-primary' },
    news: { label: t('community.badgeNews'), cls: 'bg-green-400/20 text-green-300' },
    discussion: { label: t('community.badgeDiscussion'), cls: 'bg-blue-400/30 text-blue-300' },
  };

  useEffect(() => {
    const fetchThreads = async () => {
      const { data } = await supabase.from('community_threads').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(30);
      if (data) setThreads(data);
      setLoading(false);
    };
    const fetchMembers = async () => {
      const { data } = await supabase.from('profiles').select('user_id, display_name, avatar_url, country').eq('is_active', true).limit(30);
      if (data) setMembers(data);
    };
    fetchThreads();
    fetchMembers();
  }, []);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error(t('community.loginRequired')); return; }
    if (!newTitle.trim() || !newContent.trim()) { toast.error(t('community.fillAll')); return; }

    setPosting(true);
    const { error } = await supabase.from('community_threads').insert({ title: newTitle, content: newContent, category: newCategory, user_id: user.id });
    if (error) { toast.error(t('community.createError')); }
    else {
      toast.success(t('community.createSuccess'));
      setNewTitle(''); setNewContent(''); setShowForm(false);
      const { data } = await supabase.from('community_threads').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false }).limit(30);
      if (data) setThreads(data);
    }
    setPosting(false);
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return t('prayerWall.minutesAgo', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('prayerWall.hoursAgo', { count: hrs });
    return t('prayerWall.daysAgo', { count: Math.floor(hrs / 24) });
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="font-serif text-primary">{t('community.title')}</h2>
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            {t('community.newPost')}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateThread} className="bg-card border border-primary rounded-2xl p-6 mb-6">
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('community.titlePlaceholder')} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground mb-3 focus:outline-none focus:border-primary" />
            <textarea rows={3} value={newContent} onChange={e => setNewContent(e.target.value)} placeholder={t('community.contentPlaceholder')} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground mb-3 resize-y focus:outline-none focus:border-primary" />
            <div className="flex gap-3 items-center">
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="px-3 py-2 bg-black/20 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary">
                <option value="discussion">{t('community.catDiscussion')}</option>
                <option value="prayer">{t('community.catPrayer')}</option>
                <option value="news">{t('community.catNews')}</option>
              </select>
              <button type="submit" disabled={posting} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
                {posting ? t('community.posting') : t('community.post')}
              </button>
            </div>
          </form>
        )}

        <div className="flex gap-1.5 mb-6 flex-wrap">
          {[
            { id: 'threads' as const, label: t('community.tabThreads') },
            { id: 'members' as const, label: t('community.tabMembers') },
          ].map((tabItem) => (
            <button key={tabItem.id} onClick={() => setTab(tabItem.id)} className={`px-4 py-2 rounded-full border text-[0.85rem] cursor-pointer transition-all duration-300 ${tab === tabItem.id ? 'bg-secondary border-secondary text-secondary-foreground' : 'border-white/10 bg-transparent text-muted-foreground hover:bg-secondary hover:text-white'}`}>
              {tabItem.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">{t('community.loading')}</div>
        ) : tab === 'threads' ? (
          threads.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground"><p>{t('community.noThreads')}</p></div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {threads.map((thread) => {
                const badge = badgeMap[thread.category] || badgeMap.discussion;
                return (
                  <div key={thread.id} className="bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-300 hover:bg-white/[0.07] hover:border-border">
                    <div className="font-semibold text-foreground text-[0.92rem] mb-1">
                      {thread.is_pinned && '📌 '}{thread.title}
                    </div>
                    <div className="text-[0.77rem] text-muted-foreground flex gap-3 flex-wrap items-center">
                      <span>💬 {thread.reply_count} {t('community.replies')}</span>
                      <span>👁 {thread.view_count} {t('community.views')}</span>
                      <span>{timeAgo(thread.created_at)}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-[0.72rem] font-semibold ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          members.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">{t('community.noMembers')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((m) => (
                <div key={m.user_id} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.08] hover:border-border hover:-translate-y-0.5">
                  <div className="w-11 h-11 rounded-full bg-gold-dim border border-border flex items-center justify-center text-xl mb-2.5 overflow-hidden">
                    {m.avatar_url ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" /> : '👤'}
                  </div>
                  <div className="font-semibold text-foreground text-[0.95rem]">{m.display_name || t('community.member')}</div>
                  {m.country && <div className="text-[0.75rem] text-primary mt-0.5">{m.country}</div>}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default CommunityTab;