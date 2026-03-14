import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  view_count: number;
  like_count: number;
  created_at: string;
}

const AdminPosts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', status: 'draft' });

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('blog_posts').insert({
      title: form.title,
      slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      content: form.content,
      excerpt: form.excerpt,
      status: form.status,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('admin.posts.created'));
      setShowForm(false);
      setForm({ title: '', slug: '', content: '', excerpt: '', status: 'draft' });
      fetchPosts();
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }).eq('id', id);
    fetchPosts();
    toast.success(newStatus === 'published' ? t('admin.posts.publishedToast') : t('admin.posts.draftToast'));
  };

  const deletePost = async (id: string) => {
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
    toast.success(t('admin.posts.deleted'));
  };

  if (loading) return <div className="text-muted-foreground">{t('admin.posts.loading')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-primary text-2xl">{t('admin.posts.title')}</h1>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          {showForm ? t('admin.posts.close') : t('admin.posts.create')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card border border-primary/30 rounded-2xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.posts.postTitle')}</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.posts.slug')}</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={t('admin.posts.slugAuto')} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.posts.excerpt')}</label>
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.posts.content')}</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={6} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground resize-y focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-3 items-center">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-2.5 bg-black/20 border border-border rounded-lg text-foreground">
              <option value="draft">{t('admin.posts.draft')}</option>
              <option value="published">{t('admin.posts.published')}</option>
            </select>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">{t('admin.posts.save')}</button>
          </div>
        </form>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-[0.88rem] min-w-[500px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-muted-foreground font-semibold">{t('admin.posts.postTitle')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.posts.status')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.posts.views')}</th>
              <th className="text-center px-4 py-3 text-muted-foreground font-semibold">{t('admin.posts.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-foreground font-medium">{p.title}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-[0.75rem] font-bold ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {p.status === 'published' ? t('admin.posts.published') : t('admin.posts.draft')}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-muted-foreground">{p.view_count}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button onClick={() => toggleStatus(p.id, p.status)} className="px-2.5 py-1 rounded-md text-[0.78rem] font-semibold bg-primary/10 text-primary hover:bg-primary/20">
                    {p.status === 'published' ? t('admin.posts.unpublish') : t('admin.posts.publish')}
                  </button>
                  <button onClick={() => deletePost(p.id)} className="px-2.5 py-1 rounded-md text-[0.78rem] font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20">
                    {t('admin.posts.delete')}
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t('admin.posts.empty')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPosts;
