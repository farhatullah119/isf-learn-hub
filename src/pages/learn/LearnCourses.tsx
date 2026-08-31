import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import SEOHead from "@/components/SEOHead";
import { usePublicCourses } from "@/hooks/use-lms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Clock, User } from "lucide-react";

export default function LearnCourses() {
  const { data: courses = [], isLoading } = usePublicCourses();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c: any) =>
      [c.title, c.summary, c.instructor, c.level].some((v) =>
        String(v ?? "").toLowerCase().includes(q)
      )
    );
  }, [courses, search]);

  return (
    <Layout>
      <SEOHead
        title="Courses"
        description="Browse free, practical courses on the ISF Learning Hub covering skills, languages and career development."
        path="/learn"
      />
      <PageHeader
        title="Courses"
        description="Structured learning paths created by the ISF Learning Hub team."
      />
      <section className="container mx-auto px-4 py-10">
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="pl-9"
            aria-label="Search courses"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No courses published yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c: any) => (
              <Card key={c.id} className="flex h-full flex-col overflow-hidden">
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt={`${c.title} course cover`}
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{c.level}</Badge>
                    {c.categories?.name && <Badge variant="outline">{c.categories.name}</Badge>}
                    {c.featured && <Badge>Featured</Badge>}
                  </div>
                  <CardTitle className="font-serif text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{c.summary}</p>
                  <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {c.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {c.duration}
                      </span>
                    )}
                    {c.instructor && (
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" /> {c.instructor}
                      </span>
                    )}
                  </div>
                  <Button asChild className="mt-auto w-full">
                    <Link to={`/learn/${c.slug}`}>View course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
