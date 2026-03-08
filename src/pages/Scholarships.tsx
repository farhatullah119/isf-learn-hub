import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import OpportunityCard from "@/components/OpportunityCard";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";

const regions = ["United States", "United Kingdom", "Germany", "Europe", "Australia", "Sweden"];

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
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Discover fully funded scholarships from universities and organizations around the world.
          </p>
        </div>
      </section>

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
              {filtered.map((s) => (
                <OpportunityCard
                  key={s.id}
                  title={s.title}
                  description={s.description}
                  category="Scholarship"
                  location={s.location ?? undefined}
                  deadline={s.deadline ?? undefined}
                  provider={s.provider ?? undefined}
                  link={s.link}
                  featured={s.featured ?? false}
                />
              ))}
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
