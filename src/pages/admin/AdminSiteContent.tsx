import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

type SiteContent = {
  id: string;
  content_key: string;
  content_value: string;
  content_type: string;
  category: string;
  label: string;
  sort_order: number;
};

const CATEGORIES = [
  { key: 'hero', label: '🏠 Hero Section' },
  { key: 'stats', label: '📊 Số liệu Impact' },
  { key: 'social', label: '🔗 Social Links' },
  { key: 'footer', label: '📧 Footer' },
];

const AdminSiteContent = () => {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('category')
      .order('sort_order');
    if (error) { toast.error('Lỗi tải dữ liệu'); return; }
    setItems(data || []);
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = Object.entries(changes);
    let hasError = false;
    for (const [key, value] of updates) {
      const { error } = await supabase
        .from('site_content')
        .update({ content_value: value, updated_at: new Date().toISOString() })
        .eq('content_key', key);
      if (error) hasError = true;
    }
    setSaving(false);
    if (hasError) { toast.error('Có lỗi khi lưu'); }
    else { toast.success('Đã lưu thành công!'); setChanges({}); fetchContent(); }
  };

  const getValue = (item: SiteContent) => {
    return changes[item.content_key] !== undefined ? changes[item.content_key] : item.content_value;
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Đang tải...</div>;

  const hasChanges = Object.keys(changes).length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">Nội dung trang web</h1>
        {hasChanges && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Lưu thay đổi ({Object.keys(changes).length})
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat.key);
          if (catItems.length === 0) return null;
          return (
            <div key={cat.key} className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-semibold mb-4">{cat.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div key={item.id}>
                    <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">
                      {item.label}
                      <span className="text-xs font-normal ml-2 text-muted-foreground/60">({item.content_key})</span>
                    </label>
                    <Input
                      value={getValue(item)}
                      onChange={e => handleChange(item.content_key, e.target.value)}
                      className={changes[item.content_key] !== undefined ? 'border-primary' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSiteContent;
