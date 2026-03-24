import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Loader2, Upload, Trash2, ImageIcon } from 'lucide-react';

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
  const [heroBgUrls, setHeroBgUrls] = useState<Record<string, string>>({});
  const [heroBgUploading, setHeroBgUploading] = useState<Record<string, boolean>>({});
  const heroBgInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
    const keys = ['hero_bg_about', 'hero_bg_give', 'hero_bg_news', 'hero_bg_library', 'hero_bg_testimonials', 'hero_bg_impact', 'hero_bg_word'];
    const urls: Record<string, string> = {};
    (data || []).forEach(i => { if (keys.includes(i.content_key)) urls[i.content_key] = i.content_value || ''; });
    setHeroBgUrls(urls);
    setLoading(false);
  };

  const handleHeroBgUpload = async (contentKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroBgUploading(prev => ({ ...prev, [contentKey]: true }));
    const ext = file.name.split('.').pop();
    const path = `hero-bg/${contentKey}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('uploads').upload(path, file, { upsert: true });
    if (upErr) { toast.error('Upload thất bại: ' + upErr.message); setHeroBgUploading(prev => ({ ...prev, [contentKey]: false })); return; }
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
    const url = urlData.publicUrl;
    const { error: saveErr } = await supabase.from('site_content')
      .update({ content_value: url, updated_at: new Date().toISOString() })
      .eq('content_key', contentKey);
    setHeroBgUploading(prev => ({ ...prev, [contentKey]: false }));
    if (saveErr) { toast.error('Lưu URL thất bại'); return; }
    setHeroBgUrls(prev => ({ ...prev, [contentKey]: url }));
    toast.success('Đã cập nhật ảnh nền!');
    const ref = heroBgInputRefs.current[contentKey];
    if (ref) ref.value = '';
  };

  const handleHeroBgRemove = async (contentKey: string) => {
    if (!confirm('Xóa ảnh nền này?')) return;
    const { error } = await supabase.from('site_content')
      .update({ content_value: '', updated_at: new Date().toISOString() })
      .eq('content_key', contentKey);
    if (error) { toast.error('Xóa thất bại'); return; }
    setHeroBgUrls(prev => ({ ...prev, [contentKey]: '' }));
    toast.success('Đã xóa ảnh nền');
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
        {/* ── PageHero Background Images ── */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-foreground font-semibold mb-1">🖼️ Ảnh nền PageHero</h3>
          <p className="text-muted-foreground text-sm mb-5">Mỗi trang có ảnh riêng, hiển thị mờ phía sau hero section</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { key: 'hero_bg_about',        label: 'Trang About' },
              { key: 'hero_bg_give',         label: 'Trang Give' },
              { key: 'hero_bg_news',         label: 'Trang News' },
              { key: 'hero_bg_library',      label: 'Trang Library' },
              { key: 'hero_bg_testimonials', label: 'Trang Testimonials' },
              { key: 'hero_bg_impact',       label: 'Trang Impact' },
              { key: 'hero_bg_word',         label: 'Trang Word' },
            ] as const).map(({ key, label }) => {
              const url = heroBgUrls[key] || '';
              const uploading = heroBgUploading[key] || false;
              return (
                <div key={key} className="border border-border rounded-xl p-3 space-y-2">
                  <input
                    ref={el => { heroBgInputRefs.current[key] = el; }}
                    type="file" accept="image/*"
                    onChange={e => handleHeroBgUpload(key, e)}
                    className="hidden"
                  />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  {url ? (
                    <>
                      <div className="relative h-[120px] rounded-lg overflow-hidden border border-border">
                        <img src={url} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-1.5 left-2 text-white text-[10px] opacity-70">preview</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => heroBgInputRefs.current[key]?.click()}
                          disabled={uploading}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-semibold hover:bg-primary/25 transition-colors border-none cursor-pointer disabled:opacity-60"
                        >
                          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                          {uploading ? 'Uploading...' : 'Đổi ảnh'}
                        </button>
                        <button
                          onClick={() => handleHeroBgRemove(key)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors border-none cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => heroBgInputRefs.current[key]?.click()}
                      disabled={uploading}
                      className="w-full h-[100px] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-black/10 flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-60"
                    >
                      {uploading
                        ? <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-xs">Đang upload...</span></>
                        : <><ImageIcon className="w-5 h-5" /><span className="text-xs font-medium">Chọn ảnh</span></>
                      }
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat.key && !i.content_key.startsWith('hero_bg_'));
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
