import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  cover_image: string | null;
  like_count: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
  category_id: string | null;
  tags: string[] | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profile?: { display_name: string | null; avatar_url: string | null };
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

const BlogPostPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (data) {
        setPost(data);
        // Increment view count atomically
        await supabase.rpc('increment_view_count', { post_id: data.id });

        // Fetch category
        if (data.category_id) {
          const { data: cat } = await supabase
            .from('blog_categories')
            .select('*')
            .eq('id', data.category_id)
            .single();
          if (cat) setCategory(cat);
        }

        // Fetch related posts
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3);
        if (related) setRelatedPosts(related);

        // Fetch comments
        await fetchComments(data.id);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (data) {
      // Fetch profiles for commenters
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const enriched = data.map(c => ({
        ...c,
        profile: profileMap.get(c.user_id) || { display_name: null, avatar_url: null },
      }));
      setComments(enriched);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error(t('blog.loginRequired')); return; }
    if (!newComment.trim() || !post) return;

    setSubmittingComment(true);
    const { error } = await supabase.from('blog_comments').insert({
      content: newComment,
      post_id: post.id,
      user_id: user.id,
    });

    if (error) {
      toast.error(t('blog.commentError'));
    } else {
      toast.success(t('blog.commentSuccess'));
      setNewComment('');
      await fetchComments(post.id);
    }
    setSubmittingComment(false);
  };

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const timeAgo = (d: string) => {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return t('prayerWall.minutesAgo', { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t('prayerWall.hoursAgo', { count: hrs });
    return t('prayerWall.daysAgo', { count: Math.floor(hrs / 24) });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <div className="container">{t('blog.loading')}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <div className="container">
          <p className="text-2xl mb-4">📖</p>
          <p className="text-muted-foreground mb-4">{t('blog.notFound')}</p>
          <Link to="/word" className="text-primary hover:underline">{t('blog.backToWord')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="py-16" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.08) 0%, transparent 60%)' }}>
        <div className="container max-w-[800px]">
          <Link to="/word" className="text-primary text-sm hover:underline mb-4 inline-block">{t('blog.backToWord')}</Link>

          {category && (
            <span className="inline-block px-2.5 py-0.5 bg-gold-dim text-primary rounded-full text-[0.75rem] font-bold mb-3 ml-3">
              {category.icon} {category.name}
            </span>
          )}

          <h1 className="font-serif text-foreground text-3xl md:text-4xl leading-tight mb-4">{post.title}</h1>

          <div className="flex gap-4 flex-wrap text-[0.85rem] text-muted-foreground">
            <span>📅 {formatDate(post.published_at || post.created_at)}</span>
            <span>❤️ {post.like_count} {t('blog.likes')}</span>
            <span>👁 {post.view_count} {t('blog.views')}</span>
            <span>💬 {comments.length} {t('blog.comments')}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-[800px]">
          <div className="prose prose-invert max-w-none">
            {post.content
              .replace(/(\d+)\)\s*/g, '\n$1) ')
              .split(/\n{2,}|\n(?=\d+\))/)
              .filter(p => p.trim())
              .map((paragraph, i) => (
                <p key={i} className="text-muted-foreground text-base leading-[1.9] mb-4 whitespace-pre-line">
                  {paragraph.trim()}
                </p>
              ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-8 pt-6 border-t border-border">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gold-dim text-primary rounded-full text-[0.78rem] font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
            <span className="text-muted-foreground text-sm">{t('blog.share')}</span>
            {['𝕏', 'f', 'in'].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-full bg-gold-dim border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-serif text-primary text-xl mb-6">{t('blog.commentsTitle')} ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={user ? t('blog.commentPlaceholder') : t('blog.commentLoginPlaceholder')}
                disabled={!user}
                rows={3}
                className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-sm resize-y focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] disabled:opacity-50 mb-3"
              />
              <button
                type="submit"
                disabled={!user || submittingComment || !newComment.trim()}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm transition-all duration-300 hover:bg-gold-light disabled:opacity-50"
              >
                {submittingComment ? t('blog.commentSubmitting') : t('blog.commentSubmit')}
              </button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t('blog.noComments')}</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gold-dim border border-border flex items-center justify-center text-sm overflow-hidden">
                        {comment.profile?.avatar_url ? (
                          <img src={comment.profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : '👤'}
                      </div>
                      <span className="font-semibold text-foreground text-sm">
                        {comment.profile?.display_name || t('community.member')}
                      </span>
                      <span className="text-muted-foreground text-[0.75rem]">{timeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-serif text-primary text-xl mb-6">{t('blog.relatedPosts')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    to={`/word/${rp.slug}`}
                    className="bg-card border border-border rounded-xl p-4 no-underline transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <h4 className="text-foreground text-[0.9rem] font-semibold mb-2 leading-snug">{rp.title}</h4>
                    <p className="text-muted-foreground text-[0.8rem] line-clamp-2">{rp.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
