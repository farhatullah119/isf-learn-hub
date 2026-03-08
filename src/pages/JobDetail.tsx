import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Building2, ExternalLink, ArrowLeft, Calendar, Briefcase, GraduationCap, Globe, AlertTriangle } from "lucide-react";
import { isDeadlineExpired } from "@/lib/deadline";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading } = useQuery({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const expired = job ? isDeadlineExpired(job.deadline) : false;

  if (isLoading) {
    return (
      <Layout>
        <PageHeader title="Loading..." description="" />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <PageHeader title="Job Not Found" description="This job listing could not be found." />
        <div className="container mx-auto px-4 py-12 text-center">
          <Button asChild>
            <Link to="/jobs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Split description into paragraphs for better readability
  const descriptionParagraphs = job.description.split("\n").filter((p) => p.trim());

  const overviewItems = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Building2, label: "Organization", value: job.provider },
    { icon: Clock, label: "Contract Duration", value: job.duration },
    { icon: Calendar, label: "Deadline", value: job.deadline },
    { icon: Briefcase, label: "Category", value: job.category },
  ].filter((item) => item.value);

  return (
    <Layout>
      <PageHeader title={job.title} description={job.provider || "Job Opportunity"} />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <Badge className="bg-accent/10 text-accent-foreground border-accent/20" variant="outline">
                Job
              </Badge>
              {expired && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Expired
                </Badge>
              )}
              {job.featured && (
                <Badge className="bg-secondary/10 text-secondary border-secondary/20" variant="outline">
                  Featured
                </Badge>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-xl font-bold mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
                  {descriptionParagraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Job Overview */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-bold mb-4">Job Overview</h3>
                <div className="space-y-4">
                  {overviewItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className={`text-sm font-medium ${item.label === "Deadline" && expired ? "text-destructive" : "text-foreground"}`}>
                          {item.value}
                          {item.label === "Deadline" && expired && " (Expired)"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                {expired ? (
                  <div className="text-center">
                    <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm font-medium text-destructive mb-1">Application Closed</p>
                    <p className="text-xs text-muted-foreground">The deadline for this position has passed.</p>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" asChild>
                    <a href={job.link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
