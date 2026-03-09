import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  placement: string;
  className?: string;
}

const AdBanner = ({ placement, className = "" }: AdBannerProps) => {
  const { data: banners } = useQuery({
    queryKey: ["ad-banners", placement],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ad_banners")
        .select("*")
        .eq("placement", placement)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!banners || banners.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {banners.map((banner) => (
        <a
          key={banner.id}
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <span className="text-[10px] uppercase tracking-wider bg-muted/80 text-muted-foreground px-1.5 py-0.5 rounded">
              Ad
            </span>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {banner.title}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
};

export default AdBanner;
