import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, Star, AlertTriangle } from "lucide-react";
import { isDeadlineExpired } from "@/lib/deadline";

function daysUntilDeadline(deadline: string | null): number | null {
  if (!deadline) return null;
  try {
    const parsed = Date.parse(deadline);
    if (isNaN(parsed)) return null;
    const diff = new Date(parsed).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

const FeaturedSection = () => {
  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ["featured-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("featured", true)
        .eq("category", "scholarship")
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: urgent, isLoading: loadingUrgent } = useQuery({
    queryKey: ["urgent-deadlines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .not("deadline", "is", null)
        .order("deadline", { ascending: true })
        .limit(20);
      if (error) throw error;
      // Filter to non-expired with deadline within 30 days
      return (data ?? [])
        .filter((o) => {
          if (isDeadlineExpired(o.deadline)) return false;
          const days = daysUntilDeadline(o.deadline);
          return days !== null && days >= 0 && days <= 30;
        })
        .slice(0, 4);
    },
  });

  const getCategoryPath = (category: string) => {
    const paths: Record<string, string> = {
      scholarship: "/scholarships",
      internship: "/internships",
      job: "/jobs",
      webinar: "/webinars",
      course: "/courses",
    };
    return paths[category] || "/";
  };

  const getDetailPath = (category: string, id: string) => {
    const paths: Record<string, string> = {
      scholarship: `/scholarships/${id}`,
      internship: `/internships/${id}`,
      job: `/jobs/${id}`,
      course: `/courses/${id}`,
    };
    return paths[category] || "/";
  };

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Featured Scholarships */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Featured Scholarships
                </h2>
                <p className="text-sm text-muted-foreground">Hand-picked opportunities for you</p>
              </div>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/scholarships">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {loadingFeatured ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}><CardContent className="p-5"><Skeleton className="h-40" /></CardContent></Card>
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((opp) => {
                const days = daysUntilDeadline(opp.deadline);
                return (
                  <Link key={opp.id} to={getDetailPath(opp.category, opp.id)}>
                    <Card className="card-hover h-full group overflow-hidden">
                      {opp.image_url && (
                        <div className="h-36 overflow-hidden">
                          <img
                            src={opp.image_url}
                            alt={opp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                          {days !== null && days <= 7 && (
                            <Badge variant="destructive" className="text-xs">
                              {days === 0 ? "Last day!" : `${days}d left`}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-serif font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {opp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{opp.description}</p>
                        {opp.deadline && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Deadline: {opp.deadline}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No featured scholarships at the moment.</p>
          )}
        </div>

        {/* Urgent Deadlines */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                  Closing Soon
                </h2>
                <p className="text-sm text-muted-foreground">Don't miss these deadlines</p>
              </div>
            </div>
          </div>

          {loadingUrgent ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}><CardContent className="p-5"><Skeleton className="h-28" /></CardContent></Card>
              ))}
            </div>
          ) : urgent && urgent.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {urgent.map((opp) => {
                const days = daysUntilDeadline(opp.deadline)!;
                const isVeryUrgent = days <= 3;
                return (
                  <Link key={opp.id} to={getDetailPath(opp.category, opp.id)}>
                    <Card className={`card-hover h-full group ${isVeryUrgent ? "border-destructive/40" : ""}`}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="text-xs capitalize">
                            {opp.category}
                          </Badge>
                          <Badge variant={isVeryUrgent ? "destructive" : "secondary"} className="text-xs font-mono">
                            {days === 0 ? "Last day!" : `${days}d left`}
                          </Badge>
                        </div>
                        <h3 className="font-serif font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{opp.deadline}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No upcoming deadlines within the next 30 days.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
