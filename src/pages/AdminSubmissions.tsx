import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, X, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminSubmissions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewing, setViewing] = useState<any>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmAction, setConfirmAction] = useState<null | "approve" | "reject">(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const pendingSubmissions = useMemo(
    () => submissions.filter((s: any) => s.status === "pending"),
    [submissions]
  );
  const selectedPending = useMemo(
    () => pendingSubmissions.filter((s: any) => selected.has(s.id)),
    [pendingSubmissions, selected]
  );
  const allPendingSelected =
    pendingSubmissions.length > 0 && selectedPending.length === pendingSubmissions.length;

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPending = () => {
    if (allPendingSelected) setSelected(new Set());
    else setSelected(new Set(pendingSubmissions.map((s: any) => s.id)));
  };

  const approveMutation = useMutation({
    mutationFn: async (sub: any) => {
      const { error: insertError } = await supabase.from("opportunities").insert({
        title: sub.title,
        description: sub.description,
        category: sub.category,
        location: sub.location,
        deadline: sub.deadline,
        provider: sub.organization,
        link: sub.link,
      });
      if (insertError) throw insertError;
      const { error: updateError } = await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", sub.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: "Submission approved and published!" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("submissions").update({ status: "rejected" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast({ title: "Submission rejected" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast({ title: "Submission deleted" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const bulkApproveMutation = useMutation({
    mutationFn: async (subs: any[]) => {
      if (subs.length === 0) return { success: 0, failed: 0 };
      const { error: insertError } = await supabase.from("opportunities").insert(
        subs.map((sub) => ({
          title: sub.title,
          description: sub.description,
          category: sub.category,
          location: sub.location,
          deadline: sub.deadline,
          provider: sub.organization,
          link: sub.link,
        }))
      );
      if (insertError) throw insertError;
      const { error: updateError } = await supabase
        .from("submissions")
        .update({ status: "approved" })
        .in("id", subs.map((s) => s.id));
      if (updateError) throw updateError;
      return { count: subs.length };
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      setSelected(new Set());
      toast({ title: `Approved ${res.count} submission${res.count === 1 ? "" : "s"}` });
    },
    onError: (e: any) => toast({ title: "Bulk approve failed", description: e.message, variant: "destructive" }),
  });

  const bulkRejectMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (ids.length === 0) return { count: 0 };
      const { error } = await supabase
        .from("submissions")
        .update({ status: "rejected" })
        .in("id", ids);
      if (error) throw error;
      return { count: ids.length };
    },
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["admin-submissions"] });
      setSelected(new Set());
      toast({ title: `Rejected ${res.count} submission${res.count === 1 ? "" : "s"}` });
    },
    onError: (e: any) => toast({ title: "Bulk reject failed", description: e.message, variant: "destructive" }),
  });

  const statusColor = (s: string) => {
    if (s === "approved") return "default";
    if (s === "rejected") return "destructive";
    return "secondary";
  };

  const bulkBusy = bulkApproveMutation.isPending || bulkRejectMutation.isPending;

  return (
    <AdminLayout title="Submissions" description="Review user-submitted opportunities">
      {selectedPending.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/40 px-4 py-3">
          <div className="text-sm font-medium">
            {selectedPending.length} pending submission{selectedPending.length === 1 ? "" : "s"} selected
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setSelected(new Set())} disabled={bulkBusy}>
              Clear
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirmAction("reject")} disabled={bulkBusy}>
              <X className="h-3 w-3" /> Reject selected
            </Button>
            <Button size="sm" onClick={() => setConfirmAction("approve")} disabled={bulkBusy}>
              {bulkBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Approve selected
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No submissions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allPendingSelected}
                        onCheckedChange={toggleAllPending}
                        disabled={pendingSubmissions.length === 0}
                        aria-label="Select all pending"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub: any) => (
                    <TableRow key={sub.id} data-state={selected.has(sub.id) ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(sub.id)}
                          onCheckedChange={() => toggleOne(sub.id)}
                          disabled={sub.status !== "pending"}
                          aria-label="Select submission"
                        />
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{sub.title}</TableCell>
                      <TableCell><Badge variant="secondary" className="capitalize">{sub.category}</Badge></TableCell>
                      <TableCell className="text-sm">{sub.submitter_name || sub.submitter_email || "Anonymous"}</TableCell>
                      <TableCell><Badge variant={statusColor(sub.status)} className="capitalize">{sub.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => setViewing(sub)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          {sub.status === "pending" && (
                            <>
                              <Button size="sm" variant="default" onClick={() => approveMutation.mutate(sub)} disabled={approveMutation.isPending}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => rejectMutation.mutate(sub.id)} disabled={rejectMutation.isPending}>
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => { if (confirm("Delete?")) deleteMutation.mutate(sub.id); }}>
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

      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium">Category:</span> <span className="capitalize">{viewing.category}</span></div>
              <div><span className="font-medium">Organization:</span> {viewing.organization || "—"}</div>
              <div><span className="font-medium">Location:</span> {viewing.location || "—"}</div>
              <div><span className="font-medium">Deadline:</span> {viewing.deadline || "—"}</div>
              <div><span className="font-medium">Link:</span> <a href={viewing.link} target="_blank" rel="noopener noreferrer" className="text-primary underline">{viewing.link}</a></div>
              <div><span className="font-medium">Description:</span><p className="mt-1 text-muted-foreground">{viewing.description}</p></div>
              <div><span className="font-medium">Submitter:</span> {viewing.submitter_name || "—"} ({viewing.submitter_email || "—"})</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "approve" ? "Approve" : "Reject"} {selectedPending.length} submission
              {selectedPending.length === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "approve"
                ? "These submissions will be published as live opportunities."
                : "These submissions will be marked as rejected."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmAction === "approve") bulkApproveMutation.mutate(selectedPending);
                else bulkRejectMutation.mutate(selectedPending.map((s: any) => s.id));
                setConfirmAction(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
