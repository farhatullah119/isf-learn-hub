import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { Calendar, Clock, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";

const Webinars = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: webinars = [], isLoading } = useOpportunities("Webinar");

  const filtered = webinars.filter((w) => {
    return (
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.speaker ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <section className="bg-amber-500 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            Webinars & Seminars
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Join free online events led by experts. Learn from industry professionals and connect with fellow students.
          </p>
        </div>
      </section>

      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search webinars and seminars..." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6">Upcoming Events</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((w) => (
                <Card key={w.id} className="card-hover">
                  <CardHeader className="pb-3">
                    <Badge className="bg-primary/10 text-primary" variant="outline">
                      Webinar
                    </Badge>
                    <h3 className="font-serif text-lg font-semibold mt-2">{w.title}</h3>
                    {w.speaker && <p className="text-sm text-muted-foreground">{w.speaker}</p>}
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-4">{w.description}</p>
                    <div className="space-y-2 text-sm">
                      {w.event_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{w.event_date}</span>
                        </div>
                      )}
                      {w.event_time && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{w.event_time}</span>
                        </div>
                      )}
                      {w.attendees && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{w.attendees} registered</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={w.link} target="_blank" rel="noopener noreferrer">
                        Register Now
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
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Webinars;
