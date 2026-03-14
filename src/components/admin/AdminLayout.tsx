import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, FileText, MessageSquare, Users, Settings, BarChart3, Menu, X, Flag, Globe, Radio, Quote, Mail } from 'lucide-react';

const adminNav = [
  { path: '/admin', labelKey: 'admin.dashboard', icon: LayoutDashboard },
  { path: '/admin/live-stats', labelKey: 'Live Stats', icon: BarChart3 },
  { path: '/admin/site-content', labelKey: 'Nội dung web', icon: Globe },
  { path: '/admin/live-sessions', labelKey: 'Phiên Live', icon: Radio },
  { path: '/admin/posts', labelKey: 'admin.posts.title', icon: FileText },
  { path: '/admin/prayers', labelKey: 'admin.prayers.title', icon: MessageSquare },
  { path: '/admin/campaigns', labelKey: 'Chiến dịch', icon: Flag },
  { path: '/admin/testimonials', labelKey: 'Lời chứng', icon: Quote },
  { path: '/admin/users', labelKey: 'admin.users.title', icon: Users },
  { path: '/admin/newsletter', labelKey: 'Newsletter', icon: Mail },
  { path: '/admin/settings', labelKey: 'admin.settings.title', icon: Settings },
];

const AdminLayout = () => {
  const { t } = useTranslation();
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary text-xl">{t('common.loading')}</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-3 bg-card border-b border-border">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-full bg-gold-dim border border-primary flex items-center justify-center text-sm">✦</div>
          <span className="font-serif text-primary text-lg font-bold">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-primary">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - desktop always visible, mobile toggle */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-[260px] bg-card border-r border-border flex-shrink-0 p-4 flex flex-col gap-1`}>
        <Link to="/" className="hidden md:flex items-center gap-2 no-underline mb-6 px-2">
          <div className="w-8 h-8 rounded-full bg-gold-dim border border-primary flex items-center justify-center text-sm">✦</div>
          <span className="font-serif text-primary text-lg font-bold">Admin</span>
        </Link>
        {adminNav.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.88rem] font-medium no-underline transition-all ${
                active ? 'bg-gold-dim text-primary' : 'text-muted-foreground hover:text-primary hover:bg-gold-dim'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
