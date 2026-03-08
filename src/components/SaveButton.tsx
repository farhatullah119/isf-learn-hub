import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/use-saved-opportunities";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  opportunityId: string;
  variant?: "icon" | "full";
  className?: string;
}

const SaveButton = ({ opportunityId, variant = "icon", className }: SaveButtonProps) => {
  const { user } = useAuth();
  const { isSaved, toggleSave, isToggling } = useSavedOpportunities();

  if (!user) return null;

  const saved = isSaved(opportunityId);

  if (variant === "icon") {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={cn("h-8 w-8 shrink-0", className)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSave(opportunityId);
        }}
        disabled={isToggling}
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", saved ? "fill-destructive text-destructive" : "text-muted-foreground")}
        />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "secondary" : "outline"}
      className={cn("gap-2", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(opportunityId);
      }}
      disabled={isToggling}
    >
      <Heart
        className={cn("h-4 w-4", saved ? "fill-destructive text-destructive" : "")}
      />
      {saved ? "Saved" : "Save"}
    </Button>
  );
};

export default SaveButton;
