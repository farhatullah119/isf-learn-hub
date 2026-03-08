import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import OpportunityCard from "@/components/OpportunityCard";
import { useOpportunities } from "@/hooks/use-opportunities";
import { Skeleton } from "@/components/ui/skeleton";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses = [], isLoading } = useOpportunities("Course");

  const filtered = courses.filter((c) => {
    return (
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.provider ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      <section className="bg-purple-600 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            Free Online Courses
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Access world-class education from top universities. Earn certificates and build valuable skills at no cost.
          </p>
        </div>
      </section>

      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search courses..." />
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filtered.length} courses
          </p>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c) => (
                <OpportunityCard
                  key={c.id}
                  title={c.title}
                  description={c.description}
                  category="Course"
                  duration={c.duration ?? undefined}
                  provider={c.provider ?? undefined}
                  link={c.link}
                  featured={c.featured ?? false}
                />
              ))}
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
