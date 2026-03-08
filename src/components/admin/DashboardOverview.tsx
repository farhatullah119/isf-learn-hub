import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Video, BookOpen, Users, Loader2 } from "lucide-react";

const statCards = [
  { key: "job", label: "Jobs", icon: Briefcase, color: "text-blue-600 bg-blue-100" },
  { key: "scholarship", label: "Scholarships", icon: GraduationCap, color: "text-primary bg-primary/10" },
  { key: "internship", label: "Internships", icon: Users, color: "text-teal-600 bg-teal-100" },
  { key: "webinar", label: "Webinars", icon: Video, color: "text-amber-600 bg-amber-100" },
  { key: "course", label: "Courses", icon: BookOpen, color: "text-purple-600 bg-purple-100" },
];

export default function DashboardOverview() {
  const { data: counts, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("opportunities").select("category");
      if (error) throw error;
      const result: Record<string, number> = {};
      for (const row of data) {
        const cat = row.category.toLowerCase();
        result[cat] = (result[cat] || 0) + 1;
      }
      return result;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{counts?.[stat.key] || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total active posts</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
