import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

export type CrudField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "switch" | "select" | "image" | "url";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  half?: boolean;
};

export type CrudColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: any) => React.ReactNode;
  className?: string;
};

export type CrudFilter = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
};

interface CrudManagerProps {
  table: string;
  singular: string;
  fields: CrudField[];
  columns: CrudColumn[];
  searchKeys: string[];
  filters?: CrudFilter[];
  defaults?: Record<string, any>;
  defaultSort?: { key: string; asc: boolean };
  pageSize?: number;
  slugFrom?: string;
  relatedSelect?: string;
}

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);

export default function CrudManager({
  table,
  singular,
  fields,
  columns,
  searchKeys,
  filters = [],
  defaults = {},
  defaultSort = { key: "created_at", asc: false },
  pageSize = 10,
  slugFrom,
  relatedSelect,
}: CrudManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<Record<string, string>>({});
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(relatedSelect || "*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const body = { ...payload };
      if (slugFrom && !body.slug && body[slugFrom]) body.slug = slugify(body[slugFrom]);
      Object.keys(body).forEach((k) => {
        if (body[k] === "") body[k] = null;
      });
      if (editing) {
        const { error } = await (supabase as any).from(table).update(body).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from(table).insert(body);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: ["admin-lms-stats"] });
      toast({ title: editing ? `${singular} updated` : `${singular} created` });
      setFormOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
      queryClient.invalidateQueries({ queryKey: ["admin-lms-stats"] });
      toast({ title: `${singular} deleted` });
      setDeleteTarget(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    let list = [...rows];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }
    for (const f of filters) {
      const v = filterState[f.key];
      if (v && v !== "all") {
        list = list.filter((r) => String(r[f.key] ?? "") === v);
      }
    }
    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.asc ? cmp : -cmp;
    });
    return list;
  }, [rows, search, filterState, filters, searchKeys, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openCreate = () => {
    setEditing(null);
    const initial: Record<string, any> = { ...defaults };
    fields.forEach((f) => {
      if (initial[f.name] === undefined) initial[f.name] = f.type === "switch" ? false : "";
    });
    setForm(initial);
    setFormOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      initial[f.name] = row[f.name] ?? (f.type === "switch" ? false : "");
    });
    setForm(initial);
    setFormOpen(true);
  };

  const toggleSort = (key: string) =>
    setSort((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={`Search ${singular.toLowerCase()}s...`}
                className="pl-9"
                aria-label={`Search ${singular}`}
              />
            </div>
            {filters.map((f) => (
              <Select
                key={f.key}
                value={filterState[f.key] ?? "all"}
                onValueChange={(v) => {
                  setFilterState((s) => ({ ...s, [f.key]: v }));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder={f.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {f.label}</SelectItem>
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
          <Button onClick={openCreate} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Add {singular}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((c) => (
                      <TableHead key={c.key} className={c.className}>
                        {c.sortable === false ? (
                          c.label
                        ) : (
                          <button
                            className="inline-flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleSort(c.key)}
                          >
                            {c.label}
                            {sort.key === c.key &&
                              (sort.asc ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              ))}
                          </button>
                        )}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                        No {singular.toLowerCase()}s found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paged.map((row) => (
                      <TableRow key={row.id}>
                        {columns.map((c) => (
                          <TableCell key={c.key} className={c.className}>
                            {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                          </TableCell>
                        ))}
                        <TableCell className="text-right whitespace-nowrap">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget(row)}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} {singular.toLowerCase()}
          {filtered.length === 1 ? "" : "s"} · page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${singular}` : `Add ${singular}`}
            </DialogTitle>
            <DialogDescription>
              Changes appear on the public website immediately after saving.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
          >
            {fields.map((f) => (
              <div key={f.name} className={`space-y-2 ${f.half ? "" : "sm:col-span-2"}`}>
                {f.type !== "switch" && <Label htmlFor={f.name}>{f.label}</Label>}
                {f.type === "textarea" && (
                  <Textarea
                    id={f.name}
                    rows={5}
                    maxLength={20000}
                    value={form[f.name] ?? ""}
                    placeholder={f.placeholder}
                    required={f.required}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                )}
                {(f.type === "text" || f.type === "url" || f.type === "number") && (
                  <Input
                    id={f.name}
                    type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                    maxLength={f.type === "number" ? undefined : 500}
                    value={form[f.name] ?? ""}
                    placeholder={f.placeholder}
                    required={f.required}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                      })
                    }
                  />
                )}
                {f.type === "select" && (
                  <Select
                    value={form[f.name] ? String(form[f.name]) : ""}
                    onValueChange={(v) => setForm({ ...form, [f.name]: v })}
                  >
                    <SelectTrigger id={f.name}>
                      <SelectValue placeholder={f.placeholder || `Select ${f.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options || []).map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {f.type === "image" && (
                  <ImageUpload
                    imageUrl={form[f.name] || null}
                    onUploaded={(url) => setForm({ ...form, [f.name]: url })}
                  />
                )}
                {f.type === "switch" && (
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label htmlFor={f.name} className="cursor-pointer">
                      {f.label}
                    </Label>
                    <Switch
                      id={f.name}
                      checked={!!form[f.name]}
                      onCheckedChange={(v) => setForm({ ...form, [f.name]: v })}
                    />
                  </div>
                )}
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            ))}
            <DialogFooter className="sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : editing ? "Save changes" : `Create ${singular}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes “{deleteTarget?.title || deleteTarget?.name || deleteTarget?.key}”
              and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && remove.mutate(deleteTarget.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function StatusBadge({ value, trueLabel = "Published", falseLabel = "Draft" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return <Badge variant={value ? "default" : "secondary"}>{value ? trueLabel : falseLabel}</Badge>;
}