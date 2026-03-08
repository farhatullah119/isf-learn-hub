import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import OpportunityForm from "./OpportunityForm";

interface OpportunityTableProps {
  category?: string;
  title: string;
}

export default function OpportunityTable({ category, title }: OpportunityTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["admin-opportunities", category || "all"],
    queryFn: async () => {
      let query = supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("opportunities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: "Opportunity deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const openCreate = () => {
    setEditingId(null);
    setEditingData(null);
    setDialogOpen(true);
  };

  const openEdit = (opp: any) => {
    setEditingId(opp.id);
    setEditingData(opp);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No posts yet. Click "Add New" to publish your first one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    {!category && <TableHead>Category</TableHead>}
                    <TableHead>Provider</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opp) => (
                    <TableRow key={opp.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{opp.title}</TableCell>
                      {!category && (
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{opp.category}</Badge>
                        </TableCell>
                      )}
                      <TableCell>{opp.provider || "—"}</TableCell>
                      <TableCell className="text-sm">{opp.deadline || "—"}</TableCell>
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
            </div>
          )}
        </CardContent>
      </Card>

      {dialogOpen && (
        <OpportunityForm
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingId={editingId}
          initialData={editingData}
          defaultCategory={category}
        />
      )}
    </div>
  );
}
