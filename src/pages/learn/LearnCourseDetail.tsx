import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { usePublicCourse, usePublicLessons } from "@/hooks/use-lms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Clock, Globe, Loader2, User } from "lucide-react";

export default function LearnCourseDetail() {
  const { slug } = useParams();
  const { data: course, isLoading } = usePublicCourse(slug);
  const { data: lessons = [] } = usePublicLessons(course?.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-4 font-serif text-2xl font-bold">Course not found</h1>
          <Button asChild variant="outline">
            <Link to="/learn">Back to courses</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={course.title}
        description={course.summary?.slice(0, 155) || "Free course on the ISF Learning Hub."}
        path={`/learn/${course.slug}`}
        type="article"
        image={course.image_url || undefined}
      />
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4">
          <Link
            to="/learn"
            className="mb-4 inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All courses
          </Link>
          <h1 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
            {course.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-primary-foreground/90">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {course.duration || "Self-paced"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-4 w-4" /> {course.language}
            </span>
            {course.instructor && (
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" /> {course.instructor}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About this course</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-line text-muted-foreground">
              {course.description || course.summary}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lessons ({lessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">Lessons are being prepared.</p>
              ) : (
                <Accordion type="single" collapsible>
                  {lessons.map((l: any, i: number) => (
                    <AccordionItem key={l.id} value={l.id}>
                      <AccordionTrigger className="text-left">
                        <span className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{i + 1}</span>
                          {l.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3">
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {l.content || l.summary}
                        </p>
                        {l.video_url && (
                          <Button asChild size="sm" variant="outline">
                            <a href={l.video_url} target="_blank" rel="noopener noreferrer">
                              Watch lesson video
                            </a>
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          {course.image_url && (
            <img
              src={course.image_url}
              alt={`${course.title} course cover`}
              loading="lazy"
              className="w-full rounded-lg object-cover"
            />
          )}
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                {course.categories?.name && (
                  <Badge variant="outline">{course.categories.name}</Badge>
                )}
              </div>
              {course.external_url && (
                <Button asChild className="w-full">
                  <a href={course.external_url} target="_blank" rel="noopener noreferrer">
                    Go to course material
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link to="/announcements">Latest announcements</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </Layout>
  );
}
