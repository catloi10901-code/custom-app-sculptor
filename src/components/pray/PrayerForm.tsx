import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PrayerFormProps {
  onSuccess: () => void;
}

const PrayerForm = ({ onSuccess }: PrayerFormProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formTopic, setFormTopic] = useState('peace');
  const [formContent, setFormContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error(t('prayerWall.loginSubmit')); return; }
    if (!formContent.trim()) { toast.error(t('prayerWall.contentRequired')); return; }

    setSubmitting(true);
    const { error } = await supabase.from('prayers').insert({
      name: formName || t('prayerWall.anonymous'),
      country: formCountry || null,
      topic: formTopic,
      content: formContent,
      user_id: user.id,
      is_anonymous: !formName,
    });

    if (error) { toast.error(t('prayerWall.submitError')); console.error(error); }
    else { toast.success(t('prayerWall.submitSuccess')); setFormName(''); setFormCountry(''); setFormTopic('peace'); setFormContent(''); onSuccess(); }
    setSubmitting(false);
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prayer', { body: { topic: formTopic, language: 'vi' } });
      if (error) throw error;
      if (data?.prayer) { setFormContent(data.prayer); toast.success(t('prayerWall.aiSuccess')); }
    } catch (err: any) { console.error(err); toast.error(err?.message || t('prayerWall.aiFail')); }
    setAiGenerating(false);
  };

  return (
    <form id="submit-form" onSubmit={handleSubmit} className="bg-card border border-primary rounded-2xl p-8">
      <h3 className="font-serif text-primary mb-5 text-xl">{t('prayerWall.formTitle')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[0.85rem] font-bold text-muted-foreground mb-2">{t('prayerWall.yourName')}</label>
          <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)]" />
        </div>
        <div>
          <label className="block text-[0.85rem] font-bold text-muted-foreground mb-2">{t('profile.country')}</label>
          <select value={formCountry} onChange={e => setFormCountry(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] transition-all duration-300 focus:outline-none focus:border-primary">
            <option value="">{t('prayerWall.selectCountry')}</option>
            <option>🇻🇳 Việt Nam</option>
            <option>🇺🇸 USA</option>
            <option>🇬🇧 UK</option>
            <option>🇰🇷 Korea</option>
            <option>🇯🇵 Japan</option>
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[0.85rem] font-bold text-muted-foreground mb-2">{t('prayerWall.topic')}</label>
        <select value={formTopic} onChange={e => setFormTopic(e.target.value)} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] transition-all duration-300 focus:outline-none focus:border-primary">
          <option value="peace">{t('topic.peace')}</option>
          <option value="poverty">{t('topic.poverty')}</option>
          <option value="healing">{t('topic.healing')}</option>
          <option value="family">{t('topic.family')}</option>
          <option value="nation">{t('topic.nation')}</option>
          <option value="prosperity">{t('topic.prosperity')}</option>
        </select>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[0.85rem] font-bold text-muted-foreground">{t('prayerWall.prayerContent')}</label>
          <button type="button" onClick={handleAiGenerate} disabled={aiGenerating} className="text-[0.78rem] text-primary hover:underline disabled:opacity-50">
            {aiGenerating ? t('prayerWall.aiGenerating') : t('prayerWall.aiSuggest')}
          </button>
        </div>
        <textarea rows={4} value={formContent} onChange={e => setFormContent(e.target.value)} placeholder={t('prayerWall.placeholder')} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] resize-y min-h-[110px] transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)]" />
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] disabled:opacity-50">
        {submitting ? t('prayerWall.submitting') : t('prayerWall.submitBtn')}
      </button>
    </form>
  );
};

export default PrayerForm;
