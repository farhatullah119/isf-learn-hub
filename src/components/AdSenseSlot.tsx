import { useEffect } from "react";

interface AdSenseSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

/**
 * Google AdSense ad slot component.
 * Set your AdSense client ID in index.html script tag.
 * Each slot ID comes from your AdSense dashboard.
 */
const AdSenseSlot = ({ slot, format = "auto", className = "" }: AdSenseSlotProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <p className="text-[10px] text-muted-foreground text-center mt-1">Advertisement</p>
    </div>
  );
};

export default AdSenseSlot;
