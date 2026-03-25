import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, EyeOff, Plus, X } from 'lucide-react';

interface LibraryItem {
  id: string;
  icon: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  type: string;
}

const emptyForm = {
  icon: '🙏',
  title: '',
  excerpt: '',
  content: '',
  category_id: '',
  sort_order: 0,
  is_published: true,
};

const AdminLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from('library_items').select('*').order('category_id').order('sort_order'),
      supabase.from('blog_categories').select('*').eq('type', 'library').order('sort_order'),
    ]);
    if (itemsRes.data) setItems(itemsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: LibraryItem) => {
    setEditingId(item.id);
    setForm({
      icon: item.icon,
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content || '',
      category_id: item.category_id || '',
      sort_order: item.sort_order,
      is_published: item.is_published,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      icon: form.icon,
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content || null,
      category_id: form.category_id || null,
      sort_order: form.sort_order,
      is_published: form.is_published,
    };
    if (editingId) {
      const { error } = await supabase.from('library_items').update(payload).eq('id', editingId);
      if (error) { toast.error(error.message); return; }
      toast.success('Đã cập nhật mục thư viện');
    } else {
      const { error } = await supabase.from('library_items').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Đã tạo mục thư viện mới');
    }
    closeForm();
    fetchData();
  };

  const togglePublished = async (id: string, current: boolean) => {
    await supabase.from('library_items').update({ is_published: !current }).eq('id', id);
    fetchData();
    toast.success(!current ? 'Đã xuất bản' : 'Đã ẩn');
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Xóa mục này?')) return;
    await supabase.from('library_items').delete().eq('id', id);
    fetchData();
    toast.success('Đã xóa');
  };

  const getCategoryName = (catId: string | null) => {
    if (!catId) return '—';
    const cat = categories.find(c => c.id === catId);
    return cat ? `${cat.icon || ''} ${cat.name}`.trim() : '—';
  };

  const filtered = items.filter(item => {
    const matchCat = !filterCat || item.category_id === filterCat;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <div className="text-muted-foreground">Đang tải...</div>;

  const inputClass = "w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">Thư Viện Cầu Nguyện</h1>
        <button
          onClick={showForm ? closeForm : openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm"
        >
          {showForm ? <><X className="w-4 h-4" /> Đóng</> : <><Plus className="w-4 h-4" /> Thêm mục mới</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 space-y-4">
          <div className="text-lg font-bold text-foreground mb-2">
            {editingId ? '✏️ Chỉnh sửa mục thư viện' : '➕ Tạo mục thư viện mới'}
          </div>
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Icon</label>
              <input
                value={form.icon}
                onChange={e => setForm({ ...form, icon: e.target.value })}
                className={`${inputClass} text-center text-xl`}
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Tiêu đề *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Chuyên mục</label>
              <select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                className={inputClass}
              >
                <option value="">— Chọn chuyên mục —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Thứ tự</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Trạng thái</label>
                <select
                  value={form.is_published ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, is_published: e.target.value === 'true' })}
                  className={inputClass}
                >
                  <option value="true">Xuất bản</option>
                  <option value="false">Ẩn</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Tóm tắt</label>
            <input
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Mô tả ngắn hiển thị trên card..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Nội dung đầy đủ</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={8}
              placeholder="Nội dung bài cầu nguyện đầy đủ..."
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              {editingId ? 'Cập nhật' : 'Lưu'}
            </button>
            <button type="button" onClick={closeForm} className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground font-bold text-sm hover:bg-muted/20">
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm kiếm tiêu đề..."
          className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary w-56"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="">Tất cả chuyên mục</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.name}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground self-center">{filtered.length} mục</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-[0.88rem] min-w-[680px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold w-12">Icon</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Tiêu đề</th>
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">Chuyên mục</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold w-24">Trạng thái</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold w-20">Thứ tự</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-xl">{item.icon}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground max-w-[260px] truncate">{item.title}</div>
                  {item.excerpt && (
                    <div className="text-xs text-muted-foreground line-clamp-1 max-w-[260px]">{item.excerpt}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">{getCategoryName(item.category_id)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${item.is_published ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                    {item.is_published ? 'Hiển thị' : 'Ẩn'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{item.sort_order}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title="Sửa">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => togglePublished(item.id, item.is_published)} className="p-1.5 rounded-md hover:bg-primary/10 text-primary" title={item.is_published ? 'Ẩn' : 'Hiện'}>
                      {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive" title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Không có mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLibrary;
