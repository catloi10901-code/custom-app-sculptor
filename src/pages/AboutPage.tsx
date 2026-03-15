import { useTranslation } from 'react-i18next';

const team = [
  { avatar: '👨‍💼', name: 'Rev. Daniel Park', role: 'Founder & CEO' },
  { avatar: '👩‍💻', name: 'Sarah Chen', role: 'CTO' },
  { avatar: '👨‍🎨', name: 'Marcus Johnson', role: 'Creative Director' },
  { avatar: '👩‍🔬', name: 'Dr. Amara Diallo', role: 'Head of Impact' },
  { avatar: '👨‍💻', name: 'Nguyễn Minh Tuấn', role: 'Lead Developer' },
  { avatar: '👩‍🏫', name: 'Grace Lee', role: 'Community Manager' },
];

const AboutPage = () => {
  const { t } = useTranslation();

  const values = [
    { icon: '🙏', title: t('about.value.faith'), desc: t('about.value.faithDesc') },
    { icon: '🔍', title: t('about.value.transparency'), desc: t('about.value.transparencyDesc') },
    { icon: '🤝', title: t('about.value.unity'), desc: t('about.value.unityDesc') },
    { icon: '🌍', title: t('about.value.global'), desc: t('about.value.globalDesc') },
  ];

  const renderIntroText = () => {
    const raw = t('about.introText');
    // Replace <strong>...</strong> and <highlight>...</highlight> with React elements
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
      <section className="py-20 text-center" style={{ background: 'linear-gradient(180deg, rgba(197,160,89,0.06) 0%, transparent 100%)' }}>
        <div className="container">
          <h1 className="font-serif text-primary mb-4">{t('about.heroTitle')}</h1>
          <p className="text-primary/80 text-lg font-semibold mb-3">{t('about.heroTagline')}</p>
          <p className="text-muted-foreground text-base max-w-[750px] mx-auto italic leading-relaxed">{t('about.heroQuote')}</p>
        </div>
      </section>

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
        <div className="container max-w-[600px]"><h2 className="font-serif text-primary mb-4">{t('about.join')}</h2><p className="text-muted-foreground mb-8 text-lg">{t('about.joinText')}</p><div className="flex gap-4 justify-center flex-wrap"><a href="/pray" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-bold text-[0.95rem] no-underline shadow-[0_4px_20px_rgba(197,160,89,0.35)] transition-all duration-300 hover:bg-gold-light">{t('about.startPraying')}</a><a href="/give" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-[1.5px] border-primary bg-transparent text-primary font-bold text-[0.95rem] no-underline transition-all duration-300 hover:bg-gold-dim">{t('about.giveNow')}</a></div></div>
      </section>
    </div>
  );
};

export default AboutPage;