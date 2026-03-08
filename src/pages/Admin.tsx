import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, LogOut, Shield, Loader2 } from "lucide-react";
import type { TablesInsert } from "@/integrations/supabase/types";

type OpportunityInsert = TablesInsert<"opportunities">;

const categories = [
  { value: "scholarship", label: "Scholarship" },
  { value: "internship", label: "Internship" },
  { value: "webinar", label: "Webinar" },
  { value: "course", label: "Course" },
];

const emptyForm: OpportunityInsert = {
  title: "",
  description: "",
  category: "scholarship",
  link: "",
  provider: "",
  deadline: "",
  location: "",
  duration: "",
  speaker: "",
  event_date: "",
  event_time: "",
  featured: false,
};

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OpportunityInsert>(emptyForm);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["admin-opportunities", filterCategory],
    queryFn: async () => {
      let query = supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (filterCategory !== "all") {
        query = query.eq("category", filterCategory);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: OpportunityInsert) => {
      if (editingId) {
        const { error } = await supabase.from("opportunities").update(data).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("opportunities").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: editingId ? "Opportunity updated!" : "Opportunity created!" });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("opportunities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: "Opportunity deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openEdit = (opp: any) => {
    setEditingId(opp.id);
    setForm({
      title: opp.title,
      description: opp.description,
      category: opp.category,
      link: opp.link,
      provider: opp.provider || "",
      deadline: opp.deadline || "",
      location: opp.location || "",
      duration: opp.duration || "",
      speaker: opp.speaker || "",
      event_date: opp.event_date || "",
      event_time: opp.event_time || "",
      featured: opp.featured || false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">You don't have admin privileges. Contact the site administrator.</p>
              <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage opportunities across all categories</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Opportunity
            </Button>
            <Button variant="outline" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No opportunities found. Click "Add Opportunity" to create one.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{opp.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{opp.category}</Badge>
                      </TableCell>
                      <TableCell>{opp.provider || "—"}</TableCell>
                      <TableCell>{opp.featured ? "⭐" : "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(opp)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Delete this opportunity?")) {
                                deleteMutation.mutate(opp.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Opportunity" : "Add Opportunity"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Description *</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Link *</Label>
                  <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required type="url" />
                </div>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Input value={form.provider || ""} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input value={form.deadline || ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} placeholder="e.g. March 31, 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 6 months" />
                </div>
                <div className="space-y-2">
                  <Label>Speaker</Label>
                  <Input value={form.speaker || ""} onChange={(e) => setForm({ ...form, speaker: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Input value={form.event_date || ""} onChange={(e) => setForm({ ...form, event_date: e.target.value })} placeholder="e.g. April 15, 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Event Time</Label>
                  <Input value={form.event_time || ""} onChange={(e) => setForm({ ...form, event_time: e.target.value })} placeholder="e.g. 2:00 PM EST" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.featured || false} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <Label>Featured</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;
