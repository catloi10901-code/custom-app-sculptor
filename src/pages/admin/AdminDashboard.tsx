import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ prayers: 0, posts: 0, users: 0, donated: 0 });

  const fetchStats = async () => {
    const [prayers, posts, users, liveStats] = await Promise.all([
      supabase.from('prayers').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('live_stats').select('donated_total, prayers_count, members_count').eq('id', 1).single(),
    ]);
    setStats({
      prayers: liveStats.data ? Number(liveStats.data.prayers_count) : (prayers.count || 0),
      posts: posts.count || 0,
      users: liveStats.data ? Number(liveStats.data.members_count) : (users.count || 0),
      donated: liveStats.data ? Number(liveStats.data.donated_total) : 0,
    });
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_stats' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => fetchStats())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const cards = [
    { label: t('admin.dashboard.prayers'), value: stats.prayers, icon: '🙏', color: 'from-primary/20 to-transparent' },
    { label: t('admin.dashboard.posts'), value: stats.posts, icon: '📖', color: 'from-blue-500/20 to-transparent' },
    { label: t('admin.dashboard.users'), value: stats.users, icon: '👥', color: 'from-green-500/20 to-transparent' },
    { label: t('admin.dashboard.donations'), value: stats.donated, prefix: '$', icon: '💰', color: 'from-purple-500/20 to-transparent' },
  ];

  return (
    <div>
      <h1 className="font-serif text-primary text-2xl mb-6">{t('admin.dashboard')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div key={i} className={`bg-gradient-to-br ${c.color} border border-border rounded-2xl p-6`}>
            <div className="text-3xl mb-2">{c.icon}</div>
            <AnimatedCounter
              value={c.value}
              prefix={(c as any).prefix || ''}
              className="font-serif text-3xl font-bold text-foreground"
            />
            <div className="text-[0.82rem] text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
