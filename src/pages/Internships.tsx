import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, AlertTriangle } from "lucide-react";
import { isDeadlineExpired } from "@/lib/deadline";

const Internships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: internships = [], isLoading } = useOpportunities("Internship");

  const filtered = internships.filter((i) => {
    return (
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.provider ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <PageHeader
        title="Internships"
        description="Kickstart your career with internship opportunities at leading companies and organizations worldwide."
      />
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search internships..." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">Showing {filtered.length} internships</p>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => {
                const expired = isDeadlineExpired(item.deadline);
                return (
                  <Link key={item.id} to={`/internships/${item.id}`}>
                    <Card className={`card-hover h-full overflow-hidden ${expired ? "opacity-75" : ""}`}>
                      {item.image_url && (
                        <div className="w-full h-40 overflow-hidden">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20" variant="outline">Internship</Badge>
                          {expired && <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Expired</Badge>}
                          {item.featured && <Badge className="bg-secondary/10 text-secondary border-secondary/20" variant="outline">Featured</Badge>}
                        </div>
                        <h3 className="font-serif text-lg font-semibold mt-2">{item.title}</h3>
                        {item.provider && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building2 className="w-4 h-4" /><span>{item.provider}</span></div>}
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                        <div className="space-y-2 text-sm">
                          {item.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>{item.location}</span></div>}
                          {item.duration && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>{item.duration}</span></div>}
                          {item.deadline && <div className={`flex items-center gap-2 ${expired ? "text-destructive" : "text-muted-foreground"}`}><Clock className="w-4 h-4" /><span>Deadline: {item.deadline}{expired ? " (Expired)" : ""}</span></div>}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant={expired ? "outline" : "default"}>{expired ? "View Details" : "View & Apply"}</Button>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12"><p className="text-muted-foreground">No internships found matching your criteria.</p></div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Internships;
