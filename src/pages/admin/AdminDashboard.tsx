import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { HandHeart, BookOpen, Users, Target, Radio, ScrollText, Newspaper, Heart } from 'lucide-react';

interface Stats {
  prayers: number;
  amens: number;
  testimonials: number;
  posts: number;
  words: number;
  users: number;
  campaigns: number;
  liveSessions: number;
}

const INITIAL: Stats = { prayers: 0, amens: 0, testimonials: 0, posts: 0, words: 0, users: 0, campaigns: 0, liveSessions: 0 };

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>(INITIAL);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const [prayers, amens, testimonials, posts, words, users, campaigns, liveSessions] = await Promise.all([
      supabase.from('prayers').select('id', { count: 'exact', head: true }),
      supabase.from('prayer_amens').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published').eq('post_type', 'news'),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published').eq('post_type', 'word'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('campaigns').select('id', { count: 'exact', head: true }),
      supabase.from('live_sessions').select('id', { count: 'exact', head: true }).eq('is_active', true),
    ]);
    setStats({
      prayers: prayers.count ?? 0,
      amens: amens.count ?? 0,
      testimonials: testimonials.count ?? 0,
      posts: posts.count ?? 0,
      words: words.count ?? 0,
      users: users.count ?? 0,
      campaigns: campaigns.count ?? 0,
      liveSessions: liveSessions.count ?? 0,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayer_amens' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchStats)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const cards = [
    {
      label: 'Lời cầu nguyện',
      value: stats.prayers,
      icon: HandHeart,
      accent: 'text-primary',
      bg: 'bg-primary/[0.08]',
      border: 'border-primary/20',
      glow: 'shadow-primary/10',
    },
    {
      label: 'Số Amen',
      value: stats.amens,
      icon: Heart,
      accent: 'text-rose-400',
      bg: 'bg-rose-500/[0.08]',
      border: 'border-rose-500/20',
      glow: 'shadow-rose-500/10',
    },
    {
      label: 'Lời chứng',
      value: stats.testimonials,
      icon: ScrollText,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/[0.08]',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
    {
      label: 'Bài viết tin tức',
      value: stats.posts,
      icon: Newspaper,
      accent: 'text-blue-400',
      bg: 'bg-blue-500/[0.08]',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/10',
    },
    {
      label: 'Lời Chúa',
      value: stats.words,
      icon: BookOpen,
      accent: 'text-sky-400',
      bg: 'bg-sky-500/[0.08]',
      border: 'border-sky-500/20',
      glow: 'shadow-sky-500/10',
    },
    {
      label: 'Người dùng',
      value: stats.users,
      icon: Users,
      accent: 'text-green-400',
      bg: 'bg-green-500/[0.08]',
      border: 'border-green-500/20',
      glow: 'shadow-green-500/10',
    },
    {
      label: 'Chiến dịch',
      value: stats.campaigns,
      icon: Target,
      accent: 'text-purple-400',
      bg: 'bg-purple-500/[0.08]',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/10',
    },
    {
      label: 'Phiên live đang hoạt động',
      value: stats.liveSessions,
      icon: Radio,
      accent: 'text-red-400',
      bg: 'bg-red-500/[0.08]',
      border: 'border-red-500/20',
      glow: 'shadow-red-500/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-sm text-muted-foreground mt-1">Thống kê toàn bộ dữ liệu hệ thống</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className={`relative rounded-2xl border ${c.border} ${c.bg} p-6 flex items-center gap-5 shadow-lg ${c.glow} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${c.accent}`} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                {loading ? (
                  <div className="h-8 w-16 bg-white/10 rounded-lg animate-pulse mb-1" />
                ) : (
                  <AnimatedCounter
                    value={c.value}
                    className={`font-serif text-3xl font-bold ${c.accent}`}
                  />
                )}
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
