import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Loader2, Check, X, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, ImageIcon } from 'lucide-react';

type Submission = {
  id: string;
  full_name: string;
  birth_date: string | null;
  facebook: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  title: string;
  before_prayer: string;
  after_prayer: string;
  current_status: string | null;
  message: string | null;
  media_urls: string[];
  status: string;
  created_at: string;
};

const STATUS_TABS = [
  { key: 'pending', label: 'Chờ duyệt', icon: Clock, color: 'text-yellow-400' },
  { key: 'approved', label: 'Đã duyệt', icon: CheckCircle, color: 'text-emerald-400' },
  { key: 'rejected', label: 'Từ chối', icon: XCircle, color: 'text-red-400' },
];

const AdminTestimonials = () => {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => { fetchItems(); }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    setExpandedId(null);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('status', activeTab)
      .order('created_at', { ascending: false });
    if (error) { toast.error('Lỗi tải dữ liệu'); }
    else setItems((data as unknown as Submission[]) || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
    if (error) { toast.error('Lỗi cập nhật'); }
    else {
      toast.success(status === 'approved' ? '✅ Đã duyệt — hiển thị lên trang công khai' : '❌ Đã từ chối');
      fetchItems();
    }
    setProcessing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa lời chứng này vĩnh viễn?')) return;
    setProcessing(id);
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) { toast.error('Lỗi xóa'); }
    else { toast.success('Đã xóa'); fetchItems(); }
    setProcessing(null);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const counts = { pending: 0, approved: 0, rejected: 0 };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-primary text-2xl mb-1">Lời chứng</h1>
        <p className="text-muted-foreground text-sm">Duyệt lời chứng từ người dùng gửi lên</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 w-fit">
        {STATUS_TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none ${
                activeTab === tab.key ? 'bg-card text-foreground shadow' : 'bg-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${activeTab === tab.key ? tab.color : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />Đang tải...
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">Không có lời chứng nào</p>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const expanded = expandedId === item.id;
            const busy = processing === item.id;
            const hasMedia = item.media_urls?.length > 0;
            return (
              <div key={item.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header row */}
                <div className="flex items-start gap-4 p-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold">
                    {item.full_name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mb-0.5">
                      <span className="font-semibold text-foreground">{item.full_name}</span>
                      {item.address && <span className="text-muted-foreground text-xs">{item.address}</span>}
                      {item.birth_date && <span className="text-muted-foreground text-xs">· {new Date(item.birth_date).toLocaleDateString('vi-VN')}</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mb-1.5">
                      {item.email && <span>{item.email}</span>}
                      {item.phone && <span>{item.phone}</span>}
                      {item.facebook && <span>{item.facebook}</span>}
                    </div>
                    <p className="font-serif text-primary text-sm font-semibold leading-snug">"{item.title}"</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{formatDate(item.created_at)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasMedia && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-lg">
                        <ImageIcon className="w-3 h-3" />{item.media_urls.length}
                      </span>
                    )}
                    <button
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground border-none cursor-pointer transition-colors"
                    >
                      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {activeTab !== 'approved' && (
                      <button
                        onClick={() => updateStatus(item.id, 'approved')}
                        disabled={!!busy}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border-none cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Duyệt
                      </button>
                    )}
                    {activeTab !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(item.id, 'rejected')}
                        disabled={!!busy}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border-none cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                        Từ chối
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={!!busy}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-none cursor-pointer transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded && (
                  <div className="border-t border-border px-4 py-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Trước khi cầu nguyện</p>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-white/5 rounded-lg p-3">{item.before_prayer}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1.5">⭐ Sau khi cầu nguyện</p>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-primary/5 border border-primary/15 rounded-lg p-3">{item.after_prayer}</p>
                      </div>
                    </div>
                    {item.current_status && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Tình trạng hiện tại</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{item.current_status}</p>
                      </div>
                    )}
                    {item.message && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Lời chia sẻ</p>
                        <p className="text-sm text-foreground/80 italic leading-relaxed">"{item.message}"</p>
                      </div>
                    )}
                    {hasMedia && (
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Hình ảnh / Video ({item.media_urls.length})</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {item.media_urls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                              <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg border border-border hover:opacity-90 transition-opacity" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
