import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface AffiliateLinkProps {
  url: string;
  label?: string;
}

const AffiliateLink = ({ url, label = "Enroll Now" }: AffiliateLinkProps) => (
  <Button asChild className="gap-1.5 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
    <a href={url} target="_blank" rel="noopener noreferrer sponsored">
      {label}
      <ExternalLink className="w-4 h-4" />
    </a>
  </Button>
);

export default AffiliateLink;
