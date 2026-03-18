import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import PrayerForm from './PrayerForm';

interface PrayerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTopic?: string;
}

const PrayerFormDialog = ({ open, onOpenChange, defaultTopic }: PrayerFormDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto border-primary/30 bg-card p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('prayerWall.formTitle')}</DialogTitle>
        </DialogHeader>
        <PrayerForm
          defaultTopic={defaultTopic}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PrayerFormDialog;
