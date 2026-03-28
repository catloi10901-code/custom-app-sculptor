import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const buildPrayUrl = (tab: string) => {
    if (pathname === "/pray") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      return `?${params.toString()}`;
    }
    return `/pray?tab=${tab}`;
  };

  const scrollToPartners = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("partners");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      const el = document.getElementById("partners");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error(t("footer.emailError"));
      return;
    }
    setSubscribing(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error) {
      if (error.code === "23505") {
        toast.info(t("footer.emailExists"));
      } else {
        toast.error(t("footer.emailFail"));
      }
    } else {
      toast.success(t("footer.emailSuccess"));
      setEmail("");
    }
    setSubscribing(false);
  };
  const socialLinks = [
    {
      href: "#",
      label: "X",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      href: "https://www.facebook.com/HolyPrayToday",
      label: "Facebook",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      href: "#",
      label: "LinkedIn",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      href: "https://www.youtube.com/@HolyPrayToday",
      label: "YouTube",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-card border-t border-border pt-14 pb-7">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center no-underline mb-3">
              <img src="/logo.png" alt="Holy Pray" className="h-12 w-auto object-contain" />
              <span className="font-serif text-2xl font-bold text-primary ml-2">HOLY Pray</span>
            </Link>
            <p className="text-[0.95rem] text-muted-foreground mt-2 max-w-[300px] leading-[1.7]">{t("footer.desc")}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-black/30 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold transition-all duration-300 hover:bg-gold-light disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                {t("footer.subscribe")}
              </button>
            </div>
            <div className="flex gap-3 mt-5">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-11 h-11 rounded-full bg-gold-dim border border-border flex items-center justify-center cursor-pointer transition-all duration-300 text-primary no-underline hover:bg-primary hover:text-primary-foreground"
                >
                  {item.svg}
                </a>
              ))}
            </div>
            {/* <div className="flex items-center gap-5 mt-5 flex-wrap">
              {[logo7center, logo9s, logoGifpp].map((logo, i) => (
                <img key={i} src={logo} alt={`Partner ${i + 1}`} className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-300 object-contain" />
              ))}
            </div> */}
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t("footer.impact")}</h4>
            <ul className="list-none space-y-2.5">
              <li>
                <Link to="/word" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.word")}
                </Link>
              </li>
              <li>
                <Link to={buildPrayUrl("campaigns")} className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.campaigns")}
                </Link>
              </li>
              <li>
                <Link to={buildPrayUrl("calendar")} className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.calendar")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t("footer.org")}</h4>
            <ul className="list-none space-y-2.5">
              <li>
                <Link to="/about" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.about")}
                </Link>
              </li>
              <li>
                <Link to="/impact" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.report")}
                </Link>
              </li>
              <li>
                <a href="/#partners" onClick={scrollToPartners} className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.partners")}
                </a>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.careers")}
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.news")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t("footer.legal")}</h4>
            <ul className="list-none space-y-2.5">
              <li>
                <Link to="/privacy" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.cookie")}
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.gdpr")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.82rem] text-muted-foreground">
          <span>{t("footer.copyright")}</span>
          <div className="flex gap-4 flex-wrap">
            <span>🔒 {t("footer.ssl")}</span>
            <span>🛡 {t("footer.gdpr2")}</span>
            <span>✦ {t("footer.nondenom")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
