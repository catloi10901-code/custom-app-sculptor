import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { X, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('auth.resetEmailSent'));
        setMode('login');
      }
      setLoading(false);
      return;
    }

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('auth.loginSuccess'));
        onClose();
        if (adminLogin) {
          // Check admin role before navigating
          const { data: isAdminUser } = await supabase.rpc('has_role', { _user_id: (await supabase.auth.getUser()).data.user?.id!, _role: 'admin' });
          if (isAdminUser) {
            navigate('/admin');
          } else {
            toast.error('Bạn không có quyền admin');
          }
          setAdminLogin(false);
        }
      }
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('auth.signupSuccess'));
        setMode('login');
      }
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (mode === 'forgot') return t('auth.forgotPassword');
    return mode === 'login' ? t('auth.login') : t('auth.signup');
  };

  const getSubtitle = () => {
    if (mode === 'forgot') return t('auth.forgotSub');
    return mode === 'login' ? t('auth.loginSub') : t('auth.signupSub');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-[420px] mx-4 p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-xl mx-auto mb-3">✦</div>
          <h2 className="font-serif text-primary text-xl">{getTitle()}</h2>
          <p className="text-muted-foreground text-sm mt-1">{getSubtitle()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('auth.displayName')}</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] transition-all"
            />
          </div>
          {mode !== 'forgot' && (
            <div>
              <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('auth.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] transition-all"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] disabled:opacity-50"
          >
            {loading ? '...' : mode === 'forgot' ? t('auth.sendEmail') : mode === 'login' ? t('auth.loginBtn') : t('auth.signupBtn')}
          </button>
        </form>

        <div className="text-center mt-5 space-y-2">
          {mode === 'login' && (
            <button
              onClick={() => setMode('forgot')}
              className="block w-full text-muted-foreground text-[0.8rem] bg-transparent border-none cursor-pointer hover:text-primary hover:underline transition-colors"
            >
              {t('auth.forgotLink')}
            </button>
          )}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-primary text-[0.85rem] font-semibold bg-transparent border-none cursor-pointer hover:underline"
          >
            {mode === 'forgot' ? t('auth.backToLogin') : mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
          </button>
        </div>

        {/* Admin login */}
        {mode === 'login' && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setAdminLogin(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-secondary/50 border border-border text-muted-foreground text-[0.82rem] font-medium transition-all hover:text-primary hover:border-primary/40 hover:bg-secondary"
            >
              <Shield className="w-4 h-4" />
              Đăng nhập Admin
            </button>
            {adminLogin && (
              <p className="text-xs text-primary mt-2 text-center animate-fade-in">
                ✦ Nhập thông tin admin rồi bấm Đăng nhập
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;