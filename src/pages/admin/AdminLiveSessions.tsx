import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Radio, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

type LiveSession = {
  id: string;
  title: string;
  host: string;
  scheduled_time: string | null;
  youtube_url: string | null;
  is_live: boolean;
  viewers: number;
  sort_order: number;
  is_active: boolean;
};

const AdminLiveSessions = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', host: '', youtube_url: '', scheduled_time: '' });

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase.from('live_sessions').select('*').order('sort_order');
    if (error) { toast.error('Lỗi tải dữ liệu'); return; }
    setSessions(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.title) { toast.error('Vui lòng nhập tiêu đề'); return; }
    const { error } = await supabase.from('live_sessions').insert({
      title: form.title,
      host: form.host,
      youtube_url: form.youtube_url || null,
      scheduled_time: form.scheduled_time || null,
      sort_order: sessions.length,
    });
    if (error) { toast.error('Lỗi thêm'); return; }
    toast.success('Đã thêm!');
    setForm({ title: '', host: '', youtube_url: '', scheduled_time: '' });
    setShowForm(false);
    fetchSessions();
  };

  const toggleLive = async (id: string, current: boolean) => {
    await supabase.from('live_sessions').update({ is_live: !current }).eq('id', id);
    fetchSessions();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('live_sessions').update({ is_active: !current }).eq('id', id);
    fetchSessions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa phiên này?')) return;
    await supabase.from('live_sessions').delete().eq('id', id);
    toast.success('Đã xóa');
    fetchSessions();
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" />Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">Phiên Live</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" />Thêm phiên</Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Tiêu đề *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Cầu nguyện buổi sáng" />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Host</label>
              <Input value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} placeholder="Mục sư Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">YouTube URL</label>
              <Input value={form.youtube_url} onChange={e => setForm(p => ({ ...p, youtube_url: e.target.value }))} placeholder="https://youtube.com/..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">Thời gian</label>
              <Input type="datetime-local" value={form.scheduled_time} onChange={e => setForm(p => ({ ...p, scheduled_time: e.target.value }))} />
            </div>
          </div>
          <Button onClick={handleAdd}>Thêm</Button>
        </div>
      )}

      <div className="space-y-3">
        {sessions.length === 0 && <p className="text-muted-foreground text-center py-8">Chưa có phiên live nào</p>}
        {sessions.map(s => (
          <div key={s.id} className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${s.is_live ? 'border-red-500/50' : 'border-border'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {s.is_live && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Radio className="w-3 h-3" />LIVE</span>}
                <span className="font-semibold text-foreground truncate">{s.title}</span>
              </div>
              <div className="text-sm text-muted-foreground">{s.host}{s.scheduled_time ? ` · ${new Date(s.scheduled_time).toLocaleString('vi')}` : ''}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Live</span>
                <Switch checked={s.is_live} onCheckedChange={() => toggleLive(s.id, s.is_live)} />
              </div>
              <button onClick={() => toggleActive(s.id, s.is_active)} className="text-muted-foreground hover:text-foreground" title={s.is_active ? 'Ẩn' : 'Hiện'}>
                {s.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveSessions;
