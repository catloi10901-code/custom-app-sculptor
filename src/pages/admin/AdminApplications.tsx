import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  resume_url: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminApplications = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const fetchApps = async () => {
    let query = supabase.from("job_applications").select("*").order("created_at", { ascending: false });
    if (filterStatus !== "all") query = query.eq("status", filterStatus);
    const { data } = await query;
    setApps((data as Application[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, [filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Đã cập nhật trạng thái");
    fetchApps();
  };

  if (loading) return <div className="p-8 text-muted-foreground">Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-primary">Đơn ứng tuyển</h1>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead className="w-[140px]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((a) => (
            <TableRow key={a.id} className="cursor-pointer" onClick={() => setSelected(a)}>
              <TableCell className="font-medium">{a.full_name}</TableCell>
              <TableCell className="text-muted-foreground">{a.email}</TableCell>
              <TableCell>{a.position}</TableCell>
              <TableCell><Badge className={statusColors[a.status] || ""} variant="secondary">{a.status}</Badge></TableCell>
              <TableCell className="text-muted-foreground text-sm">{format(new Date(a.created_at), "dd/MM/yyyy")}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
          {apps.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Chưa có đơn ứng tuyển</TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết đơn ứng tuyển</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-foreground">Họ tên:</span> {selected.full_name}</div>
              <div><span className="font-medium text-foreground">Email:</span> {selected.email}</div>
              <div><span className="font-medium text-foreground">SĐT:</span> {selected.phone}</div>
              <div><span className="font-medium text-foreground">Vị trí:</span> {selected.position}</div>
              <div><span className="font-medium text-foreground">Lời nhắn:</span><p className="mt-1 text-muted-foreground whitespace-pre-wrap">{selected.message || "(không có)"}</p></div>
              {selected.resume_url && <div><span className="font-medium text-foreground">CV:</span> <a href={selected.resume_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Xem CV</a></div>}
              <div><span className="font-medium text-foreground">Ngày gửi:</span> {format(new Date(selected.created_at), "dd/MM/yyyy HH:mm")}</div>
              <div><span className="font-medium text-foreground">Trạng thái:</span> <Badge className={statusColors[selected.status] || ""} variant="secondary">{selected.status}</Badge></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
