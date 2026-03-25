import sevenCenterLogo from "@/assets/logos/7center.png";
import ninesLogo from "@/assets/logos/9slogo.png";
import gifppLogo from "@/assets/logos/gifpp.png";
import { useTranslation } from "react-i18next";

const partners = [
  { src: gifppLogo, alt: "GIFPP", href: "https://gifpp.net" },
  { src: ninesLogo, alt: "9S", href: "https://9sunion.com" },
  { src: sevenCenterLogo, alt: "7 Center", href: "https://7center.com" },
];

const MARQUEE_THRESHOLD = 5;

const PartnerLogosSection = () => {
  const { t } = useTranslation();
  const useMarquee = partners.length > MARQUEE_THRESHOLD;

  const logoList = partners.map((partner) => (
    <a key={partner.alt} href={partner.href} className="opacity-70 hover:opacity-100 transition-opacity duration-300 shrink-0" target="_blank" rel="noopener noreferrer">
      <img src={partner.src} alt={partner.alt} className="h-20 object-contain" />
    </a>
  ));

  return (
    <section id="partners" className="py-16 ">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-serif text-primary mb-2">{t("section.partners.title", "Đối Tác")}</h2>
          <p className="text-muted-foreground text-balance">{t("section.partners.sub", "Các tổ chức đồng hành cùng chúng tôi")}</p>
        </div>

        {useMarquee ? (
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-16 animate-marquee w-max">
              {logoList}
              {logoList}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-10">{logoList}</div>
        )}
      </div>
    </section>
  );
};

export default PartnerLogosSection;
