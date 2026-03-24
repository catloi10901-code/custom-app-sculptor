import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Radio, Eye, EyeOff, X } from 'lucide-react';
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

/** Extract YouTube video ID from any YouTube URL or iframe embed code */
const extractYouTubeId = (input: string): string | null => {
  if (!input) return null;
  // iframe embed src
  const embedMatch = input.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];
  // /live/ URL
  const liveMatch = input.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];
  // watch?v=
  const watchMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  // youtu.be/
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  return null;
};

const emptyForm = { title: '', host: '', youtube_input: '', scheduled_time: '' };

const AdminLiveSessions = () => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase.from('live_sessions').select('*').order('sort_order');
    if (error) { toast.error('Lỗi tải dữ liệu'); return; }
    setSessions(data || []);
    setLoading(false);
  };

  const previewId = extractYouTubeId(form.youtube_input);

  const handleAdd = async () => {
    if (!form.title) { toast.error('Vui lòng nhập tiêu đề'); return; }
    const videoId = extractYouTubeId(form.youtube_input);
    if (form.youtube_input && !videoId) {
      toast.error('Không nhận ra được link YouTube. Thử dán link watch, youtu.be, /live/ hoặc iframe embed code.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('live_sessions').insert({
      title: form.title,
      host: form.host,
      youtube_url: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      scheduled_time: form.scheduled_time || null,
      sort_order: sessions.length,
    });
    setSaving(false);
    if (error) { toast.error('Lỗi thêm: ' + error.message); return; }
    toast.success('Đã thêm phiên live!');
    setForm(emptyForm);
    setShowForm(false);
    fetchSessions();
  };

  const updateYouTubeUrl = async (id: string, input: string) => {
    const videoId = extractYouTubeId(input);
    if (!videoId) { toast.error('Link YouTube không hợp lệ'); return; }
    await supabase.from('live_sessions').update({
      youtube_url: `https://www.youtube.com/embed/${videoId}`,
    }).eq('id', id);
    toast.success('Đã cập nhật link');
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

  const inputClass = 'w-full px-4 py-2.5 bg-black/20 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary';

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />Đang tải...
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-primary text-2xl mb-0.5">Phiên Live</h1>
          <p className="text-muted-foreground text-sm">Quản lý livestream hiển thị ở trang /pray → tab Live</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm border-none cursor-pointer"
        >
          {showForm ? <><X className="w-4 h-4" />Đóng</> : <><Plus className="w-4 h-4" />Thêm phiên</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 space-y-4">
          <p className="font-bold text-foreground">➕ Thêm phiên live mới</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Tiêu đề *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Cầu nguyện buổi sáng thứ Hai" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Host / Người dẫn</label>
              <input value={form.host} onChange={e => setForm(p => ({ ...p, host: e.target.value }))} placeholder="Mục sư Nguyễn Văn A" className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">YouTube URL hoặc Iframe embed code</label>
              <textarea
                value={form.youtube_input}
                onChange={e => setForm(p => ({ ...p, youtube_input: e.target.value }))}
                placeholder={'https://www.youtube.com/watch?v=...\nhoặc dán <iframe ...> từ YouTube'}
                rows={2}
                className={`${inputClass} resize-none`}
              />
              {form.youtube_input && (
                <p className={`text-xs mt-1 ${previewId ? 'text-emerald-400' : 'text-red-400'}`}>
                  {previewId ? `✅ Video ID: ${previewId}` : '❌ Không nhận ra được link YouTube'}
                </p>
              )}
            </div>
            {previewId && (
              <div className="md:col-span-2">
                <p className="text-xs font-bold text-muted-foreground mb-1.5">Preview</p>
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-border">
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1.5">Thời gian lịch phát</label>
              <input type="datetime-local" value={form.scheduled_time} onChange={e => setForm(p => ({ ...p, scheduled_time: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm border-none cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Thêm phiên'}
          </button>
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-3">
        {sessions.length === 0 && (
          <p className="text-muted-foreground text-center py-8">Chưa có phiên live nào</p>
        )}
        {sessions.map(s => (
          <div key={s.id} className={`bg-card border rounded-2xl p-4 ${s.is_live ? 'border-red-500/50' : 'border-border'}`}>
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {s.youtube_url ? (
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(s.youtube_url)}/mqdefault.jpg`}
                  alt=""
                  className="w-28 h-16 object-cover rounded-lg shrink-0 border border-border"
                />
              ) : (
                <div className="w-28 h-16 rounded-lg bg-white/5 border border-border shrink-0 flex items-center justify-center text-2xl">📺</div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {s.is_live && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Radio className="w-3 h-3" />LIVE
                    </span>
                  )}
                  {!s.is_active && (
                    <span className="text-xs bg-white/10 text-muted-foreground px-2 py-0.5 rounded-full font-bold">Ẩn</span>
                  )}
                  <span className="font-semibold text-foreground truncate">{s.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {s.host}{s.scheduled_time ? ` · ${new Date(s.scheduled_time).toLocaleString('vi')}` : ''}
                </p>
                {s.youtube_url && (
                  <p className="text-xs text-muted-foreground/60 font-mono mt-0.5 truncate">{s.youtube_url}</p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] text-muted-foreground">Live</span>
                  <Switch checked={s.is_live} onCheckedChange={() => toggleLive(s.id, s.is_live)} />
                </div>
                <button
                  onClick={() => toggleActive(s.id, s.is_active)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground border-none cursor-pointer transition-colors"
                  title={s.is_active ? 'Ẩn khỏi trang' : 'Hiện trên trang'}
                >
                  {s.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    const input = prompt('Dán YouTube URL hoặc iframe embed code mới:', s.youtube_url || '');
                    if (input) updateYouTubeUrl(s.id, input);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-xs font-semibold border-none cursor-pointer transition-colors"
                >
                  Đổi link
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive border-none cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLiveSessions;
