import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye, MousePointer } from "lucide-react";
import { format } from "date-fns";
import ImageUpload from "@/components/admin/ImageUpload";

const placements = ["homepage-top", "homepage-bottom", "sidebar", "listing-inline", "blog-inline"];

interface AdForm {
  title: string;
  image_url: string;
  link_url: string;
  placement: string;
  is_active: boolean;
}

const emptyForm: AdForm = {
  title: "",
  image_url: "",
  link_url: "",
  placement: "sidebar",
  is_active: true,
};

const AdminAds = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdForm>(emptyForm);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: ads, isLoading } = useQuery({
    queryKey: ["admin-ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_banners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: AdForm) => {
      if (editingId) {
        const { error } = await supabase.from("ad_banners").update(data as any).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ad_banners").insert(data as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editingId ? "Ad updated!" : "Ad created!" });
      qc.invalidateQueries({ queryKey: ["admin-ads"] });
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ad_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Ad deleted" });
      qc.invalidateQueries({ queryKey: ["admin-ads"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (ad: any) => {
    setForm({
      title: ad.title,
      image_url: ad.image_url,
      link_url: ad.link_url,
      placement: ad.placement,
      is_active: ad.is_active,
    });
    setEditingId(ad.id);
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim() || !form.link_url.trim()) {
      toast({ title: "All fields are required", variant: "destructive" });
      return;
    }
    saveMutation.mutate(form);
  };

  return (
    <AdminLayout title="Ad Banners" description="Manage sponsored banners and ad placements">
      <div className="flex items-center justify-between mb-6">
        <Dialog open={formOpen} onOpenChange={(open) => { if (!open) resetForm(); setFormOpen(open); }}>
          <DialogTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="w-4 h-4" /> New Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Ad" : "Create New Ad"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ad campaign name" />
              </div>
              <div>
                <Label>Banner Image</Label>
                <ImageUpload imageUrl={form.image_url || null} onUploaded={(url) => setForm((f) => ({ ...f, image_url: url || "" }))} />
              </div>
              <div>
                <Label>Destination URL</Label>
                <Input value={form.link_url} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} placeholder="https://partner-site.com" />
              </div>
              <div>
                <Label>Placement</Label>
                <Select value={form.placement} onValueChange={(v) => setForm((f) => ({ ...f, placement: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {placements.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : ads && ads.length > 0 ? (
                ads.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{ad.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{ad.placement}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ad.impression_count}</span>
                        <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" />{ad.click_count}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(ad.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(ad.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No ad banners yet. Create your first one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAds;
