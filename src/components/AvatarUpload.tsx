import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Camera, Loader2, User } from "lucide-react";

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
  fullName: string | null;
  onUploaded: (url: string) => void;
}

const AvatarUpload = ({ userId, avatarUrl, fullName, onUploaded }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const publicUrl = getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ user_id: userId, avatar_url: publicUrl }, { onConflict: "user_id" });

      if (updateError) throw updateError;

      onUploaded(publicUrl);
      toast({ title: "Avatar updated", description: "Your profile photo has been changed." });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const initials = fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative group">
      <Avatar className="h-20 w-20">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={fullName || "Avatar"} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
          {initials || <User className="h-8 w-8" />}
        </AvatarFallback>
      </Avatar>

      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
};

export default AvatarUpload;
