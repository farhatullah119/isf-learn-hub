import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const SponsoredBadge = () => (
  <Badge className="bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/20 gap-1">
    <Sparkles className="w-3 h-3" />
    Sponsored
  </Badge>
);

export default SponsoredBadge;
