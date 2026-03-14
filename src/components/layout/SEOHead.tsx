import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  type?: string;
}

const defaultMeta = {
  title: 'UNPray — Nền Tảng Cầu Nguyện Toàn Cầu',
  description: 'Kết nối hàng triệu người cầu nguyện trên toàn thế giới. Gửi lời cầu nguyện, tham gia cộng đồng đức tin, và tạo tác động tích cực.',
  ogImage: '/og-image.jpg',
};

const pageMeta: Record<string, SEOProps> = {
  '/': { title: 'UNPray — Nền Tảng Cầu Nguyện Toàn Cầu', description: defaultMeta.description },
  '/pray': { title: 'Cầu Nguyện | UNPray', description: 'Gửi lời cầu nguyện và hiệp lời với cộng đồng toàn cầu. Prayer Wall, Live Sessions, và Cộng đồng đức tin.' },
  '/impact': { title: 'Tác Động | UNPray', description: 'Xem tác động của UNPray trên toàn cầu. Câu chuyện thay đổi cuộc sống, dự án nhân đạo, và báo cáo minh bạch.' },
  '/word': { title: 'Lời Chúa | UNPray', description: 'Suy ngẫm, học hỏi và được nuôi dưỡng bởi Lời Ngài. Tĩnh nguyện, giảng dạy, và lời chứng.' },
  '/library': { title: 'Thư Viện | UNPray', description: 'Kho tàng lời cầu nguyện được phân loại theo chủ đề. Tìm kiếm và khám phá.' },
  '/about': { title: 'Về Chúng Tôi | UNPray', description: 'Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ UNPray. Kết nối thế giới qua cầu nguyện.' },
  '/give': { title: 'Dâng Hiến | UNPray', description: 'Dâng hiến cho các dự án nhân đạo. Mỗi đô la được phân bổ minh bạch.' },
  '/profile': { title: 'Hồ Sơ | UNPray', description: 'Quản lý hồ sơ cá nhân, xem lịch sử cầu nguyện và dâng hiến.' },
};

const SEOHead = ({ title, description, ogImage, type = 'website' }: SEOProps) => {
  const location = useLocation();
  const pageSeo = pageMeta[location.pathname] || {};
  const finalTitle = title || pageSeo.title || defaultMeta.title;
  const finalDesc = description || pageSeo.description || defaultMeta.description;
  const finalImage = ogImage || defaultMeta.ogImage;

  useEffect(() => {
    document.title = finalTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', finalDesc);
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDesc, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:type', type, true);
    setMeta('og:url', window.location.href, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDesc);

    // JSON-LD
    let ldScript = document.querySelector('#json-ld') as HTMLScriptElement;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'json-ld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'UNPray',
      url: window.location.origin,
      description: finalDesc,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${window.location.origin}/word?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }, [finalTitle, finalDesc, finalImage, type]);

  return null;
};

export default SEOHead;
