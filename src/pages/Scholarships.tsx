import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, GraduationCap, AlertTriangle } from "lucide-react";
import { isDeadlineExpired } from "@/lib/deadline";
import SaveButton from "@/components/SaveButton";

const regions = ["United States", "United Kingdom", "Germany", "Europe", "Australia", "Sweden", "Malaysia", "Afghanistan"];

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const { data: scholarships = [], isLoading } = useOpportunities("Scholarship");

  const filtered = scholarships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "all" || s.location === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <Layout>
      <PageHeader
        title="Scholarships"
        description="Discover scholarships from around the world to fund your education and achieve your academic dreams."
      />
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search scholarships..." />
          <CategoryFilter categories={regions} selected={selectedRegion} onChange={setSelectedRegion} />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} scholarships
          </p>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => {
                const expired = isDeadlineExpired(s.deadline);
                return (
                  <Link key={s.id} to={`/scholarships/${s.id}`}>
                    <Card className={`card-hover h-full overflow-hidden ${expired ? "opacity-75" : ""}`}>
                      {s.image_url && (
                        <div className="w-full h-40 overflow-hidden">
                          <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                              Scholarship
                            </Badge>
                            {expired && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Expired
                              </Badge>
                            )}
                            {s.featured && (
                              <Badge className="bg-secondary/10 text-secondary border-secondary/20" variant="outline">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <SaveButton opportunityId={s.id} />
                        </div>
                        <h3 className="font-serif text-lg font-semibold mt-2">{s.title}</h3>
                        {s.provider && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4" />
                            <span>{s.provider}</span>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{s.description}</p>
                        <div className="space-y-2 text-sm">
                          {s.location && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{s.location}</span>
                            </div>
                          )}
                          {s.deadline && (
                            <div className={`flex items-center gap-2 ${expired ? "text-destructive" : "text-muted-foreground"}`}>
                              <Clock className="w-4 h-4" />
                              <span>Deadline: {s.deadline}{expired ? " (Expired)" : ""}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant={expired ? "outline" : "default"}>
                          {expired ? "View Details" : "View & Apply"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Scholarships;
