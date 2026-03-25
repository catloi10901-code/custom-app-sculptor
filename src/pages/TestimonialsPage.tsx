import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useHeroBgImage from '@/hooks/useHeroBgImage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Loader2, Upload, X, CheckCircle, Heart, Star, ImageIcon, Video, ChevronDown as ChevDown, Share2 } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';

// ── Country data ─────────────────────────────────────────────────────────────
type Country = { code: string; name: string; dialCode: string; flag: string };

const getFlag = (code: string) =>
  code.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)));

const COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan', dialCode: '+93' },
  { code: 'AL', name: 'Albania', dialCode: '+355' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213' },
  { code: 'AD', name: 'Andorra', dialCode: '+376' },
  { code: 'AO', name: 'Angola', dialCode: '+244' },
  { code: 'AG', name: 'Antigua & Barbuda', dialCode: '+1' },
  { code: 'AR', name: 'Argentina', dialCode: '+54' },
  { code: 'AM', name: 'Armenia', dialCode: '+374' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AT', name: 'Austria', dialCode: '+43' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'BY', name: 'Belarus', dialCode: '+375' },
  { code: 'BE', name: 'Belgium', dialCode: '+32' },
  { code: 'BZ', name: 'Belize', dialCode: '+501' },
  { code: 'BJ', name: 'Benin', dialCode: '+229' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591' },
  { code: 'BA', name: 'Bosnia & Herzegovina', dialCode: '+387' },
  { code: 'BW', name: 'Botswana', dialCode: '+267' },
  { code: 'BR', name: 'Brazil', dialCode: '+55' },
  { code: 'BN', name: 'Brunei', dialCode: '+673' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', dialCode: '+257' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236' },
  { code: 'TD', name: 'Chad', dialCode: '+235' },
  { code: 'CL', name: 'Chile', dialCode: '+56' },
  { code: 'CN', name: 'China', dialCode: '+86' },
  { code: 'CO', name: 'Colombia', dialCode: '+57' },
  { code: 'KM', name: 'Comoros', dialCode: '+269' },
  { code: 'CG', name: 'Congo', dialCode: '+242' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506' },
  { code: 'HR', name: 'Croatia', dialCode: '+385' },
  { code: 'CU', name: 'Cuba', dialCode: '+53' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420' },
  { code: 'DK', name: 'Denmark', dialCode: '+45' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253' },
  { code: 'DM', name: 'Dominica', dialCode: '+1' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593' },
  { code: 'EG', name: 'Egypt', dialCode: '+20' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291' },
  { code: 'EE', name: 'Estonia', dialCode: '+372' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679' },
  { code: 'FI', name: 'Finland', dialCode: '+358' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'GA', name: 'Gabon', dialCode: '+241' },
  { code: 'GM', name: 'Gambia', dialCode: '+220' },
  { code: 'GE', name: 'Georgia', dialCode: '+995' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'GR', name: 'Greece', dialCode: '+30' },
  { code: 'GD', name: 'Grenada', dialCode: '+1' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502' },
  { code: 'GN', name: 'Guinea', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245' },
  { code: 'GY', name: 'Guyana', dialCode: '+592' },
  { code: 'HT', name: 'Haiti', dialCode: '+509' },
  { code: 'HN', name: 'Honduras', dialCode: '+504' },
  { code: 'HU', name: 'Hungary', dialCode: '+36' },
  { code: 'IS', name: 'Iceland', dialCode: '+354' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62' },
  { code: 'IR', name: 'Iran', dialCode: '+98' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964' },
  { code: 'IE', name: 'Ireland', dialCode: '+353' },
  { code: 'IL', name: 'Israel', dialCode: '+972' },
  { code: 'IT', name: 'Italy', dialCode: '+39' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1' },
  { code: 'JP', name: 'Japan', dialCode: '+81' },
  { code: 'JO', name: 'Jordan', dialCode: '+962' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996' },
  { code: 'LA', name: 'Laos', dialCode: '+856' },
  { code: 'LV', name: 'Latvia', dialCode: '+371' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266' },
  { code: 'LR', name: 'Liberia', dialCode: '+231' },
  { code: 'LY', name: 'Libya', dialCode: '+218' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261' },
  { code: 'MW', name: 'Malawi', dialCode: '+265' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'MV', name: 'Maldives', dialCode: '+960' },
  { code: 'ML', name: 'Mali', dialCode: '+223' },
  { code: 'MT', name: 'Malta', dialCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', dialCode: '+692' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230' },
  { code: 'MX', name: 'Mexico', dialCode: '+52' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691' },
  { code: 'MD', name: 'Moldova', dialCode: '+373' },
  { code: 'MC', name: 'Monaco', dialCode: '+377' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382' },
  { code: 'MA', name: 'Morocco', dialCode: '+212' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95' },
  { code: 'NA', name: 'Namibia', dialCode: '+264' },
  { code: 'NR', name: 'Nauru', dialCode: '+674' },
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505' },
  { code: 'NE', name: 'Niger', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'KP', name: 'North Korea', dialCode: '+850' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389' },
  { code: 'NO', name: 'Norway', dialCode: '+47' },
  { code: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'PW', name: 'Palau', dialCode: '+680' },
  { code: 'PA', name: 'Panama', dialCode: '+507' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595' },
  { code: 'PE', name: 'Peru', dialCode: '+51' },
  { code: 'PH', name: 'Philippines', dialCode: '+63' },
  { code: 'PL', name: 'Poland', dialCode: '+48' },
  { code: 'PT', name: 'Portugal', dialCode: '+351' },
  { code: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'RO', name: 'Romania', dialCode: '+40' },
  { code: 'RU', name: 'Russia', dialCode: '+7' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250' },
  { code: 'KN', name: 'Saint Kitts & Nevis', dialCode: '+1' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '+1' },
  { code: 'VC', name: 'Saint Vincent', dialCode: '+1' },
  { code: 'WS', name: 'Samoa', dialCode: '+685' },
  { code: 'SM', name: 'San Marino', dialCode: '+378' },
  { code: 'ST', name: 'São Tomé & Príncipe', dialCode: '+239' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'SN', name: 'Senegal', dialCode: '+221' },
  { code: 'RS', name: 'Serbia', dialCode: '+381' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677' },
  { code: 'SO', name: 'Somalia', dialCode: '+252' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211' },
  { code: 'ES', name: 'Spain', dialCode: '+34' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'SD', name: 'Sudan', dialCode: '+249' },
  { code: 'SR', name: 'Suriname', dialCode: '+597' },
  { code: 'SE', name: 'Sweden', dialCode: '+46' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41' },
  { code: 'SY', name: 'Syria', dialCode: '+963' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255' },
  { code: 'TH', name: 'Thailand', dialCode: '+66' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670' },
  { code: 'TG', name: 'Togo', dialCode: '+228' },
  { code: 'TO', name: 'Tonga', dialCode: '+676' },
  { code: 'TT', name: 'Trinidad & Tobago', dialCode: '+1' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216' },
  { code: 'TR', name: 'Turkey', dialCode: '+90' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688' },
  { code: 'UG', name: 'Uganda', dialCode: '+256' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84' },
  { code: 'YE', name: 'Yemen', dialCode: '+967' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263' },
].map(c => ({ ...c, flag: getFlag(c.code) })).sort((a, b) => a.name.localeCompare(b.name));

// ── Types ────────────────────────────────────────────────────────────────────
type TestimonySubmission = {
  id: string;
  full_name: string;
  birth_date: string | null;
  facebook: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  title: string;
  before_prayer: string;
  after_prayer: string;
  current_status: string | null;
  message: string | null;
  media_urls: string[];
  created_at: string;
};

type MediaPreview = { file: File; url: string; type: 'image' | 'video' };

const INITIAL_FORM = {
  full_name: '',
  birth_date: '',
  facebook: '',
  phone_code: '+84',
  phone_number: '',
  email: '',
  country: '',
  title: '',
  before_prayer: '',
  after_prayer: '',
  current_status: '',
  message: '',
  confirmed: false,
};

// ── Phone code selector ──────────────────────────────────────────────────────
const PhoneInput = ({ code, number, onCode, onNumber }: {
  code: string; number: string;
  onCode: (v: string) => void; onNumber: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(c => c.dialCode === code) ?? COUNTRIES.find(c => c.code === 'VN')!;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search))
    : COUNTRIES;

  return (
    <div className="flex gap-2">
      <div ref={ref} className="relative shrink-0">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="h-10 flex items-center gap-1.5 px-3 bg-background border border-input rounded-md text-sm hover:border-primary/50 transition-colors cursor-pointer whitespace-nowrap"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-foreground font-medium">{selected.dialCode}</span>
          <ChevDown className="w-3 h-3 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-2xl z-[2100] overflow-hidden">
            <div className="p-2 border-b border-border">
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                className="h-8 text-sm"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-52">
              {filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onCode(c.dialCode); setOpen(false); setSearch(''); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-primary/10 cursor-pointer bg-transparent border-none text-left transition-colors ${code === c.dialCode && selected.code === c.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                >
                  <span className="text-base shrink-0">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-muted-foreground text-xs shrink-0">{c.dialCode}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-center py-4 text-sm text-muted-foreground">No results</p>}
            </div>
          </div>
        )}
      </div>
      <Input
        value={number}
        onChange={e => onNumber(e.target.value)}
        placeholder="912 345 678"
        type="tel"
        className="flex-1 min-w-0"
      />
    </div>
  );
};

// ── Country selector ─────────────────────────────────────────────────────────
const CountrySelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(c => c.code === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : COUNTRIES;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-10 flex items-center gap-2 px-3 bg-background border border-input rounded-md text-sm hover:border-primary/50 transition-colors cursor-pointer"
      >
        {selected ? (
          <>
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="flex-1 text-left text-foreground">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-muted-foreground">Select country...</span>
        )}
        <ChevDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-xl shadow-2xl z-[2100] overflow-hidden">
          <div className="p-2 border-b border-border">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              className="h-8 text-sm"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto max-h-52">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.code); setOpen(false); setSearch(''); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-primary/10 cursor-pointer bg-transparent border-none text-left transition-colors ${value === c.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
              >
                <span className="text-base shrink-0">{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-center py-4 text-sm text-muted-foreground">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Modal ────────────────────────────────────────────────────────────────────
const TestimonyModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        full_name: prev.full_name || profile?.display_name || '',
        email: prev.email || user.email || '',
        country: prev.country || profile?.country || '',
      }));
    }
  }, [user, profile]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (mediaPreviews.length + allowed.length > 5) { toast.error(t('testimonials.maxFiles')); return; }
    setMediaPreviews(prev => [...prev, ...allowed.map(file => ({
      file, url: URL.createObjectURL(file),
      type: (file.type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video',
    }))]);
  };

  const removeMedia = (i: number) => setMediaPreviews(prev => {
    URL.revokeObjectURL(prev[i].url);
    return prev.filter((_, idx) => idx !== i);
  });

  const uploadMedia = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const p of mediaPreviews) {
      const ext = p.file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage.from('uploads').upload(`testimony/${path}`, p.file, { contentType: p.file.type });
      if (error) { toast.error(t('testimonials.uploadError')); throw error; }
      const { data: u } = supabase.storage.from('uploads').getPublicUrl(data.path);
      urls.push(u.publicUrl);
    }
    return urls;
  };


  const handleSubmit = async () => {
    if (!form.full_name.trim()) { toast.error(t('testimonials.error.name')); return; }
    if (!form.title.trim()) { toast.error(t('testimonials.error.title')); return; }
    if (!form.before_prayer.trim()) { toast.error(t('testimonials.error.before')); return; }
    if (!form.after_prayer.trim()) { toast.error(t('testimonials.error.after')); return; }
    if (!form.confirmed) { toast.error(t('testimonials.error.confirm')); return; }

    setSubmitting(true);
    try {
      const mediaUrls = mediaPreviews.length > 0 ? await uploadMedia() : [];
      const phone = form.phone_number.trim() ? `${form.phone_code} ${form.phone_number.trim()}` : null;
      const { error } = await supabase.from('testimonials').insert({
        full_name: form.full_name.trim(),
        birth_date: form.birth_date || null,
        facebook: form.facebook.trim() || null,
        phone: phone,
        email: form.email.trim() || null,
        address: form.country ? COUNTRIES.find(c => c.code === form.country)?.name || null : null,
        title: form.title.trim(),
        before_prayer: form.before_prayer.trim(),
        after_prayer: form.after_prayer.trim(),
        current_status: form.current_status.trim() || null,
        message: form.message.trim() || null,
        media_urls: mediaUrls,
        created_by: user.id,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast.error(t('testimonials.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const selectClass = "h-10 flex-1 bg-background border border-input rounded-md px-3 text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring";

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-serif text-primary text-xl font-semibold">{t('testimonials.form.title')}</h2>
            {!submitted && <p className="text-muted-foreground text-xs mt-0.5">{t('testimonials.form.sub')}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-border hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-primary text-2xl mb-3">{t('testimonials.thanks.title')}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm mx-auto">{t('testimonials.thanks.sub')}</p>
              <Button onClick={onClose}>{t('testimonials.thanks.back')}</Button>
            </div>
          ) : (
            <div className="space-y-8">

              {/* ─ Section 1 ─ */}
              <div className="space-y-4">
                <SectionTitle n={1} label={t('testimonials.section.personal')} />

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    {t('testimonials.field.name')} <span className="text-destructive">*</span>
                    {user && <span className="ml-2 text-xs text-primary/70 font-normal">(auto-filled)</span>}
                  </label>
                  <Input value={form.full_name} onChange={set('full_name')} placeholder={t('testimonials.placeholder.name')} />
                </div>

                {/* Date of birth */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.dob')}</label>
                  <Input type="date" value={form.birth_date} onChange={set('birth_date')} max={new Date().toISOString().split('T')[0]} />
                </div>

                <p className="text-xs text-muted-foreground/60 italic">{t('testimonials.contactOptional')}</p>

                {/* Facebook */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">Facebook</label>
                  <Input value={form.facebook} onChange={set('facebook')} placeholder="facebook.com/..." />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.phone')}</label>
                  <PhoneInput
                    code={form.phone_code}
                    number={form.phone_number}
                    onCode={v => setForm(p => ({ ...p, phone_code: v }))}
                    onNumber={v => setForm(p => ({ ...p, phone_number: v }))}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    Email
                    {user && <span className="ml-2 text-xs text-primary/70 font-normal">(auto-filled)</span>}
                  </label>
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="name@example.com" />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.country')}</label>
                  <CountrySelect value={form.country} onChange={v => setForm(p => ({ ...p, country: v }))} />
                </div>
              </div>

              {/* ─ Section 2 ─ */}
              <div className="space-y-4">
                <SectionTitle n={2} label={t('testimonials.section.content')} />
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.testimonyTitle')} <span className="text-destructive">*</span></label>
                  <Input value={form.title} onChange={set('title')} placeholder={t('testimonials.placeholder.title')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.before')} <span className="text-destructive">*</span></label>
                  <Textarea value={form.before_prayer} onChange={set('before_prayer')} rows={3} placeholder={t('testimonials.placeholder.before')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                    {t('testimonials.field.after')} <span className="text-primary">⭐</span> <span className="text-destructive">*</span>
                  </label>
                  <Textarea value={form.after_prayer} onChange={set('after_prayer')} rows={4} placeholder={t('testimonials.placeholder.after')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.current')}</label>
                  <Textarea value={form.current_status} onChange={set('current_status')} rows={2} placeholder={t('testimonials.placeholder.current')} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-1.5">{t('testimonials.field.message')}</label>
                  <Textarea value={form.message} onChange={set('message')} rows={2} placeholder={t('testimonials.placeholder.message')} />
                </div>
              </div>

              {/* ─ Section 3 ─ */}
              <div className="space-y-4">
                <SectionTitle n={3} label={t('testimonials.section.media')} />
                <div
                  className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary/50', 'bg-primary/5'); }}
                  onDragLeave={e => { e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5'); }}
                  onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary/50', 'bg-primary/5'); handleFiles(e.dataTransfer.files); }}
                >
                  <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
                  <Upload className="w-7 h-7 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t('testimonials.upload.hint')}</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">{t('testimonials.upload.types')}</p>
                </div>
                {mediaPreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {mediaPreviews.map((preview, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-border aspect-square bg-black/20">
                        {preview.type === 'image'
                          ? <img src={preview.url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1"><Video className="w-5 h-5 text-muted-foreground/50" /><span className="text-[10px] text-muted-foreground/60 truncate w-full text-center">{preview.file.name}</span></div>
                        }
                        <button onClick={() => removeMedia(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center border-none cursor-pointer hover:bg-destructive/80 transition-colors">
                          <X className="w-3 h-3 text-white" />
                        </button>
                        {preview.type === 'image' && <ImageIcon className="absolute bottom-1 left-1 w-3 h-3 text-white/50" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ─ Section 4 ─ */}
              <div className="space-y-3">
                <SectionTitle n={4} label={t('testimonials.section.confirm')} />
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${form.confirmed ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`}
                    onClick={() => setForm(p => ({ ...p, confirmed: !p.confirmed }))}
                  >
                    {form.confirmed && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
                  </div>
                  <span className="text-sm text-foreground/80 leading-relaxed select-none" onClick={() => setForm(p => ({ ...p, confirmed: !p.confirmed }))}>
                    {t('testimonials.confirm.text')}
                  </span>
                </label>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex gap-3 px-6 py-4 border-t border-border shrink-0">
            <Button onClick={handleSubmit} disabled={submitting || !form.confirmed} className="flex-1 font-bold">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{t('testimonials.submitting')}</> : t('testimonials.submit')}
            </Button>
            <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Small helper ─────────────────────────────────────────────────────────────
const SectionTitle = ({ n, label }: { n: number; label: string }) => (
  <h3 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs shrink-0">{n}</span>
    {label}
  </h3>
);

// ── Detail modal ─────────────────────────────────────────────────────────────
const DetailModal = ({ item, onClose }: { item: TestimonySubmission; onClose: () => void }) => {
  const { t } = useTranslation();
  const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);
  const hasMedia = item.media_urls?.length > 0;
  const fmt = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
            {item.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight">{item.full_name}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">
              {fmt(item.created_at)}
              {item.address && <span> · {item.address}</span>}
              {item.birth_date && <span> · {new Date(item.birth_date).getFullYear()}</span>}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-border transition-colors cursor-pointer shrink-0">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* Title */}
          <h2 className="font-serif text-primary font-semibold leading-snug" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
            "{item.title}"
          </h2>

          {/* Personal info block */}
          {(item.birth_date || item.phone || item.email || item.facebook) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 bg-white/5 rounded-xl px-3.5 py-3 text-xs">
              {item.birth_date && <>
                <span className="text-muted-foreground">{t('testimonials.field.dob')}</span>
                <span className="text-foreground/80 font-medium">{fmt(item.birth_date)}</span>
              </>}
              {item.phone && <>
                <span className="text-muted-foreground">{t('testimonials.field.phone')}</span>
                <span className="text-foreground/80 font-medium">{item.phone}</span>
              </>}
              {item.email && <>
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground/80 font-medium truncate">{item.email}</span>
              </>}
              {item.facebook && <>
                <span className="text-muted-foreground">Facebook</span>
                <span className="text-foreground/80 font-medium truncate">{item.facebook}</span>
              </>}
            </div>
          )}

          {/* Before */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('testimonials.field.before')}</p>
            <p className="text-sm text-foreground/75 leading-relaxed bg-white/5 rounded-lg px-3 py-2.5">{item.before_prayer}</p>
          </div>

          {/* After */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">⭐ {t('testimonials.field.after')}</p>
            <p className="text-sm text-foreground/80 leading-relaxed bg-primary/5 border border-primary/15 rounded-lg px-3 py-2.5">{item.after_prayer}</p>
          </div>

          {/* Current status */}
          {item.current_status && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('testimonials.field.current')}</p>
              <p className="text-sm text-foreground/75 leading-relaxed">{item.current_status}</p>
            </div>
          )}

          {/* Message */}
          {item.message && (
            <div className="border-l-2 border-primary/40 pl-3 py-1">
              <p className="text-sm text-foreground/70 italic leading-relaxed">"{item.message}"</p>
            </div>
          )}

          {/* Media */}
          {hasMedia && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Media</p>
              <div className="grid grid-cols-4 gap-1.5">
                {item.media_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-border hover:opacity-85 transition-opacity">
                    {isVideo(url)
                      ? <video src={url} className="w-full h-full object-cover" muted playsInline />
                      : <img src={url} alt="" className="w-full h-full object-cover" />}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const TestimonialsPage = () => {
  const { t } = useTranslation();
  const heroBg = useHeroBgImage('hero_bg_testimonials');
  const [submissions, setSubmissions] = useState<TestimonySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [detailItem, setDetailItem] = useState<TestimonySubmission | null>(null);

  useEffect(() => { fetchApproved(); }, []);

  const fetchApproved = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, full_name, birth_date, facebook, phone, email, address, title, before_prayer, after_prayer, current_status, message, media_urls, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions((data as unknown as TestimonySubmission[]) || []);
    setLoading(false);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  const isVideo = (url: string) => /\.(mp4|mov|webm)(\?|$)/i.test(url);

  return (
    <div>
      {/* ══ HERO ══ */}
      <PageHero
        badge={{ icon: <Star className="w-3.5 h-3.5" />, text: t('testimonials.badge') }}
        title={t('testimonials.title')}
        subtitle={t('testimonials.sub')}
        bgUrl={heroBg}
        cta={<Button onClick={() => setShowFormModal(true)} className="px-8 py-3 text-[0.95rem] font-bold">✦ {t('testimonials.cta')}</Button>}
      />

      {/* ══ LIST ══ */}
      <section className="container py-12 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />{t('testimonials.loading')}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="mb-6">{t('testimonials.empty')}</p>
            <Button variant="outline" onClick={() => setShowFormModal(true)}>✦ {t('testimonials.cta')}</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {submissions.map(item => (
              <div key={item.id} className="relative group bg-card border border-border rounded-2xl cursor-pointer flex flex-col justify-between p-4 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-200 overflow-hidden"
                onClick={() => setDetailItem(item)}
              >
                  {/* Top: avatar + name */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary font-bold text-[11px]">
                      {item.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground text-xs font-semibold truncate leading-tight">{item.full_name}</p>
                      <p className="text-muted-foreground text-[10px] leading-tight">
                        {item.address && <span>{item.address}</span>}
                        {item.address && item.birth_date && <span> · </span>}
                        {item.birth_date && <span>{new Date(item.birth_date).getFullYear()}</span>}
                        {!item.address && !item.birth_date && <span>{formatDate(item.created_at)}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Center: title + after_prayer + message */}
                  <div className="flex-1 h-0 flex flex-col justify-center gap-1.5 py-2 overflow-hidden">
                    <h3 className="font-serif text-primary text-sm font-semibold leading-snug line-clamp-1">
                      "{item.title}"
                    </h3>
                    {item.after_prayer && (
                      <p className="text-xs text-foreground/75 leading-relaxed line-clamp-2">
                        {item.after_prayer}
                      </p>
                    )}
                    {item.message && (
                      <p className="text-xs text-muted-foreground italic leading-relaxed line-clamp-2">
                        "{item.message}"
                      </p>
                    )}
                  </div>

                  {/* Bottom: date */}
                  <p className="text-muted-foreground text-[10px]">{formatDate(item.created_at)}</p>

                {/* Share button — top-right, appears on hover */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigator.share
                      ? navigator.share({ title: item.title, text: item.after_prayer, url: window.location.href })
                      : navigator.clipboard.writeText(window.location.href).then(() => toast.success('Đã sao chép link!'));
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary/30 hover:border-primary/40 z-10"
                >
                  <Share2 className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showFormModal && <TestimonyModal onClose={() => setShowFormModal(false)} />}
      {detailItem && <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />}
    </div>
  );
};

export default TestimonialsPage;
