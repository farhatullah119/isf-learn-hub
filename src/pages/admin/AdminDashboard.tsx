import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  PlayCircle,
  FolderOpen,
  Megaphone,
  MailOpen,
  Loader2,
  Tags,
} from "lucide-react";

const cards = [
  { key: "users", label: "Total Users", icon: Users, to: "/admin/users", tone: "bg-primary/10 text-primary" },
  { key: "courses", label: "Courses", icon: BookOpen, to: "/admin/courses-lms", tone: "bg-secondary/10 text-secondary" },
  { key: "lessons", label: "Lessons", icon: PlayCircle, to: "/admin/lessons", tone: "bg-primary/10 text-primary" },
  { key: "resources", label: "Resources", icon: FolderOpen, to: "/admin/resources", tone: "bg-secondary/10 text-secondary" },
  { key: "announcements", label: "Announcements", icon: Megaphone, to: "/admin/announcements", tone: "bg-primary/10 text-primary" },
  { key: "categories", label: "Categories", icon: Tags, to: "/admin/categories", tone: "bg-secondary/10 text-secondary" },
  { key: "messages", label: "New Messages", icon: MailOpen, to: "/admin/messages", tone: "bg-primary/10 text-primary" },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-lms-stats"],
    queryFn: async () => {
      const count = async (table: string, filter?: (q: any) => any) => {
        let q = (supabase as any).from(table).select("*", { count: "exact", head: true });
        if (filter) q = filter(q);
        const { count: c } = await q;
        return c ?? 0;
      };
      const [users, courses, lessons, resources, announcements, categories, messages] =
        await Promise.all([
          count("profiles"),
          count("courses"),
          count("lessons"),
          count("learning_resources"),
          count("announcements"),
          count("categories"),
          count("contact_messages", (q: any) => q.eq("status", "new")),
        ]);

      const [{ data: recentCourses }, { data: recentLessons }, { data: recentMessages }] =
        await Promise.all([
          (supabase as any).from("courses").select("id, title, published, created_at").order("created_at", { ascending: false }).limit(5),
          (supabase as any).from("lessons").select("id, title, published, created_at").order("created_at", { ascending: false }).limit(5),
          (supabase as any).from("contact_messages").select("id, name, subject, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

      return {
        counts: { users, courses, lessons, resources, announcements, categories, messages },
        recentCourses: recentCourses ?? [],
        recentLessons: recentLessons ?? [],
        recentMessages: recentMessages ?? [],
      };
    },
  });

  return (
    <AdminLayout title="Dashboard" description="ISF Learning Hub control centre">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => (
              <Link key={c.key} to={c.to}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {c.label}
                    </CardTitle>
                    <div className={`rounded-lg p-2 ${c.tone}`}>
                      <c.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {(data as any)?.counts[c.key] ?? 0}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.recentCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground">No courses yet.</p>
                )}
                {data?.recentCourses.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{c.title}</span>
                    <Badge variant={c.published ? "default" : "secondary"}>
                      {c.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.recentLessons.length === 0 && (
                  <p className="text-sm text-muted-foreground">No lessons yet.</p>
                )}
                {data?.recentLessons.map((l: any) => (
                  <div key={l.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{l.title}</span>
                    <Badge variant={l.published ? "default" : "secondary"}>
                      {l.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latest messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.recentMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No messages yet.</p>
                )}
                {data?.recentMessages.map((m: any) => (
                  <div key={m.id} className="text-sm">
                    <p className="font-medium">{m.name}</p>
                    <p className="truncate text-muted-foreground">{m.subject || "(no subject)"}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}