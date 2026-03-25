import useHeroBgImage from "@/hooks/useHeroBgImage";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  status: string;
  cover_image: string | null;
  tags: string[] | null;
  like_count: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
  category_id: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const HINTS = ["Thi Thiên", "Phúc Âm", "Đức tin", "Ân điển"];

const WordPage = () => {
  const { t, i18n } = useTranslation();
  const heroBg = useHeroBgImage("hero_bg_word");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const locale = i18n.language === "vi" ? "vi-VN" : "en-US";

  useEffect(() => {
    const fetchData = async () => {
      const [catRes, postRes] = await Promise.all([
        supabase.from("blog_categories").select("*").match({ type: "word" }).order("sort_order"),
        supabase.from("blog_posts").select("*").match({ status: "published", post_type: "word" }).order("created_at", { ascending: false }).limit(50),
      ]);
      if (catRes.data) setCategories(catRes.data);
      if (postRes.data) setPosts(postRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = () => setSearchQuery(searchInput.trim());

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === "all" || p.category_id === activeCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = !activeTag || (p.tags || []).includes(activeTag);
    return matchCat && matchSearch && matchTag;
  });

  const isDefaultView = activeCategory === "all" && !searchQuery && !activeTag;
  const featured = isDefaultView && filtered.length > 0 ? filtered[0] : null;
  const gridPosts = featured ? filtered.slice(1) : filtered;

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))].slice(0, 12);
  const recentPosts = posts.slice(0, 5);

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  };
  const readTime = (excerpt: string | null) => {
    const words = (excerpt || "").split(" ").length;
    return t("word.readTime", { count: Math.max(3, Math.ceil(words / 40)) });
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-16 pb-20 text-center relative overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(10,22,72,.50) 0%, rgba(27,59,168,.42) 52%, rgba(15,35,120,.50) 100%)" }}>
        {heroBg && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={heroBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(3px)", transform: "scale(1.1)", opacity: 0.6 }} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />
        <div className="container relative z-[1]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1 rounded-full text-[0.65rem] font-black tracking-[3px] uppercase mb-5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t("word.title")}
          </div>

          {/* Title */}
          <h1 className="font-serif text-primary font-black leading-tight tracking-tight mb-3" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)" }}>
            {t("word.title")}
          </h1>
          <p className="text-white/70 text-lg max-w-[500px] mx-auto mb-8 leading-relaxed">{t("word.sub")}</p>

          {/* Search bar */}
          <div className="max-w-[660px] mx-auto">
            <div className="flex items-center rounded-full px-5 py-1.5 gap-3 transition-all" style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm lời Chúa, chủ đề, câu Kinh Thánh..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40 text-[0.97rem] py-3"
              />
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 bg-white text-blue-900 font-black text-[0.82rem] px-6 py-2.5 rounded-full hover:bg-blue-50 transition-all hover:scale-105 shrink-0 border-none cursor-pointer"
              >
                <Search className="w-3 h-3" />
                Tìm kiếm
              </button>
            </div>

            {/* Hints */}
            <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
              <span className="text-[0.72rem] text-white/40 font-black uppercase tracking-widest">Gợi ý:</span>
              {HINTS.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    setSearchInput(h);
                    setSearchQuery(h);
                  }}
                  className="bg-transparent border border-white/20 text-white/60 rounded-full px-3.5 py-1 text-[0.76rem] font-medium hover:bg-white/12 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                >
                  ✦ {h}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="flex items-center justify-center gap-0 mt-8 flex-wrap">
              <div className="flex flex-col items-center px-6">
                <strong className="font-serif text-white text-2xl font-black leading-none mb-0.5">{posts.length}</strong>
                <span className="text-[0.65rem] text-white/60 uppercase tracking-widest">Tin tức</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center px-6">
                <strong className="font-serif text-white text-2xl font-black leading-none mb-0.5">{categories.length}</strong>
                <span className="text-[0.65rem] text-white/60 uppercase tracking-widest">Chủ đề</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center px-6">
                <strong className="font-serif text-white text-2xl font-black leading-none mb-0.5">{allTags.length}</strong>
                <span className="text-[0.65rem] text-white/60 uppercase tracking-widest">Tags</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORY BAR ─────────────────────────────────────── */}
      <div className="sticky top-[60px] z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container">
          <div className="flex items-center gap-4">
            <span className="text-[0.62rem] font-black tracking-[2.5px] uppercase text-muted-foreground whitespace-nowrap shrink-0 py-4 flex items-center gap-3.5">
              Chủ Đề
              <span className="inline-block w-px h-3.5 bg-border" />
            </span>
            <div className="flex gap-1.5 py-3 overflow-x-auto scrollbar-hide flex-1 items-center">
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setActiveTag(null);
                }}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-[0.82rem] font-bold cursor-pointer transition-all whitespace-nowrap border-none ${
                  activeCategory === "all" && !activeTag
                    ? "bg-primary/20 text-primary shadow-md -translate-y-px"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:-translate-y-px"
                }`}
              >
                <span>✨</span>
                <span>Tất Cả</span>
                <span className={`text-[0.66rem] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeCategory === "all" && !activeTag ? "bg-primary/20" : "bg-white/10"}`}>
                  {posts.length}
                </span>
              </button>
              {categories.map((c) => {
                const cnt = posts.filter((p) => p.category_id === c.id).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCategory(c.id);
                      setActiveTag(null);
                    }}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[0.82rem] font-bold cursor-pointer transition-all whitespace-nowrap border-none ${
                      activeCategory === c.id
                        ? "bg-primary/20 text-primary shadow-md -translate-y-px"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:-translate-y-px"
                    }`}
                  >
                    {c.icon && <span>{c.icon}</span>}
                    <span>{c.name}</span>
                    <span className={`text-[0.66rem] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeCategory === c.id ? "bg-primary/20" : "bg-white/10"}`}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section className="py-8">
        <div className="container">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">{t("word.loading")}</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-2xl mb-2">📖</p>
              <p>{t("word.empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_308px] gap-7 items-start">
              {/* ── MAIN ── */}
              <main>
                {/* Section label */}
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-1 h-[18px] bg-primary rounded-sm shrink-0" />
                  <span className="text-[0.65rem] font-black tracking-[3px] uppercase text-primary">{searchQuery ? `Kết quả: "${searchQuery}"` : "BÀI VIẾT MỚI NHẤT"}</span>
                </div>

                {/* Featured */}
                {featured && (
                  <Link
                    to={`/word/${featured.slug}`}
                    className="no-underline block bg-card border border-border rounded-2xl overflow-hidden mb-5 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,0,0,.3)] transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="h-[220px] md:h-auto bg-gradient-to-br from-primary/30 to-card flex items-center justify-center text-5xl overflow-hidden relative">
                        {featured.cover_image ? <img src={featured.cover_image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" /> : "📖"}
                        <span className="absolute top-3 left-3 inline-block px-2.5 py-0.5 bg-primary text-background rounded-full text-[0.72rem] font-black">{t("word.featured")}</span>
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        {featured.category_id &&
                          (() => {
                            const cat = categories.find((c) => c.id === featured.category_id);
                            return cat ? (
                              <span className="inline-block px-2 py-0.5 bg-gold-dim text-primary rounded-full text-[0.72rem] font-bold mb-2 w-fit">
                                {cat.icon} {cat.name}
                              </span>
                            ) : null;
                          })()}
                        <h2 className="font-serif text-foreground text-xl mb-2.5 leading-snug">{featured.title}</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                        <div className="flex gap-4 flex-wrap text-[0.75rem] text-muted-foreground">
                          <span>{formatDate(featured.published_at || featured.created_at)}</span>
                          <span>⏱ {readTime(featured.excerpt)}</span>
                          <span>❤️ {featured.like_count}</span>
                          <span>👁 {featured.view_count}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid */}
                {gridPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gridPosts.map((post) => {
                      const cat = categories.find((c) => c.id === post.category_id);
                      return (
                        <Link
                          key={post.id}
                          to={`/word/${post.slug}`}
                          className="no-underline bg-card border border-border rounded-2xl overflow-hidden hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_40px_rgba(0,0,0,.3)] transition-all duration-200 flex flex-col"
                        >
                          <div className="h-[160px] bg-gradient-to-br from-primary/20 to-card flex items-center justify-center text-4xl overflow-hidden relative">
                            {post.cover_image ? <img src={post.cover_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" /> : "📖"}
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            {cat && (
                              <span className="inline-block px-2 py-0.5 bg-gold-dim text-primary rounded-full text-[0.72rem] font-bold mb-2 w-fit">
                                {cat.icon} {cat.name}
                              </span>
                            )}
                            <h3 className="text-foreground text-[0.95rem] font-semibold mb-1.5 leading-snug">{post.title}</h3>
                            <p className="text-muted-foreground text-[0.85rem] leading-relaxed mb-3 line-clamp-2 flex-1">{post.excerpt}</p>
                            <div className="flex gap-3 text-[0.75rem] text-muted-foreground">
                              <span>{formatDate(post.published_at || post.created_at)}</span>
                              <span>⏱ {readTime(post.excerpt)}</span>
                              <span>❤️ {post.like_count}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  !featured && (
                    <div className="text-center py-16 text-muted-foreground">
                      <p className="text-2xl mb-2">🔍</p>
                      <p>Không tìm thấy kết quả</p>
                    </div>
                  )
                )}
              </main>

              {/* ── SIDEBAR ── */}
              <aside className="flex flex-col gap-4 lg:sticky lg:top-[100px]">
                {/* Daily Verse */}
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-5">
                  <p className="text-[0.8rem] font-black text-primary uppercase tracking-[1.5px] mb-3 pb-2.5 border-b border-primary/15">📖 Câu Gốc Hôm Nay</p>
                  <p className="italic text-foreground/80 text-[0.92rem] leading-[1.7] mb-2 font-serif">{t("word.verse.text")}</p>
                  <p className="text-[0.75rem] font-bold text-primary">{t("word.verse.ref")}</p>
                </div>
                {categories.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-[0.8rem] font-black text-primary uppercase tracking-[1.5px] mb-3 pb-2.5 border-b border-border">📂 Chủ Đề</p>
                    <div className="flex flex-col gap-0.5">
                      {categories.map((c) => {
                        const cnt = posts.filter((p) => p.category_id === c.id).length;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              setActiveCategory(c.id === activeCategory ? "all" : c.id);
                              setActiveTag(null);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[0.85rem] font-medium cursor-pointer transition-all text-left border-none ${
                              activeCategory === c.id ? "bg-primary/15 text-primary" : "bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            }`}
                          >
                            <span>
                              {c.icon} {c.name}
                            </span>
                            <span className="text-[0.72rem] font-bold opacity-60">{cnt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Newsletter */}
                <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, rgba(14,31,112,.9), rgba(27,59,168,.6))", border: "1px solid rgba(197,160,89,.2)" }}>
                  <p className="text-primary text-xl mb-2">✦</p>
                  <p className="font-serif text-foreground font-bold text-[1rem] mb-1.5">Nhận Lời Chúa Mỗi Sáng</p>
                  <p className="text-muted-foreground text-[0.8rem] mb-3.5 leading-relaxed">Tin tức mới nhất gửi đến hộp thư của bạn</p>
                  <input
                    type="email"
                    placeholder="Email của bạn..."
                    className="w-full px-4 py-2.5 rounded-full text-[0.85rem] mb-2 outline-none border-none"
                    style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}
                  />
                  <button className="w-full py-2.5 rounded-full bg-primary text-background font-black text-[0.82rem] hover:opacity-90 transition-opacity cursor-pointer border-none">
                    Đăng Ký Miễn Phí
                  </button>
                </div>

                {/* Tags */}
                {allTags.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <p className="text-[0.8rem] font-black text-primary uppercase tracking-[1.5px] mb-3 pb-2.5 border-b border-border">🏷️ Tags Phổ Biến</p>
                    <div className="flex flex-wrap gap-1.5">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                          className={`px-3 py-1 rounded-full border text-[0.76rem] font-semibold cursor-pointer transition-all ${
                            activeTag === tag
                              ? "bg-primary border-primary text-background"
                              : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-gold-dim"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent posts */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <p className="text-[0.8rem] font-black text-primary uppercase tracking-[1.5px] mb-3 pb-2.5 border-b border-border">🕐 Tin Tức Mới</p>
                  <div className="flex flex-col gap-3">
                    {recentPosts.map((p) => (
                      <Link key={p.id} to={`/word/${p.slug}`} className="no-underline flex items-start gap-3 group">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-card flex items-center justify-center text-xl shrink-0 overflow-hidden relative">
                          {p.cover_image ? <img src={p.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover" /> : "📖"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground text-[0.82rem] font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">{p.title}</p>
                          <p className="text-muted-foreground text-[0.72rem] mt-0.5">{formatDate(p.published_at || p.created_at)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories */}
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WordPage;
