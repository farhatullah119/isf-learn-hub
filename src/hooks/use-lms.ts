import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as any[];
    },
  });
}

export function usePublicCourses() {
  return useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("*, categories(name, slug)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function usePublicCourse(slug?: string) {
  return useQuery({
    queryKey: ["public-course", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });
}

export function usePublicLessons(courseId?: string) {
  return useQuery({
    queryKey: ["public-lessons", courseId ?? "all"],
    queryFn: async () => {
      let q = (supabase as any)
        .from("lessons")
        .select("*, courses(title, slug)")
        .eq("published", true)
        .order("order_index");
      if (courseId) q = q.eq("course_id", courseId);
      const { data, error } = await q;
      if (error) throw error;
      return data as any[];
    },
  });
}

export function usePublicResources() {
  return useQuery({
    queryKey: ["public-resources"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("learning_resources")
        .select("*, categories(name)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function usePublicAnnouncements() {
  return useQuery({
    queryKey: ["public-announcements"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("announcements")
        .select("*")
        .eq("published", true)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("site_content").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as any[]).forEach((r) => (map[r.key] = r.value));
      return map;
    },
  });
}