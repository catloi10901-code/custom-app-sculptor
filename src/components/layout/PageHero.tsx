import { supabase } from "@/integrations/supabase/client";
import { ReactNode, useEffect, useState } from "react";

export type HeroBgKey = "hero_bg_about" | "hero_bg_give" | "hero_bg_news" | "hero_bg_library" | "hero_bg_testimonials" | "hero_bg_impact" | "hero_bg_word";

interface Pill {
  icon: string;
  text: string;
}

interface PageHeroProps {
  badge: { icon: ReactNode; text: string };
  title: ReactNode;
  subtitle: string;
  pills?: Pill[];
  cta?: ReactNode;
  bgKey?: HeroBgKey;
  bgUrl?: string; // direct URL override — passes from backend/page
}

const PageHero = ({ badge, title, subtitle, pills, cta, bgKey, bgUrl }: PageHeroProps) => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    if (bgUrl) {
      setBgImage(bgUrl);
      return;
    }
    if (!bgKey) return;
    supabase
      .from("site_content")
      .select("content_value")
      .eq("content_key", bgKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content_value) setBgImage(data.content_value);
      });
  }, [bgKey, bgUrl]);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Blurred background image */}
      {bgImage && (
        <div className="absolute inset-0 overflow-hidden">
          <img src={bgImage} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(1px)", transform: "scale(1.1)", opacity: 0.6 }} />
        </div>
      )}
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, rgba(10,22,72,.50) 0%, rgba(27,59,168,.42) 52%, rgba(15,35,120,.50) 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-background pointer-events-none z-10" />

      <div className="container relative z-10 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-widest uppercase mb-6"
          style={{ animation: "fadeDown 0.8s ease both" }}
        >
          {badge.icon}
          {badge.text}
        </div>

        {/* Title */}
        <h1 className="font-serif text-primary mb-5" style={{ animation: "fadeUp 0.9s ease 0.2s both", fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg max-w-[640px] mx-auto leading-relaxed" style={{ animation: "fadeUp 0.9s ease 0.4s both" }}>
          {subtitle}
        </p>

        {/* Pills */}
        {pills && pills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-10" style={{ animation: "fadeUp 0.9s ease 0.6s both" }}>
            {pills.map((pill, i) => (
              <div key={i} className="flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/60 rounded-full px-4 py-2 text-[0.82rem] text-muted-foreground">
                <span>{pill.icon}</span>
                <span className="font-medium">{pill.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {cta && (
          <div className="mt-6" style={{ animation: "fadeUp 0.9s ease 0.7s both" }}>
            {cta}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
