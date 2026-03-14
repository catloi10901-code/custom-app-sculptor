import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import logo7center from '@/assets/logos/7center.png';
import logo9s from '@/assets/logos/9slogo.png';
import logoGifpp from '@/assets/logos/gifpp.png';
import logoPartner4 from '@/assets/logos/partner4.png';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error(t('footer.emailError'));
      return;
    }
    setSubscribing(true);
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    if (error) {
      if (error.code === '23505') {
        toast.info(t('footer.emailExists'));
      } else {
        toast.error(t('footer.emailFail'));
      }
    } else {
      toast.success(t('footer.emailSuccess'));
      setEmail('');
    }
    setSubscribing(false);
  };

  return (
    <footer className="bg-card border-t border-border pt-14 pb-7">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-3">
              <div className="w-9 h-9 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-base">✦</div>
              <span className="font-serif text-2xl font-bold text-primary">UNPray</span>
            </Link>
            <p className="text-[0.95rem] text-muted-foreground mt-3 max-w-[300px] leading-[1.7]">{t('footer.desc')}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-black/30 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
                onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
              />
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold transition-all duration-300 hover:bg-gold-light disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                {t('footer.subscribe')}
              </button>
            </div>
            <div className="flex gap-2.5 mt-4">
              {['𝕏', 'f', 'in', '📷', '▶'].map((icon, i) => (
                <a key={i} href="#" className="w-[38px] h-[38px] rounded-full bg-gold-dim border border-border flex items-center justify-center text-base cursor-pointer transition-all duration-300 text-primary no-underline hover:bg-primary hover:text-primary-foreground">
                  {icon}
                </a>
            ))}
            </div>
            <div className="flex items-center gap-5 mt-5 flex-wrap">
              {[logo7center, logo9s, logoGifpp, logoPartner4].map((logo, i) => (
                <img key={i} src={logo} alt={`Partner ${i + 1}`} className="h-8 opacity-70 hover:opacity-100 transition-opacity duration-300 object-contain" />
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t('footer.impact')}</h4>
            <ul className="list-none space-y-2.5">
              <li><a href="#" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">{t('footer.word')}</a></li>
              <li><Link to="/pray?tab=campaigns" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">{t('footer.campaigns')}</Link></li>
              <li><a href="#" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">{t('footer.calendar')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t('footer.org')}</h4>
            <ul className="list-none space-y-2.5">
              {[t('footer.about'), t('footer.report'), t('footer.partners'), t('footer.careers'), t('footer.news')].map((item) => (
                <li key={item}><a href="#" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-primary text-[0.9rem] mb-4 tracking-wide">{t('footer.legal')}</h4>
            <ul className="list-none space-y-2.5">
              {[t('footer.privacy'), t('footer.terms'), t('footer.cookie'), t('footer.gdpr'), t('footer.contact')].map((item) => (
                <li key={item}><a href="#" className="text-muted-foreground no-underline text-[0.9rem] transition-all duration-300 hover:text-primary">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.82rem] text-muted-foreground">
          <span>{t('footer.copyright')}</span>
          <div className="flex gap-4 flex-wrap">
            <span>🔒 {t('footer.ssl')}</span>
            <span>🛡 {t('footer.gdpr2')}</span>
            <span>✦ {t('footer.nondenom')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;