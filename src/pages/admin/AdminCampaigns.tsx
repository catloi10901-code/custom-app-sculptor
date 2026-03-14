import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Pencil, Plus } from 'lucide-react';

interface Campaign {
  id: string;
  icon: string;
  title: string;
  description: string;
  participants: number;
  goal: number;
  is_active: boolean;
  sort_order: number;
}

const emptyCampaign: Omit<Campaign, 'id'> = {
  icon: '🙏',
  title: '',
  description: '',
  participants: 0,
  goal: 10000,
  is_active: true,
  sort_order: 0,
};

const AdminCampaigns = () => {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<Omit<Campaign, 'id'>>(emptyCampaign);
  const [saving, setSaving] = useState(false);

  const fetchCampaigns = async () => {
    const { data } = await supabase.from('campaigns').select('*').order('sort_order');
    if (data) setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const openEdit = (campaign: Campaign) => {
    setEditing(campaign);
    setForm({ icon: campaign.icon, title: campaign.title, description: campaign.description, participants: campaign.participants, goal: campaign.goal, is_active: campaign.is_active, sort_order: campaign.sort_order });
    setEditOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyCampaign, sort_order: campaigns.length + 1 });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    if (editing) {
      const { error } = await supabase.from('campaigns').update(form).eq('id', editing.id);
      if (error) toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
      else toast({ title: 'Đã cập nhật chiến dịch' });
    } else {
      const { error } = await supabase.from('campaigns').insert(form);
      if (error) toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
      else toast({ title: 'Đã tạo chiến dịch mới' });
    }
    setSaving(false);
    setEditOpen(false);
    fetchCampaigns();
  };

  if (loading) return <div className="text-muted-foreground">{t('common.loading')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Quản lý chiến dịch</h1>
        <Button onClick={openCreate} size="sm"><Plus className="w-4 h-4 mr-1" /> Thêm mới</Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Icon</TableHead>
              <TableHead>Tên chiến dịch</TableHead>
              <TableHead className="text-right">Người tham gia</TableHead>
              <TableHead className="text-right">Mục tiêu</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-xl">{c.icon}</TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{c.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{c.description}</div>
                </TableCell>
                <TableCell className="text-right">{c.participants.toLocaleString()}</TableCell>
                <TableCell className="text-right">{c.goal.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${c.is_active ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-[60px_1fr] gap-3">
              <div>
                <Label>Icon</Label>
                <Input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="text-center text-xl" />
              </div>
              <div>
                <Label>Tên chiến dịch</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Người tham gia</Label>
                <Input type="number" value={form.participants} onChange={e => setForm(f => ({ ...f, participants: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Mục tiêu</Label>
                <Input type="number" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Thứ tự</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label>Hoạt động</Label>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCampaigns;
