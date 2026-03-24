import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PageHero from '@/components/layout/PageHero';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Briefcase } from 'lucide-react';

const team = [
  { avatar: '👨‍💼', name: 'Rev. Daniel Park', role: 'Founder & CEO' },
  { avatar: '👩‍💻', name: 'Sarah Chen', role: 'CTO' },
  { avatar: '👨‍🎨', name: 'Marcus Johnson', role: 'Creative Director' },
  { avatar: '👩‍🔬', name: 'Dr. Amara Diallo', role: 'Head of Impact' },
  { avatar: '👨‍💻', name: 'Nguyễn Minh Tuấn', role: 'Lead Developer' },
  { avatar: '👩‍🏫', name: 'Grace Lee', role: 'Community Manager' },
];

interface JobPosition {
  id: string;
  title: string;
}

const AboutPage = () => {
  const { t } = useTranslation();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', position: '', message: '' });

  useEffect(() => {
    supabase.from('job_positions').select('id, title').eq('is_active', true).order('sort_order')
      .then(({ data }) => setPositions((data as JobPosition[]) || []));
  }, []);

  const handleSubmit = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      toast.error('Vui lòng nhập họ tên và email');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('job_applications').insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      position: form.position || 'Chưa chọn',
      message: form.message.trim(),
    });
    setSubmitting(false);
    if (error) { toast.error('Gửi thất bại: ' + error.message); return; }
    toast.success('Đã gửi đơn ứng tuyển thành công!');
    setForm({ full_name: '', email: '', phone: '', position: '', message: '' });
    setRecruitOpen(false);
  };

  const values = [
    { icon: '🙏', title: t('about.value.faith'), desc: t('about.value.faithDesc') },
    { icon: '🔍', title: t('about.value.transparency'), desc: t('about.value.transparencyDesc') },
    { icon: '🤝', title: t('about.value.unity'), desc: t('about.value.unityDesc') },
    { icon: '🌍', title: t('about.value.global'), desc: t('about.value.globalDesc') },
  ];

  const renderIntroText = () => {
    const raw = t('about.introText');
    const parts = raw.split(/(<strong>.*?<\/strong>|<highlight>.*?<\/highlight>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<strong>')) {
        return <strong key={i} className="text-foreground">{part.replace(/<\/?strong>/g, '')}</strong>;
      }
      if (part.startsWith('<highlight>')) {
        return <span key={i} className="text-primary font-semibold">{part.replace(/<\/?highlight>/g, '')}</span>;
      }
      return part;
    });
  };

  return (
    <div>
      <PageHero
        badge={{ icon: <Users className="w-3.5 h-3.5" />, text: t('about.badge') || 'VỀ HOLYPRAY' }}
        title={t('about.heroTitle')}
        subtitle={t('about.heroTagline')}
        pills={[
          { icon: '🌍', text: `${team.length} ${t('about.pillTeam') || 'Thành viên đội ngũ'}` },
          { icon: '🙏', text: t('about.pillMission') || 'Sứ mệnh toàn cầu' },
          { icon: '✦', text: t('about.pillFaith') || 'Phi tôn giáo' },
        ]}
        bgKey="hero_bg_about"
      />

      <section className="py-16">
        <div className="container max-w-[800px] text-center">
          <p className="text-muted-foreground text-lg leading-[1.9]">
            {renderIntroText()}
          </p>
        </div>
      </section>

      <section className="py-16"><div className="container max-w-[800px] text-center"><h2 className="font-serif text-primary mb-6">{t('about.mission')}</h2><p className="text-muted-foreground text-lg leading-[1.8]">{t('about.missionText')}</p></div></section>
      <section className="py-16" style={{ background: 'rgba(197,160,89,0.03)' }}>
        <div className="container"><h2 className="font-serif text-primary mb-10 text-center">{t('about.values')}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{values.map((v, i) => (<div key={i} className="bg-card border border-border rounded-2xl p-6 flex gap-4 transition-all duration-300 hover:border-primary/50 hover:-translate-y-0.5"><div className="text-3xl flex-shrink-0 mt-1">{v.icon}</div><div><h4 className="font-serif text-primary mb-2 text-base">{v.title}</h4><p className="text-muted-foreground text-[0.92rem] leading-relaxed">{v.desc}</p></div></div>))}</div></div>
      </section>
      <section className="py-16"><div className="container"><h2 className="font-serif text-primary mb-10 text-center">{t('about.team')}</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{team.map((m, i) => (<div key={i} className="bg-card border border-border rounded-2xl p-7 text-center transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"><div className="w-[72px] h-[72px] rounded-full bg-gold-dim border-2 border-primary flex items-center justify-center text-3xl mx-auto mb-4">{m.avatar}</div><h3 className="text-foreground text-base font-semibold">{m.name}</h3><p className="text-[0.82rem] text-primary mt-1">{m.role}</p></div>))}</div></div></section>
      <section className="py-16 text-center" style={{ background: 'rgba(197,160,89,0.03)' }}>
        <div className="container max-w-[600px]"><h2 className="font-serif text-primary mb-4">{t('about.join')}</h2><p className="text-muted-foreground mb-8 text-lg">{t('about.joinText')}</p><div className="flex gap-4 justify-center flex-wrap">
          <a href="/pray" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-[0.95rem] no-underline shadow-[0_4px_20px_rgba(197,160,89,0.35)] transition-all duration-300 hover:bg-gold-light">{t('about.startPraying')}</a>
          <a href="/give" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-[1.5px] border-primary bg-transparent text-primary font-bold text-[0.95rem] no-underline transition-all duration-300 hover:bg-gold-dim">{t('about.giveNow')}</a>
          <button onClick={() => setRecruitOpen(true)} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 text-white font-bold text-[0.95rem] no-underline shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-all duration-300 hover:bg-blue-700">
            <Briefcase className="w-4 h-4" /> Tuyển Dụng
          </button>
        </div></div>
      </section>

      {/* Recruitment Dialog */}
      <Dialog open={recruitOpen} onOpenChange={setRecruitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Ứng tuyển</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Họ tên *</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nguyễn Văn A" /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" /></div>
            <div><Label>Số điện thoại</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0912 345 678" /></div>
            <div>
              <Label>Vị trí ứng tuyển</Label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger><SelectValue placeholder="Chọn vị trí" /></SelectTrigger>
                <SelectContent>
                  {positions.map((p) => <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>)}
                  {positions.length === 0 && <SelectItem value="Khác" disabled>Chưa có vị trí</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Lời nhắn</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Giới thiệu bản thân, kinh nghiệm..." rows={4} /></div>
          </div>
          <DialogFooter><Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutPage;
