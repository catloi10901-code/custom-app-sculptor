import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, EyeOff, Plus, X, Upload, ImageIcon } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  view_count: number;
  like_count: number;
  created_at: string;
  category_id: string | null;
  cover_image: string | null;
  tags: string[] | null;
  excerpt: string | null;
  content: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  type: string;
}

const emptyForm = { title: '', slug: '', content: '', excerpt: '', status: 'draft', category_id: '', cover_image: '', tags: '' };

const AdminWord = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [postsRes, catsRes] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('post_type', 'word').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('sort_order'),
    ]);
    if (postsRes.data) setPosts(postsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const wordCategories = categories.filter(c => c.type === 'word');

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCoverFile(null);
    setCoverPreview('');
    setShowForm(true);
  };

  const openEdit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      content: p.content,
      excerpt: p.excerpt || '',
      status: p.status,
      category_id: p.category_id || '',
      cover_image: p.cover_image || '',
      tags: (p.tags || []).join(', '),
    });
    setCoverFile(null);
    setCoverPreview(p.cover_image || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setCoverFile(null);
    setCoverPreview('');
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview('');
    setForm(f => ({ ...f, cover_image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let coverUrl = form.cover_image || null;

    if (coverFile) {
      setUploading(true);
      const ext = coverFile.name.split('.').pop();
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('uploads').upload(path, coverFile, { upsert: true });
      if (upErr) { toast.error('Upload ảnh thất bại: ' + upErr.message); setUploading(false); return; }
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path);
      coverUrl = urlData.publicUrl;
      setUploading(false);
    }

    const payload = {
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      content: form.content,
      excerpt: form.excerpt || null,
      status: form.status,
      category_id: form.category_id || null,
      cover_image: coverUrl,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published_at: form.status === 'published' ? new Date().toISOString() : null,
      post_type: 'word',
    };

    if (editingId) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingId);
      if (error) { toast.error(error.message); return; }
      toast.success('Bài viết đã được cập nhật');
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Bài viết đã được tạo');
    }
    closeForm();
    fetchData();
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }).eq('id', id);
    fetchData();
    toast.success(newStatus === 'published' ? 'Đã xuất bản' : 'Đã chuyển về nháp');
  };

  const deletePost = async (id: string) => {
    if (!confirm('Xóa bài viết này?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchData();
    toast.success('Đã xóa bài viết');
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return '—';
    const cat = categories.find(c => c.id === catId);
    return cat ? `${cat.icon || ''} ${cat.name}`.trim() : '—';
  };

  if (loading) return <div className="text-muted-foreground">Đang tải...</div>;

  const inputClass = "w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">Quản Lý Lời Chúa</h1>
        <button onClick={showForm ? closeForm : openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Tạo bài Lời Chúa</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 space-y-4">
          <div className="text-lg font-bold text-foreground mb-2">
            {editingId ? '✏️ Chỉnh sửa bài Lời Chúa' : '➕ Tạo bài Lời Chúa mới'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Tiêu đề *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className={inputClass} />
            </div>
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Slug</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Tự động từ tiêu đề" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Chuyên mục</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className={inputClass}>
                <option value="">— Chọn chuyên mục —</option>
                {wordCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="draft">Nháp</option>
                <option value="published">Xuất bản</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Ảnh bìa</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" />
            {coverPreview ? (
              <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-border group">
                <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-destructive transition-colors border-none cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs font-semibold hover:bg-black/80 transition-colors border-none cursor-pointer"
                >
                  <Upload className="w-3 h-3" /> Đổi ảnh
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[120px] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-black/10 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm font-medium">Chọn ảnh bìa</span>
                <span className="text-xs opacity-60">PNG, JPG, WebP</span>
              </button>
            )}
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Tags (phân cách bằng dấu phẩy)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="đức tin, cầu nguyện, kinh thánh" className={inputClass} />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Tóm tắt</label>
            <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Nội dung *</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={8} className={`${inputClass} resize-y`} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm disabled:opacity-60">
              {uploading ? 'Đang upload ảnh...' : editingId ? 'Cập nhật' : 'Lưu bài viết'}
            </button>
            <button type="button" onClick={closeForm} className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground font-bold text-sm hover:bg-muted/20">
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-[0.88rem] min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Tiêu đề</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Chuyên mục</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">Trạng thái</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">Lượt xem</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">Ngày tạo</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-foreground font-medium max-w-[250px] truncate">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{getCategoryName(p.category_id)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {p.status === 'published' ? 'Xuất bản' : 'Nháp'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{p.view_count}</td>
                <td className="px-4 py-3 text-center text-muted-foreground text-sm">
                  {new Date(p.created_at).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title="Sửa">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => toggleStatus(p.id, p.status)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title={p.status === 'published' ? 'Ẩn' : 'Xuất bản'}>
                      {p.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deletePost(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chưa có bài Lời Chúa nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWord;
