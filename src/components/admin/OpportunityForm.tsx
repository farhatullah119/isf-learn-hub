import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";
import type { TablesInsert } from "@/integrations/supabase/types";

type OpportunityInsert = TablesInsert<"opportunities">;

const categories = [
  { value: "job", label: "Job" },
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
  about_org: "",
  job_description_full: "",
  job_requirements: "",
  work_experience: "",
  submission_guidelines: "",
  image_url: "",
};

interface OpportunityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  initialData?: any;
  defaultCategory?: string;
}

export default function OpportunityForm({ open, onOpenChange, editingId, initialData, defaultCategory }: OpportunityFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<OpportunityInsert>(() => {
    if (initialData) {
      return {
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        link: initialData.link,
        provider: initialData.provider || "",
        deadline: initialData.deadline || "",
        location: initialData.location || "",
        duration: initialData.duration || "",
        speaker: initialData.speaker || "",
        event_date: initialData.event_date || "",
        event_time: initialData.event_time || "",
        featured: initialData.featured || false,
        about_org: initialData.about_org || "",
        job_description_full: initialData.job_description_full || "",
        job_requirements: initialData.job_requirements || "",
        work_experience: initialData.work_experience || "",
        submission_guidelines: initialData.submission_guidelines || "",
        image_url: initialData.image_url || "",
      };
    }
    return { ...emptyForm, category: defaultCategory || "scholarship" };
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
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast({ title: editingId ? "Opportunity updated!" : "Opportunity published!" });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const isJobOrInternship = form.category === "job" || form.category === "internship";
  const isWebinar = form.category === "webinar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? "Edit Opportunity" : "Add New Opportunity"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Thumbnail Image</Label>
              <ImageUpload
                imageUrl={form.image_url || null}
                onUploaded={(url) => setForm({ ...form, image_url: url || "" })}
              />
            </div>
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
              <Label>Link to Apply *</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} required type="url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Provider / Organization</Label>
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

            {isWebinar && (
              <>
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
              </>
            )}

            {isJobOrInternship && (
              <>
                <div className="space-y-2 sm:col-span-2">
                  <Label>About Organization</Label>
                  <Textarea value={form.about_org || ""} onChange={(e) => setForm({ ...form, about_org: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Full Job Description</Label>
                  <Textarea value={form.job_description_full || ""} onChange={(e) => setForm({ ...form, job_description_full: e.target.value })} rows={3} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Requirements</Label>
                  <Textarea value={form.job_requirements || ""} onChange={(e) => setForm({ ...form, job_requirements: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Work Experience</Label>
                  <Textarea value={form.work_experience || ""} onChange={(e) => setForm({ ...form, work_experience: e.target.value })} rows={2} />
                </div>
              </>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label>Submission Guidelines</Label>
              <Textarea value={form.submission_guidelines || ""} onChange={(e) => setForm({ ...form, submission_guidelines: e.target.value })} rows={2} />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch checked={form.featured || false} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label>Featured (pinned to top)</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={(form as any).sponsored || false} onCheckedChange={(v) => setForm({ ...form, sponsored: v } as any)} />
              <Label>Sponsored (monetized listing)</Label>
            </div>

            <div className="space-y-2">
              <Label>Affiliate URL (optional)</Label>
              <Input value={(form as any).affiliate_url || ""} onChange={(e) => setForm({ ...form, affiliate_url: e.target.value } as any)} placeholder="https://partner.com?ref=isf" />
            </div>
            <div className="space-y-2">
              <Label>Affiliate Button Label</Label>
              <Input value={(form as any).affiliate_label || ""} onChange={(e) => setForm({ ...form, affiliate_label: e.target.value } as any)} placeholder="Enroll Now" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "🚀 Publish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
