import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

interface LiveStatsConfig {
  prayers_count: number;
  members_count: number;
  donated_total: number;
  prayer_min: number;
  prayer_max: number;
  member_chance: number;
  member_min: number;
  member_max: number;
  donation_amounts: string;
  updated_at: string;
}

const AdminLiveStats = () => {
  const [stats, setStats] = useState<LiveStatsConfig | null>(null);
  const [config, setConfig] = useState({
    prayer_min: 1,
    prayer_max: 3,
    member_chance: 0.6,
    member_min: 1,
    member_max: 2,
    donation_amounts: '1,5,10,25,50,100',
  });
  const [saving, setSaving] = useState(false);
  const [manualEdit, setManualEdit] = useState({
    prayers_count: '',
    members_count: '',
    donated_total: '',
  });

  const fetchStats = async () => {
    const { data } = await supabase
      .from('live_stats')
      .select('*')
      .eq('id', 1)
      .single();
    if (data) {
      const d = data as any;
      setStats(d);
      setConfig({
        prayer_min: d.prayer_min ?? 1,
        prayer_max: d.prayer_max ?? 3,
        member_chance: Number(d.member_chance ?? 0.6),
        member_min: d.member_min ?? 1,
        member_max: d.member_max ?? 2,
        donation_amounts: d.donation_amounts ?? '1,5,10,25,50,100',
      });
      setManualEdit({
        prayers_count: String(d.prayers_count),
        members_count: String(d.members_count),
        donated_total: String(d.donated_total),
      });
    }
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('admin-live-stats')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_stats' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const saveConfig = async () => {
    setSaving(true);
    const { error } = await supabase.functions.invoke('update-live-stats', {
      body: { action: 'update_config', config },
    });
    if (error) {
      toast.error('Lỗi khi lưu cấu hình: ' + error.message);
    } else {
      toast.success('Đã lưu cấu hình tăng trưởng');
      fetchStats();
    }
    setSaving(false);
  };

  const saveManualValues = async () => {
    setSaving(true);
    const { error } = await supabase.functions.invoke('update-live-stats', {
      body: {
        action: 'set_values',
        values: {
          prayers_count: Number(manualEdit.prayers_count),
          members_count: Number(manualEdit.members_count),
          donated_total: Number(manualEdit.donated_total),
        },
      },
    });
    if (error) {
      toast.error('Lỗi khi cập nhật số liệu: ' + error.message);
    } else {
      toast.success('Đã cập nhật số liệu');
      fetchStats();
    }
    setSaving(false);
  };

  const triggerIncrement = async () => {
    const { error } = await supabase.functions.invoke('update-live-stats', {
      body: { action: 'increment' },
    });
    if (error) toast.error('Lỗi: ' + error.message);
    else toast.success('Đã tăng số liệu');
  };

  if (!stats) return <div className="text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-primary text-2xl">📊 Live Stats</h1>

      {/* Current values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-muted-foreground text-sm mb-1">🙏 Lời cầu nguyện</div>
          <AnimatedCounter value={stats.prayers_count} className="font-serif text-3xl font-bold text-primary" />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-muted-foreground text-sm mb-1">👥 Thành viên</div>
          <AnimatedCounter value={stats.members_count} className="font-serif text-3xl font-bold text-primary" />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-muted-foreground text-sm mb-1">💰 Dâng hiến</div>
          <AnimatedCounter value={stats.donated_total} prefix="$" className="font-serif text-3xl font-bold text-primary" />
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Cập nhật lần cuối: {new Date(stats.updated_at).toLocaleString('vi-VN')}
      </div>

      {/* Manual trigger */}
      <Button onClick={triggerIncrement} variant="outline" size="sm">
        ⚡ Tăng ngay (test)
      </Button>

      {/* Manual value edit */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-serif text-primary text-lg">✏️ Chỉnh sửa số liệu trực tiếp</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Lời cầu nguyện</Label>
            <Input type="number" value={manualEdit.prayers_count} onChange={e => setManualEdit(prev => ({ ...prev, prayers_count: e.target.value }))} />
          </div>
          <div>
            <Label>Thành viên</Label>
            <Input type="number" value={manualEdit.members_count} onChange={e => setManualEdit(prev => ({ ...prev, members_count: e.target.value }))} />
          </div>
          <div>
            <Label>Dâng hiến ($)</Label>
            <Input type="number" value={manualEdit.donated_total} onChange={e => setManualEdit(prev => ({ ...prev, donated_total: e.target.value }))} />
          </div>
        </div>
        <Button onClick={saveManualValues} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Cập nhật số liệu'}
        </Button>
      </div>

      {/* Growth config */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-serif text-primary text-lg">⚙️ Cấu hình tốc độ tăng trưởng</h2>
        <p className="text-sm text-muted-foreground">Các giá trị này quyết định mức tăng mỗi phút khi cron job chạy.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Prayer min/phút</Label>
            <Input type="number" min={0} value={config.prayer_min} onChange={e => setConfig(prev => ({ ...prev, prayer_min: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Prayer max/phút</Label>
            <Input type="number" min={0} value={config.prayer_max} onChange={e => setConfig(prev => ({ ...prev, prayer_max: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Member chance (0-1)</Label>
            <Input type="number" min={0} max={1} step={0.1} value={config.member_chance} onChange={e => setConfig(prev => ({ ...prev, member_chance: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Member min/phút</Label>
            <Input type="number" min={0} value={config.member_min} onChange={e => setConfig(prev => ({ ...prev, member_min: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Member max/phút</Label>
            <Input type="number" min={0} value={config.member_max} onChange={e => setConfig(prev => ({ ...prev, member_max: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Donation amounts (phân cách bằng dấu phẩy)</Label>
            <Input value={config.donation_amounts} onChange={e => setConfig(prev => ({ ...prev, donation_amounts: e.target.value }))} />
          </div>
        </div>

        <Button onClick={saveConfig} disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </Button>
      </div>
    </div>
  );
};

export default AdminLiveStats;
