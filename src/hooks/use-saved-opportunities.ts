import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function useSavedOpportunities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedIds = [], isLoading } = useQuery({
    queryKey: ["saved-opportunities", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("opportunity_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((d: any) => d.opportunity_id as string);
    },
    enabled: !!user,
  });

  const isSaved = (opportunityId: string) => savedIds.includes(opportunityId);

  const toggleSave = useMutation({
    mutationFn: async (opportunityId: string) => {
      if (!user) throw new Error("Please sign in to save opportunities");
      const alreadySaved = isSaved(opportunityId);
      if (alreadySaved) {
        const { error } = await supabase
          .from("saved_opportunities")
          .delete()
          .eq("user_id", user.id)
          .eq("opportunity_id", opportunityId);
        if (error) throw error;
        return { action: "removed" as const };
      } else {
        const { error } = await supabase
          .from("saved_opportunities")
          .insert({ user_id: user.id, opportunity_id: opportunityId } as any);
        if (error) throw error;
        return { action: "saved" as const };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["saved-opportunities"] });
      toast({
        title: result.action === "saved" ? "Saved! ⭐" : "Removed from saved",
      });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return { savedIds, isSaved, toggleSave: toggleSave.mutate, isLoading, isToggling: toggleSave.isPending };
}
