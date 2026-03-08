import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

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
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} internships
          </p>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((i) => (
                <OpportunityCard
                  key={i.id}
                  title={i.title}
                  description={i.description}
                  category="Internship"
                  location={i.location ?? undefined}
                  deadline={i.deadline ?? undefined}
                  duration={i.duration ?? undefined}
                  provider={i.provider ?? undefined}
                  link={i.link}
                  featured={i.featured ?? false}
                />
              ))}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No internships found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Internships;
