import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { t } = useTranslation();
  const [siteName, setSiteName] = useState('HOLYPray');
  const [email, setEmail] = useState('contact@unpray.org');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('site_content')
        .select('content_key, content_value')
        .in('content_key', ['site_name', 'contact_email']);
      if (data) {
        data.forEach((row) => {
          if (row.content_key === 'site_name') setSiteName(row.content_value);
          if (row.content_key === 'contact_email') setEmail(row.content_value);
        });
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const upsertRow = async (key: string, value: string, label: string) => {
      const { data } = await supabase
        .from('site_content')
        .select('id')
        .eq('content_key', key)
        .maybeSingle();
      if (data) {
        await supabase.from('site_content').update({ content_value: value }).eq('content_key', key);
      } else {
        await supabase.from('site_content').insert({
          content_key: key,
          content_value: value,
          label,
          category: 'settings',
          content_type: 'text',
        });
      }
    };
    try {
      await upsertRow('site_name', siteName, 'Tên website');
      await upsertRow('contact_email', email, 'Email liên hệ');
      toast({ title: 'Đã lưu thành công!' });
    } catch {
      toast({ title: 'Lỗi khi lưu', variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="font-serif text-primary text-2xl mb-6">{t('admin.settings.title')}</h1>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-foreground font-semibold mb-2">{t('admin.settings.info')}</h3>
          <p className="text-muted-foreground text-sm">{t('admin.settings.infoSub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.settings.siteName')}</label>
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.settings.email')}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50"
        >
          {saving ? 'Đang lưu...' : t('admin.settings.save')}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
