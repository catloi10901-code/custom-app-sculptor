import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Prayer {
  id: string;
  name: string;
  country: string | null;
  topic: string;
  content: string;
  amen_count: number;
  is_approved: boolean;
  created_at: string;
}

const AdminPrayers = () => {
  const { t } = useTranslation();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrayers = async () => {
    const { data, error } = await supabase
      .from('prayers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error && data) setPrayers(data);
    setLoading(false);
  };

  useEffect(() => { fetchPrayers(); }, []);

  const toggleApproval = async (id: string, current: boolean) => {
    const { error } = await supabase.from('prayers').update({ is_approved: !current }).eq('id', id);
    if (!error) {
      setPrayers(prev => prev.map(p => p.id === id ? { ...p, is_approved: !current } : p));
      toast.success(current ? t('admin.prayers.hidden') : t('admin.prayers.approvedToast'));
    }
  };

  const deletePrayer = async (id: string) => {
    const { error } = await supabase.from('prayers').delete().eq('id', id);
    if (!error) {
      setPrayers(prev => prev.filter(p => p.id !== id));
      toast.success(t('admin.prayers.deleted'));
    }
  };

  if (loading) return <div className="text-muted-foreground">{t('admin.prayers.loading')}</div>;

  return (
    <div>
      <h1 className="font-serif text-primary text-2xl mb-6">{t('admin.prayers.title')}</h1>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-[0.88rem] min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.name')}</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.topic')}</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.content')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.amen')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.status')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.prayers.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {prayers.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-foreground font-medium">{p.name}</td>
                <td className="px-4 py-3 text-primary text-[0.82rem]">{p.topic}</td>
                <td className="px-4 py-3 text-muted-foreground max-w-[300px] truncate">{p.content}</td>
                <td className="px-4 py-3 text-center text-primary font-bold">{p.amen_count}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${p.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {p.is_approved ? t('admin.prayers.approved') : t('admin.prayers.pending')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => toggleApproval(p.id, p.is_approved)} className="px-2.5 py-1 rounded-md text-[0.78rem] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                    {p.is_approved ? t('admin.prayers.hide') : t('admin.prayers.approve')}
                  </button>
                  <button onClick={() => deletePrayer(p.id)} className="px-2.5 py-1 rounded-md text-[0.78rem] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all">
                    {t('admin.prayers.delete')}
                  </button>
                </td>
              </tr>
            ))}
            {prayers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">{t('admin.prayers.empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPrayers;
