import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, TrendingUp, Users, Heart } from "lucide-react";

const values = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access opportunities from universities and organizations worldwide.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Build skills and experience through internships and courses.",
  },
  {
    icon: Heart,
    title: "Volunteer",
    description: "Give back and gain meaningful experience through volunteer opportunities.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Join a network of learners helping each other succeed.",
  },
];

const About = () => {
  return (
    <Layout>
      <PageHeader
        title="About Us"
        description="Join, Learn, Share, and Grow Together."
      />

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ISF Learning Hub is dedicated to democratizing access to education. We believe every
            student deserves the opportunity to learn and grow, regardless of their background.
            Especially Afghan Refugees, Afghan Females, and <span className="font-semibold text-foreground">you</span>.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold text-center mb-10">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item) => (
              <Card key={item.title} className="text-center border-none shadow-md">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
