import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Calendar, Shield, LogOut, Pencil, Save, X } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";

const Profile = () => {
  const { user, profile, isAdmin, loading, signOut, fetchProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    occupation: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        occupation: profile.occupation || "",
        phone: profile.phone || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: form.full_name || null,
          occupation: form.occupation || null,
          phone: form.phone || null,
          location: form.location || null,
        }, { onConflict: "user_id" });

      if (error) throw error;
      await fetchProfile(user.id);
      setEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      full_name: profile?.full_name || "",
      occupation: profile?.occupation || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
    });
    setEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Profile" description="Your account details" />
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <PageHeader title="Profile" description="Your account details" />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">You need to be signed in to view your profile.</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  const readOnlyDetails = [
    { icon: Mail, label: "Email", value: user.email },
    {
      icon: Calendar,
      label: "Account Created",
      value: user.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
    { icon: Shield, label: "Role", value: isAdmin ? "Admin" : "User" },
  ];

  const editableFields = [
    { key: "full_name" as const, label: "Full Name", placeholder: "Your full name" },
    { key: "occupation" as const, label: "Occupation", placeholder: "e.g. Student, Engineer" },
    { key: "phone" as const, label: "Phone", placeholder: "+93 700 000 000" },
    { key: "location" as const, label: "Location", placeholder: "Kabul, Afghanistan" },
  ];

  return (
    <Layout>
      <PageHeader title="My Profile" description="Your account details" />

      <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
        {/* Avatar & Name */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <AvatarUpload
              userId={user.id}
              avatarUrl={profile?.avatar_url ?? null}
              fullName={profile?.full_name ?? null}
              onUploaded={(url) => fetchProfile(user.id)}
            />
            <div>
              <h2 className="font-serif text-xl font-bold">{profile?.full_name || user.email}</h2>
              <p className="text-sm text-muted-foreground">
                {profile?.occupation || (isAdmin ? "Administrator" : "Member")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Editable Profile Fields */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-lg">Profile Information</CardTitle>
            {!editing && (
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {editableFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        value={form[field.key]}
                        onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} disabled={saving} className="gap-1.5">
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-1.5">
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              editableFields.map((field) => (
                <div key={field.key} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{field.label}</p>
                    <p className="text-sm font-medium text-foreground">
                      {form[field.key] || "—"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Read-only Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {readOnlyDetails.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button variant="outline" className="w-full gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
