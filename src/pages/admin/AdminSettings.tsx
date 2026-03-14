import { useTranslation } from 'react-i18next';

const AdminSettings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="font-serif text-primary text-2xl mb-6">{t('admin.settings.title')}</h1>
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-foreground font-semibold mb-2">{t('admin.settings.info')}</h3>
          <p className="text-muted-foreground text-sm">{t('admin.settings.infoSub')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.settings.siteName')}</label>
            <input defaultValue="UNPray" className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-[0.85rem] font-bold text-muted-foreground mb-1.5">{t('admin.settings.email')}</label>
            <input defaultValue="contact@unpray.org" className="w-full px-4 py-3 bg-black/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        </div>
        <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          {t('admin.settings.save')}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
