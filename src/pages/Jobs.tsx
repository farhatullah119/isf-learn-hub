import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { MapPin, Clock, Building2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: jobs = [], isLoading } = useOpportunities("Job");

  const filtered = jobs.filter((j) => {
    return (
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.provider ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.location ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <PageHeader
        title="Jobs"
        description="Find job opportunities from companies and organizations worldwide."
      />

      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search jobs by title, company, or location..." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6">Available Positions</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((j) => (
                <Card key={j.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <Badge className="bg-accent/10 text-accent-foreground border-accent/20" variant="outline">
                      Job
                    </Badge>
                    <h3 className="font-serif text-lg font-semibold mt-2">{j.title}</h3>
                    {j.provider && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{j.provider}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-4">{j.description}</p>
                    <div className="space-y-2 text-sm">
                      {j.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{j.location}</span>
                        </div>
                      )}
                      {j.duration && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{j.duration}</span>
                        </div>
                      )}
                      {j.deadline && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Deadline: {j.deadline}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={j.link} target="_blank" rel="noopener noreferrer">
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No jobs found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;
