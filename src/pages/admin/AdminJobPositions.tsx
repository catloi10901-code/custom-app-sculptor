import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface JobPosition {
  id: string;
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminJobPositions = () => {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobPosition | null>(null);
  const [form, setForm] = useState({ title: "", description: "", is_active: true, sort_order: 0 });

  const fetchPositions = async () => {
    const { data } = await supabase.from("job_positions").select("*").order("sort_order");
    setPositions((data as JobPosition[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPositions(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", is_active: true, sort_order: 0 });
    setDialogOpen(true);
  };

  const openEdit = (p: JobPosition) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, is_active: p.is_active, sort_order: p.sort_order });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Vui lòng nhập tên vị trí"); return; }
    if (editing) {
      const { error } = await supabase.from("job_positions").update(form).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Đã cập nhật");
    } else {
      const { error } = await supabase.from("job_positions").insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success("Đã thêm vị trí");
    }
    setDialogOpen(false);
    fetchPositions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa vị trí này?")) return;
    await supabase.from("job_positions").delete().eq("id", id);
    toast.success("Đã xóa");
    fetchPositions();
  };

  if (loading) return <div className="p-8 text-muted-foreground">Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-primary">Vị trí tuyển dụng</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Thêm vị trí</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên vị trí</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thứ tự</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell className="max-w-[300px] truncate text-muted-foreground">{p.description}</TableCell>
              <TableCell>{p.is_active ? <span className="text-green-600 text-xs font-semibold">Active</span> : <span className="text-muted-foreground text-xs">Inactive</span>}</TableCell>
              <TableCell>{p.sort_order}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {positions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Chưa có vị trí nào</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Sửa vị trí" : "Thêm vị trí"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Tên vị trí *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Mô tả</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="flex items-center gap-3">
              <Label>Active</Label>
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            </div>
            <div><Label>Thứ tự</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>{editing ? "Lưu" : "Thêm"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobPositions;
