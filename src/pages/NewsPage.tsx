import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/layout/SEOHead';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar, Eye, ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  view_count: number;
  tags: string[] | null;
  category: { name: string; slug: string } | null;
}

const NewsPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, published_at, created_at, view_count, tags, category:blog_categories(name, slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setPosts((data as unknown as Post[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <SEOHead title="Tin Tức - HOLYPray" description="Cập nhật tin tức mới nhất từ HOLYPray - tin tức cộng đồng, sự kiện và hoạt động." />

      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container">
          <h1 className="font-serif text-primary text-center mb-3">Tin Tức</h1>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-[600px] mx-auto">
            Cập nhật những tin tức, sự kiện và hoạt động mới nhất từ cộng đồng HOLYPray
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Chưa có tin tức nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/word/${post.slug}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden no-underline transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg"
                >
                  {post.cover_image ? (
                    <div className="h-48 overflow-hidden">
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gold-dim flex items-center justify-center">
                      <span className="text-4xl opacity-30">✦</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">{post.category.name}</Badge>
                      )}
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <h3 className="text-foreground font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.published_at || post.created_at), 'dd/MM/yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.view_count}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
