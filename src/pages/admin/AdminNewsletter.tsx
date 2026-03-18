import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubscribers((data as Subscriber[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(current ? "Đã hủy đăng ký" : "Đã kích hoạt lại");
    fetchSubscribers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa subscriber này?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Đã xóa");
    fetchSubscribers();
  };

  const exportCSV = () => {
    const active = subscribers.filter(s => s.is_active);
    const csv = "Email,Ngày đăng ký\n" + active.map(s => `${s.email},${format(new Date(s.created_at), "dd/MM/yyyy")}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter_subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8 text-muted-foreground">Đang tải...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-primary">Newsletter ({subscribers.length})</h1>
        <Button variant="outline" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-1" /> Xuất CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày đăng ký</TableHead>
            <TableHead className="w-24"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.email}</TableCell>
              <TableCell>
                <Badge
                  className={s.is_active ? "bg-green-100 text-green-800 cursor-pointer" : "bg-muted text-muted-foreground cursor-pointer"}
                  variant="secondary"
                  onClick={() => toggleActive(s.id, s.is_active)}
                >
                  {s.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(s.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {subscribers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                Chưa có subscriber nào
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminNewsletter;
