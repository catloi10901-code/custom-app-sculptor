import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', native: 'Vietnamese' },
  { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español', native: 'Spanish' },
  { code: 'pt', flag: '🇧🇷', name: 'Português', native: 'Portuguese' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', native: 'French' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', native: 'German' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', native: 'Italian' },
  { code: 'zh', flag: '🇨🇳', name: '中文', native: 'Chinese' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', native: 'Japanese' },
  { code: 'ko', flag: '🇰🇷', name: '한국어', native: 'Korean' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी', native: 'Hindi' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', native: 'Russian' },
  { code: 'id', flag: '🇮🇩', name: 'Indonesia', native: 'Indonesian' },
  { code: 'th', flag: '🇹🇭', name: 'ไทย', native: 'Thai' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', native: 'Arabic' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
    // Set RTL for Arabic
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    // Set lang class for font
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    if (['zh', 'ja', 'hi', 'th'].includes(code)) {
      document.body.classList.add(`lang-${code}`);
    }
  };

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-gold-dim border border-border text-foreground px-3 py-[7px] rounded-lg text-[0.82rem] font-semibold cursor-pointer transition-all duration-300 hover:border-primary hover:text-primary"
      >
        <span className="text-base">{currentLang.flag}</span>
        
        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-card border border-border rounded-2xl overflow-y-auto min-w-[185px] max-h-[360px] z-[2000] shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              className={`w-full flex items-center gap-2.5 px-4 py-[11px] cursor-pointer text-[0.88rem] transition-all duration-300 border-b border-border/30 last:border-b-0 ${
                lang.code === i18n.language
                  ? 'text-primary bg-gold-dim'
                  : 'text-muted-foreground hover:bg-gold-dim hover:text-primary'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 font-medium text-left">{lang.name}</span>
              <span className="text-[0.78rem] opacity-60">{lang.native}</span>
              {lang.code === i18n.language && <span className="text-primary text-[0.8rem]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
