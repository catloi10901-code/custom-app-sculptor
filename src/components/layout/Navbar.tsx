import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import GlobalSearch from './GlobalSearch';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/', label: 'nav.home' },
  { path: '/pray', label: 'nav.pray' },
  { path: '/impact', label: 'nav.impact' },
  { path: '/word', label: 'nav.word' },
  { path: '/library', label: 'nav.library' },
  { path: '/about', label: 'nav.about' },
  // { path: '/give', label: 'nav.give' },
];

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-[60px] backdrop-blur-[20px] border-b border-border transition-all duration-300 ${
          scrolled ? 'bg-blue-deep/95' : 'bg-[rgba(26,47,82,0.95)]'
        }`}
      >
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-base">✦</div>
            <span className="font-serif text-2xl font-bold text-primary">UNPray</span>
          </Link>

          <ul className="hidden md:flex items-center gap-0 list-none">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-2.5 py-1.5 rounded-md text-[0.8rem] font-medium transition-all duration-300 no-underline whitespace-nowrap ${
                    location.pathname === item.path
                      ? 'text-primary bg-gold-dim'
                      : 'text-muted-foreground hover:text-primary hover:bg-gold-dim'
                  }`}
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <GlobalSearch />
            <LanguageSwitcher />

            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-dim border border-primary/30 text-primary text-[0.82rem] font-semibold cursor-pointer transition-all hover:bg-primary/20"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{profile?.display_name || t('common.user')}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-[180px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[1001]">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-[0.85rem] text-foreground no-underline hover:bg-gold-dim hover:text-primary transition-all">
                      <User className="w-4 h-4" /> {t('nav.profile')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-[0.85rem] text-foreground no-underline hover:bg-gold-dim hover:text-primary transition-all">
                        <Shield className="w-4 h-4" /> {t('nav.admin')}
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-[0.85rem] text-foreground bg-transparent border-none cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border-[1.5px] border-primary bg-transparent text-primary text-[0.82rem] font-bold transition-all duration-300 cursor-pointer hover:bg-gold-dim hover:-translate-y-0.5"
              >
                {t('nav.login')}
              </button>
            )}

            <button
              className="flex md:hidden flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed top-[60px] left-0 right-0 bottom-0 bg-background z-[999] p-6 flex flex-col gap-2 overflow-y-auto md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-foreground no-underline text-lg font-semibold px-5 py-4 rounded-lg border border-border transition-all duration-300 ${
                location.pathname === item.path ? 'text-primary bg-gold-dim border-primary' : 'hover:text-primary hover:bg-gold-dim'
              }`}
            >
              {t(item.label)}
            </Link>
          ))}
          {!user ? (
            <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }} className="text-center mt-4 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-[0.95rem] shadow-[0_4px_20px_rgba(197,160,89,0.35)]">
              {t('nav.login')}
            </button>
          ) : (
            <button onClick={signOut} className="text-center mt-4 px-7 py-3.5 rounded-lg border border-border text-foreground font-bold text-[0.95rem]">
              {t('nav.logout')}
            </button>
          )}
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;