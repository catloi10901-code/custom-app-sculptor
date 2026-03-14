import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  organization: string;
  avatar_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ quote: '', name: '', organization: '' });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
    if (error) { toast.error('Lỗi tải dữ liệu'); return; }
    setItems(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.quote || !form.name) { toast.error('Vui lòng nhập lời chứng và tên'); return; }
    const { error } = await supabase.from('testimonials').insert({
      quote: form.quote,
      name: form.name,
      organization: form.organization,
      sort_order: items.length,
    });
    if (error) { toast.error('Lỗi thêm'); return; }
    toast.success('Đã thêm!');
    setForm({ quote: '', name: '', organization: '' });
    setShowForm(false);
    fetchItems();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lời chứng này?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('Đã xóa');
    fetchItems();
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">Lời chứng</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" />Thêm lời chứng</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1">Lời chứng *</label>
            <Textarea value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} rows={3} placeholder="Nội dung lời chứng..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Tên *</label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Tổ chức</label>
              <Input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} placeholder="Hội thánh ABC" />
            </div>
          </div>
          <Button onClick={handleAdd}>Thêm</Button>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">Chưa có lời chứng nào</p>}
        {items.map(item => (
          <div key={item.id} className={`bg-card border rounded-xl p-4 ${item.is_active ? 'border-border' : 'border-border opacity-50'}`}>
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-muted-foreground italic text-sm mb-2 line-clamp-2">"{item.quote}"</p>
                <div className="text-sm">
                  <strong className="text-foreground">{item.name}</strong>
                  {item.organization && <span className="text-muted-foreground"> · {item.organization}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(item.id, item.is_active)} className="text-muted-foreground hover:text-foreground" title={item.is_active ? 'Ẩn' : 'Hiện'}>
                  {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
