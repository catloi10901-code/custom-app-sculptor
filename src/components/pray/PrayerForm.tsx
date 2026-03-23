import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

interface PrayerFormProps {
  onSuccess: () => void;
  defaultTopic?: string;
}

const PrayerForm = ({ onSuccess, defaultTopic }: PrayerFormProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formTopic, setFormTopic] = useState(defaultTopic || 'peace');
  const [formContent, setFormContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 180)}px`;
  }, []);

  const countries = [
    { value: '🇦🇫 Afghanistan', label: '🇦🇫 Afghanistan' },
    { value: '🇦🇱 Albania', label: '🇦🇱 Albania' },
    { value: '🇩🇿 Algeria', label: '🇩🇿 Algeria' },
    { value: '🇦🇩 Andorra', label: '🇦🇩 Andorra' },
    { value: '🇦🇴 Angola', label: '🇦🇴 Angola' },
    { value: '🇦🇬 Antigua and Barbuda', label: '🇦🇬 Antigua and Barbuda' },
    { value: '🇦🇷 Argentina', label: '🇦🇷 Argentina' },
    { value: '🇦🇲 Armenia', label: '🇦🇲 Armenia' },
    { value: '🇦🇺 Australia', label: '🇦🇺 Australia' },
    { value: '🇦🇹 Austria', label: '🇦🇹 Austria' },
    { value: '🇦🇿 Azerbaijan', label: '🇦🇿 Azerbaijan' },
    { value: '🇧🇸 Bahamas', label: '🇧🇸 Bahamas' },
    { value: '🇧🇭 Bahrain', label: '🇧🇭 Bahrain' },
    { value: '🇧🇩 Bangladesh', label: '🇧🇩 Bangladesh' },
    { value: '🇧🇧 Barbados', label: '🇧🇧 Barbados' },
    { value: '🇧🇾 Belarus', label: '🇧🇾 Belarus' },
    { value: '🇧🇪 Belgium', label: '🇧🇪 Belgium' },
    { value: '🇧🇿 Belize', label: '🇧🇿 Belize' },
    { value: '🇧🇯 Benin', label: '🇧🇯 Benin' },
    { value: '🇧🇹 Bhutan', label: '🇧🇹 Bhutan' },
    { value: '🇧🇴 Bolivia', label: '🇧🇴 Bolivia' },
    { value: '🇧🇦 Bosnia and Herzegovina', label: '🇧🇦 Bosnia and Herzegovina' },
    { value: '🇧🇼 Botswana', label: '🇧🇼 Botswana' },
    { value: '🇧🇷 Brazil', label: '🇧🇷 Brazil' },
    { value: '🇧🇳 Brunei', label: '🇧🇳 Brunei' },
    { value: '🇧🇬 Bulgaria', label: '🇧🇬 Bulgaria' },
    { value: '🇧🇫 Burkina Faso', label: '🇧🇫 Burkina Faso' },
    { value: '🇧🇮 Burundi', label: '🇧🇮 Burundi' },
    { value: '🇨🇻 Cabo Verde', label: '🇨🇻 Cabo Verde' },
    { value: '🇰🇭 Cambodia', label: '🇰🇭 Cambodia' },
    { value: '🇨🇲 Cameroon', label: '🇨🇲 Cameroon' },
    { value: '🇨🇦 Canada', label: '🇨🇦 Canada' },
    { value: '🇨🇫 Central African Republic', label: '🇨🇫 Central African Republic' },
    { value: '🇹🇩 Chad', label: '🇹🇩 Chad' },
    { value: '🇨🇱 Chile', label: '🇨🇱 Chile' },
    { value: '🇨🇳 China', label: '🇨🇳 China' },
    { value: '🇨🇴 Colombia', label: '🇨🇴 Colombia' },
    { value: '🇰🇲 Comoros', label: '🇰🇲 Comoros' },
    { value: '🇨🇩 Congo (DRC)', label: '🇨🇩 Congo (DRC)' },
    { value: '🇨🇬 Congo (Republic)', label: '🇨🇬 Congo (Republic)' },
    { value: '🇨🇷 Costa Rica', label: '🇨🇷 Costa Rica' },
    { value: '🇭🇷 Croatia', label: '🇭🇷 Croatia' },
    { value: '🇨🇺 Cuba', label: '🇨🇺 Cuba' },
    { value: '🇨🇾 Cyprus', label: '🇨🇾 Cyprus' },
    { value: '🇨🇿 Czech Republic', label: '🇨🇿 Czech Republic' },
    { value: '🇩🇰 Denmark', label: '🇩🇰 Denmark' },
    { value: '🇩🇯 Djibouti', label: '🇩🇯 Djibouti' },
    { value: '🇩🇲 Dominica', label: '🇩🇲 Dominica' },
    { value: '🇩🇴 Dominican Republic', label: '🇩🇴 Dominican Republic' },
    { value: '🇪🇨 Ecuador', label: '🇪🇨 Ecuador' },
    { value: '🇪🇬 Egypt', label: '🇪🇬 Egypt' },
    { value: '🇸🇻 El Salvador', label: '🇸🇻 El Salvador' },
    { value: '🇬🇶 Equatorial Guinea', label: '🇬🇶 Equatorial Guinea' },
    { value: '🇪🇷 Eritrea', label: '🇪🇷 Eritrea' },
    { value: '🇪🇪 Estonia', label: '🇪🇪 Estonia' },
    { value: '🇸🇿 Eswatini', label: '🇸🇿 Eswatini' },
    { value: '🇪🇹 Ethiopia', label: '🇪🇹 Ethiopia' },
    { value: '🇫🇯 Fiji', label: '🇫🇯 Fiji' },
    { value: '🇫🇮 Finland', label: '🇫🇮 Finland' },
    { value: '🇫🇷 France', label: '🇫🇷 France' },
    { value: '🇬🇦 Gabon', label: '🇬🇦 Gabon' },
    { value: '🇬🇲 Gambia', label: '🇬🇲 Gambia' },
    { value: '🇬🇪 Georgia', label: '🇬🇪 Georgia' },
    { value: '🇩🇪 Germany', label: '🇩🇪 Germany' },
    { value: '🇬🇭 Ghana', label: '🇬🇭 Ghana' },
    { value: '🇬🇷 Greece', label: '🇬🇷 Greece' },
    { value: '🇬🇩 Grenada', label: '🇬🇩 Grenada' },
    { value: '🇬🇹 Guatemala', label: '🇬🇹 Guatemala' },
    { value: '🇬🇳 Guinea', label: '🇬🇳 Guinea' },
    { value: '🇬🇼 Guinea-Bissau', label: '🇬🇼 Guinea-Bissau' },
    { value: '🇬🇾 Guyana', label: '🇬🇾 Guyana' },
    { value: '🇭🇹 Haiti', label: '🇭🇹 Haiti' },
    { value: '🇭🇳 Honduras', label: '🇭🇳 Honduras' },
    { value: '🇭🇺 Hungary', label: '🇭🇺 Hungary' },
    { value: '🇮🇸 Iceland', label: '🇮🇸 Iceland' },
    { value: '🇮🇳 India', label: '🇮🇳 India' },
    { value: '🇮🇩 Indonesia', label: '🇮🇩 Indonesia' },
    { value: '🇮🇷 Iran', label: '🇮🇷 Iran' },
    { value: '🇮🇶 Iraq', label: '🇮🇶 Iraq' },
    { value: '🇮🇪 Ireland', label: '🇮🇪 Ireland' },
    { value: '🇮🇱 Israel', label: '🇮🇱 Israel' },
    { value: '🇮🇹 Italy', label: '🇮🇹 Italy' },
    { value: '🇯🇲 Jamaica', label: '🇯🇲 Jamaica' },
    { value: '🇯🇵 Japan', label: '🇯🇵 Japan' },
    { value: '🇯🇴 Jordan', label: '🇯🇴 Jordan' },
    { value: '🇰🇿 Kazakhstan', label: '🇰🇿 Kazakhstan' },
    { value: '🇰🇪 Kenya', label: '🇰🇪 Kenya' },
    { value: '🇰🇮 Kiribati', label: '🇰🇮 Kiribati' },
    { value: '🇰🇼 Kuwait', label: '🇰🇼 Kuwait' },
    { value: '🇰🇬 Kyrgyzstan', label: '🇰🇬 Kyrgyzstan' },
    { value: '🇱🇦 Laos', label: '🇱🇦 Laos' },
    { value: '🇱🇻 Latvia', label: '🇱🇻 Latvia' },
    { value: '🇱🇧 Lebanon', label: '🇱🇧 Lebanon' },
    { value: '🇱🇸 Lesotho', label: '🇱🇸 Lesotho' },
    { value: '🇱🇷 Liberia', label: '🇱🇷 Liberia' },
    { value: '🇱🇾 Libya', label: '🇱🇾 Libya' },
    { value: '🇱🇮 Liechtenstein', label: '🇱🇮 Liechtenstein' },
    { value: '🇱🇹 Lithuania', label: '🇱🇹 Lithuania' },
    { value: '🇱🇺 Luxembourg', label: '🇱🇺 Luxembourg' },
    { value: '🇲🇬 Madagascar', label: '🇲🇬 Madagascar' },
    { value: '🇲🇼 Malawi', label: '🇲🇼 Malawi' },
    { value: '🇲🇾 Malaysia', label: '🇲🇾 Malaysia' },
    { value: '🇲🇻 Maldives', label: '🇲🇻 Maldives' },
    { value: '🇲🇱 Mali', label: '🇲🇱 Mali' },
    { value: '🇲🇹 Malta', label: '🇲🇹 Malta' },
    { value: '🇲🇭 Marshall Islands', label: '🇲🇭 Marshall Islands' },
    { value: '🇲🇷 Mauritania', label: '🇲🇷 Mauritania' },
    { value: '🇲🇺 Mauritius', label: '🇲🇺 Mauritius' },
    { value: '🇲🇽 Mexico', label: '🇲🇽 Mexico' },
    { value: '🇫🇲 Micronesia', label: '🇫🇲 Micronesia' },
    { value: '🇲🇩 Moldova', label: '🇲🇩 Moldova' },
    { value: '🇲🇨 Monaco', label: '🇲🇨 Monaco' },
    { value: '🇲🇳 Mongolia', label: '🇲🇳 Mongolia' },
    { value: '🇲🇪 Montenegro', label: '🇲🇪 Montenegro' },
    { value: '🇲🇦 Morocco', label: '🇲🇦 Morocco' },
    { value: '🇲🇿 Mozambique', label: '🇲🇿 Mozambique' },
    { value: '🇲🇲 Myanmar', label: '🇲🇲 Myanmar' },
    { value: '🇳🇦 Namibia', label: '🇳🇦 Namibia' },
    { value: '🇳🇷 Nauru', label: '🇳🇷 Nauru' },
    { value: '🇳🇵 Nepal', label: '🇳🇵 Nepal' },
    { value: '🇳🇱 Netherlands', label: '🇳🇱 Netherlands' },
    { value: '🇳🇿 New Zealand', label: '🇳🇿 New Zealand' },
    { value: '🇳🇮 Nicaragua', label: '🇳🇮 Nicaragua' },
    { value: '🇳🇪 Niger', label: '🇳🇪 Niger' },
    { value: '🇳🇬 Nigeria', label: '🇳🇬 Nigeria' },
    { value: '🇰🇵 North Korea', label: '🇰🇵 North Korea' },
    { value: '🇲🇰 North Macedonia', label: '🇲🇰 North Macedonia' },
    { value: '🇳🇴 Norway', label: '🇳🇴 Norway' },
    { value: '🇴🇲 Oman', label: '🇴🇲 Oman' },
    { value: '🇵🇰 Pakistan', label: '🇵🇰 Pakistan' },
    { value: '🇵🇼 Palau', label: '🇵🇼 Palau' },
    { value: '🇵🇦 Panama', label: '🇵🇦 Panama' },
    { value: '🇵🇬 Papua New Guinea', label: '🇵🇬 Papua New Guinea' },
    { value: '🇵🇾 Paraguay', label: '🇵🇾 Paraguay' },
    { value: '🇵🇪 Peru', label: '🇵🇪 Peru' },
    { value: '🇵🇭 Philippines', label: '🇵🇭 Philippines' },
    { value: '🇵🇱 Poland', label: '🇵🇱 Poland' },
    { value: '🇵🇹 Portugal', label: '🇵🇹 Portugal' },
    { value: '🇶🇦 Qatar', label: '🇶🇦 Qatar' },
    { value: '🇷🇴 Romania', label: '🇷🇴 Romania' },
    { value: '🇷🇺 Russia', label: '🇷🇺 Russia' },
    { value: '🇷🇼 Rwanda', label: '🇷🇼 Rwanda' },
    { value: '🇰🇳 Saint Kitts and Nevis', label: '🇰🇳 Saint Kitts and Nevis' },
    { value: '🇱🇨 Saint Lucia', label: '🇱🇨 Saint Lucia' },
    { value: '🇻🇨 Saint Vincent and the Grenadines', label: '🇻🇨 Saint Vincent and the Grenadines' },
    { value: '🇼🇸 Samoa', label: '🇼🇸 Samoa' },
    { value: '🇸🇲 San Marino', label: '🇸🇲 San Marino' },
    { value: '🇸🇹 Sao Tome and Principe', label: '🇸🇹 Sao Tome and Principe' },
    { value: '🇸🇦 Saudi Arabia', label: '🇸🇦 Saudi Arabia' },
    { value: '🇸🇳 Senegal', label: '🇸🇳 Senegal' },
    { value: '🇷🇸 Serbia', label: '🇷🇸 Serbia' },
    { value: '🇸🇨 Seychelles', label: '🇸🇨 Seychelles' },
    { value: '🇸🇱 Sierra Leone', label: '🇸🇱 Sierra Leone' },
    { value: '🇸🇬 Singapore', label: '🇸🇬 Singapore' },
    { value: '🇸🇰 Slovakia', label: '🇸🇰 Slovakia' },
    { value: '🇸🇮 Slovenia', label: '🇸🇮 Slovenia' },
    { value: '🇸🇧 Solomon Islands', label: '🇸🇧 Solomon Islands' },
    { value: '🇸🇴 Somalia', label: '🇸🇴 Somalia' },
    { value: '🇿🇦 South Africa', label: '🇿🇦 South Africa' },
    { value: '🇸🇸 South Sudan', label: '🇸🇸 South Sudan' },
    { value: '🇰🇷 South Korea', label: '🇰🇷 South Korea' },
    { value: '🇪🇸 Spain', label: '🇪🇸 Spain' },
    { value: '🇱🇰 Sri Lanka', label: '🇱🇰 Sri Lanka' },
    { value: '🇸🇩 Sudan', label: '🇸🇩 Sudan' },
    { value: '🇸🇷 Suriname', label: '🇸🇷 Suriname' },
    { value: '🇸🇪 Sweden', label: '🇸🇪 Sweden' },
    { value: '🇨🇭 Switzerland', label: '🇨🇭 Switzerland' },
    { value: '🇸🇾 Syria', label: '🇸🇾 Syria' },
    { value: '🇹🇼 Taiwan', label: '🇹🇼 Taiwan' },
    { value: '🇹🇯 Tajikistan', label: '🇹🇯 Tajikistan' },
    { value: '🇹🇿 Tanzania', label: '🇹🇿 Tanzania' },
    { value: '🇹🇭 Thailand', label: '🇹🇭 Thailand' },
    { value: '🇹🇱 Timor-Leste', label: '🇹🇱 Timor-Leste' },
    { value: '🇹🇬 Togo', label: '🇹🇬 Togo' },
    { value: '🇹🇴 Tonga', label: '🇹🇴 Tonga' },
    { value: '🇹🇹 Trinidad and Tobago', label: '🇹🇹 Trinidad and Tobago' },
    { value: '🇹🇳 Tunisia', label: '🇹🇳 Tunisia' },
    { value: '🇹🇷 Turkey', label: '🇹🇷 Turkey' },
    { value: '🇹🇲 Turkmenistan', label: '🇹🇲 Turkmenistan' },
    { value: '🇹🇻 Tuvalu', label: '🇹🇻 Tuvalu' },
    { value: '🇺🇬 Uganda', label: '🇺🇬 Uganda' },
    { value: '🇺🇦 Ukraine', label: '🇺🇦 Ukraine' },
    { value: '🇦🇪 United Arab Emirates', label: '🇦🇪 United Arab Emirates' },
    { value: '🇬🇧 United Kingdom', label: '🇬🇧 United Kingdom' },
    { value: '🇺🇸 United States', label: '🇺🇸 United States' },
    { value: '🇺🇾 Uruguay', label: '🇺🇾 Uruguay' },
    { value: '🇺🇿 Uzbekistan', label: '🇺🇿 Uzbekistan' },
    { value: '🇻🇺 Vanuatu', label: '🇻🇺 Vanuatu' },
    { value: '🇻🇦 Vatican City', label: '🇻🇦 Vatican City' },
    { value: '🇻🇪 Venezuela', label: '🇻🇪 Venezuela' },
    { value: '🇻🇳 Việt Nam', label: '🇻🇳 Việt Nam' },
    { value: '🇾🇪 Yemen', label: '🇾🇪 Yemen' },
    { value: '🇿🇲 Zambia', label: '🇿🇲 Zambia' },
    { value: '🇿🇼 Zimbabwe', label: '🇿🇼 Zimbabwe' },
  ];

  const topics = [
    { value: 'peace', icon: '☮️' },
    { value: 'poverty', icon: '🤲' },
    { value: 'healing', icon: '💚' },
    { value: 'family', icon: '👨‍👩‍👧‍👦' },
    { value: 'nation', icon: '🏛️' },
    { value: 'prosperity', icon: '✨' },
  ];

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
    else { toast.success(t('prayerWall.submitSuccess')); setFormName(''); setFormCountry(''); setFormTopic('peace'); setFormContent(''); if (textareaRef.current) { textareaRef.current.style.height = 'auto'; } onSuccess(); }
    setSubmitting(false);
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prayer', { body: { topic: formTopic, language: 'vi' } });
      if (error) throw error;
      if (data?.prayer) { setFormContent(data.prayer); toast.success(t('prayerWall.aiSuccess')); setTimeout(() => { if (textareaRef.current) autoResize(textareaRef.current); }, 0); }
    } catch (err: any) { console.error(err); toast.error(err?.message || t('prayerWall.aiFail')); }
    setAiGenerating(false);
  };

  const triggerClass = "w-full px-4 py-3 h-auto bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] transition-all duration-300 focus:outline-none focus:border-primary focus:ring-0 focus:ring-offset-0";

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
          <Select value={formCountry} onValueChange={setFormCountry}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder={t('prayerWall.selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[0.85rem] font-bold text-muted-foreground mb-2">{t('prayerWall.topic')}</label>
        <Select value={formTopic} onValueChange={setFormTopic}>
          <SelectTrigger className={triggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {topics.map(tp => (
              <SelectItem key={tp.value} value={tp.value}>{tp.icon} {t(`topic.${tp.value}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[0.85rem] font-bold text-muted-foreground">{t('prayerWall.prayerContent')}</label>
          <button type="button" onClick={handleAiGenerate} disabled={aiGenerating} className="text-[0.78rem] text-primary hover:underline disabled:opacity-50">
            {aiGenerating ? t('prayerWall.aiGenerating') : t('prayerWall.aiSuggest')}
          </button>
        </div>
        <textarea ref={textareaRef} rows={6} value={formContent} onChange={e => { setFormContent(e.target.value); autoResize(e.target); }} placeholder={t('prayerWall.placeholder')} className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground text-[0.95rem] resize-none min-h-[180px] transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(197,160,89,0.15)] overflow-hidden" />
      </div>
      <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-lg bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] disabled:opacity-50">
        {submitting ? t('prayerWall.submitting') : t('prayerWall.submitBtn')}
      </button>
    </form>
  );
};

export default PrayerForm;
