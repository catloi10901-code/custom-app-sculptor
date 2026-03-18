import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("sort_order");
    if (!error && data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingId) setSlug(generateSlug(val));
  };

  const resetForm = () => {
    setName(""); setSlug(""); setIcon(""); setDescription(""); setSortOrder(0);
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || "");
    setDescription(cat.description || "");
    setSortOrder(cat.sort_order);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast({ title: "Vui lòng nhập tên và slug", variant: "destructive" });
      return;
    }

    const payload = { name: name.trim(), slug: slug.trim(), icon: icon.trim() || null, description: description.trim() || null, sort_order: sortOrder };

    if (editingId) {
      const { error } = await supabase.from("blog_categories").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Lỗi cập nhật", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Đã cập nhật chuyên mục" });
    } else {
      const { error } = await supabase.from("blog_categories").insert(payload);
      if (error) { toast({ title: "Lỗi tạo chuyên mục", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Đã tạo chuyên mục mới" });
    }
    resetForm();
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa chuyên mục này?")) return;
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) { toast({ title: "Lỗi xóa", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Đã xóa chuyên mục" });
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Quản lý Chuyên Mục</h1>
        {!showForm && (
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Thêm chuyên mục
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{editingId ? "Sửa chuyên mục" : "Thêm chuyên mục mới"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tên chuyên mục *</Label>
                <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="VD: Đức Tin" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug *</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="duc-tin" />
              </div>
              <div className="space-y-1.5">
                <Label>Icon (emoji)</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="✝️" />
              </div>
              <div className="space-y-1.5">
                <Label>Thứ tự</Label>
                <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Mô tả</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả ngắn..." />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">{editingId ? "Cập nhật" : "Tạo mới"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Hủy</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-20">Thứ tự</TableHead>
                <TableHead className="w-28">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Đang tải...</TableCell></TableRow>
              ) : categories.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chưa có chuyên mục nào</TableCell></TableRow>
              ) : categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-xl">{cat.icon || "📁"}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{cat.slug}</TableCell>
                  <TableCell>{cat.sort_order}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
