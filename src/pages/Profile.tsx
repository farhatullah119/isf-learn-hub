import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Calendar, Shield, LogOut } from "lucide-react";

const Profile = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

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

  const details = [
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
    {
      icon: Calendar,
      label: "Last Sign In",
      value: user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "—",
    },
    { icon: Shield, label: "Role", value: isAdmin ? "Admin" : "User" },
  ];

  return (
    <Layout>
      <PageHeader title="My Profile" description="Your account details" />

      <div className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
        {/* Avatar & Name */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">{user.email}</h2>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? "Administrator" : "Member"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {details.map((item) => (
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
