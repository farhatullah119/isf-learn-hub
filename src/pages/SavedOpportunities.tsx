import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useSavedOpportunities } from "@/hooks/use-saved-opportunities";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SaveButton from "@/components/SaveButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Building2, Heart } from "lucide-react";

const categoryLinks: Record<string, string> = {
  scholarship: "/scholarships",
  internship: "/internships",
  job: "/jobs",
  webinar: "/webinars",
  course: "/courses",
};

const SavedOpportunities = () => {
  const { user, loading: authLoading } = useAuth();
  const { savedIds, isLoading: savedLoading } = useSavedOpportunities();

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["saved-opportunity-details", savedIds],
    queryFn: async () => {
      if (savedIds.length === 0) return [];
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .in("id", savedIds);
      if (error) throw error;
      return data;
    },
    enabled: savedIds.length > 0,
  });

  if (authLoading) {
    return (
      <Layout>
        <PageHeader title="Saved Opportunities" description="" />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <PageHeader title="Saved Opportunities" description="Sign in to save and view your favorite opportunities." />
        <div className="container mx-auto px-4 py-12 text-center">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-6">You need to be signed in to save opportunities.</p>
          <div className="flex gap-3 justify-center">
            <Button asChild><Link to="/login">Sign In</Link></Button>
            <Button asChild variant="outline"><Link to="/register">Create Account</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  const loading = savedLoading || isLoading;

  return (
    <Layout>
      <PageHeader
        title="Saved Opportunities"
        description={`You have ${opportunities.length} saved ${opportunities.length === 1 ? "opportunity" : "opportunities"}.`}
      />
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-6">You haven't saved any opportunities yet.</p>
              <Button asChild><Link to="/scholarships">Browse Opportunities</Link></Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => {
                const detailLink = `${categoryLinks[opp.category] || "/scholarships"}/${opp.id}`;
                return (
                  <Link key={opp.id} to={detailLink}>
                    <Card className="card-hover h-full overflow-hidden">
                      {opp.image_url && (
                        <div className="w-full h-40 overflow-hidden">
                          <img src={opp.image_url} alt={opp.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge className="capitalize" variant="outline">{opp.category}</Badge>
                          <SaveButton opportunityId={opp.id} />
                        </div>
                        <h3 className="font-serif text-lg font-semibold mt-2">{opp.title}</h3>
                        {opp.provider && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>{opp.provider}</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{opp.description}</p>
                        <div className="space-y-2 text-sm">
                          {opp.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" /><span>{opp.location}</span>
                            </div>
                          )}
                          {opp.deadline && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" /><span>Deadline: {opp.deadline}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">View Details</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SavedOpportunities;
