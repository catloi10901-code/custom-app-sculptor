import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  country: string | null;
  is_active: boolean;
  created_at: string;
}

interface UserWithAmens extends Profile {
  total_amens: number;
}

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserWithAmens[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (!profiles) { setLoading(false); return; }

    // Fetch amen counts per user from prayer_amens
    const { data: amens } = await supabase.from('prayer_amens').select('user_id');
    
    const amenCountMap: Record<string, number> = {};
    if (amens) {
      amens.forEach(a => {
        amenCountMap[a.user_id] = (amenCountMap[a.user_id] || 0) + 1;
      });
    }

    setUsers(profiles.map(p => ({
      ...p,
      total_amens: amenCountMap[p.user_id] || 0,
    })));
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('profiles').update({ is_active: !current }).eq('id', id);
    fetchUsers();
    toast.success(current ? t('admin.users.lockedToast') : t('admin.users.unlockedToast'));
  };

  const setRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    await supabase.from('user_roles').delete().eq('user_id', userId);
    await supabase.from('user_roles').insert({ user_id: userId, role });
    toast.success(t('admin.users.roleSet', { role }));
  };

  if (loading) return <div className="text-muted-foreground">{t('admin.users.loading')}</div>;

  return (
    <div>
      <h1 className="font-serif text-primary text-2xl mb-6">{t('admin.users.title')}</h1>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-[0.88rem] min-w-[650px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.users.name')}</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.users.country')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">🙏 Amen</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.users.status')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.users.role')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-foreground font-medium">{u.display_name || 'N/A'}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.country || '—'}</td>
                <td className="px-4 py-3 text-center text-primary font-bold">{u.total_amens}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {u.is_active ? t('admin.users.active') : t('admin.users.locked')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    onChange={(e) => setRole(u.user_id, e.target.value as any)}
                    className="bg-black/20 border border-border rounded px-2 py-1 text-[0.8rem] text-foreground"
                    defaultValue="user"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(u.id, u.is_active)} className="px-2.5 py-1 rounded-md text-[0.78rem] font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                    {u.is_active ? t('admin.users.lock') : t('admin.users.unlock')}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">{t('admin.users.empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
