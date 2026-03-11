import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle } from "lucide-react";

const submitSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  organization: z.string().trim().max(200).optional(),
  location: z.string().trim().max(100).optional(),
  deadline: z.string().optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(3000),
  link: z.string().trim().url("Please enter a valid URL"),
  category: z.string().min(1, "Please select a category"),
  submitter_name: z.string().trim().max(100).optional(),
  submitter_email: z.string().trim().email("Please enter a valid email").optional().or(z.literal("")),
});

type SubmitFormValues = z.infer<typeof submitSchema>;

const Submit = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SubmitFormValues>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      title: "",
      organization: "",
      location: "",
      deadline: "",
      description: "",
      link: "",
      category: "",
      submitter_name: "",
      submitter_email: "",
    },
  });

  const onSubmit = async (values: SubmitFormValues) => {
    setLoading(true);
    const { error } = await supabase.from("submissions" as any).insert({
      title: values.title,
      organization: values.organization || null,
      location: values.location || null,
      deadline: values.deadline || null,
      description: values.description,
      link: values.link,
      category: values.category,
      submitter_name: values.submitter_name || null,
      submitter_email: values.submitter_email || null,
    } as any);
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    setSubmitted(true);
    toast({ title: "Submitted!", description: "Your opportunity has been submitted for review." });
  };

  if (submitted) {
    return (
      <Layout>
        <SEOHead title="Submission Received | ISF Learning Hub" description="Thank you for your submission." />
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-8 pb-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
              <p className="text-muted-foreground">
                Your opportunity has been submitted and is under review. It will appear on the site once approved by our team.
              </p>
              <Button onClick={() => { setSubmitted(false); form.reset(); }} variant="outline">
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Submit an Opportunity | ISF Learning Hub"
        description="Submit a scholarship, job, internship, or course opportunity to be featured on ISF Learning Hub."
      />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submit an Opportunity</CardTitle>
            <CardDescription>
              Know about a scholarship, job, internship, or course? Share it with the community! Submissions are reviewed before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scholarship">Scholarship</SelectItem>
                        <SelectItem value="job">Job</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="course">Free Course</SelectItem>
                        <SelectItem value="webinar">Webinar / Seminar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl><Input placeholder="e.g. Scholarship in Turkey 2026" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="organization" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl><Input placeholder="Organization name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl><Input placeholder="Country or city" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="deadline" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl><Textarea placeholder="Write details about this opportunity..." rows={5} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="link" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link *</FormLabel>
                    <FormControl><Input type="url" placeholder="https://example.com/apply" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">Your info (optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="submitter_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="submitter_email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email</FormLabel>
                        <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Submitting..." : "Submit Opportunity"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Submit;
