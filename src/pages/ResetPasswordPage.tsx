import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error(t('reset.mismatch')); return; }
    if (password.length < 6) { toast.error(t('reset.tooShort')); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast.error(error.message);
    else { toast.success(t('reset.success')); navigate('/'); }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-card border border-border rounded-2xl max-w-[420px] w-full p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-xl mx-auto mb-4">✦</div>
          <h1 className="font-serif text-primary text-xl mb-2">{t('reset.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('reset.waiting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card border border-border rounded-2xl max-w-[420px] w-full p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gold-dim border-[1.5px] border-primary flex items-center justify-center text-xl mx-auto mb-3">✦</div>
          <h1 className="font-serif text-primary text-xl">{t('reset.newTitle')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('reset.newSub')}</p>
        </div>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('reset.newPassword')}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] transition-all" />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('reset.confirmPassword')}</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] transition-all" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] disabled:opacity-50">
            {loading ? '...' : t('reset.btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;