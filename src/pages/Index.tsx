import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, BookOpen, Video, Users, ArrowRight, Globe, Award, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import NewsletterBanner from "@/components/NewsletterBanner";
import afghanistanFlag from "@/assets/afghanistan-flag.png";

const features = [
  {
    icon: GraduationCap,
    title: "Scholarships",
    description: "Find international and local scholarships to fund your education dreams.",
    link: "/scholarships",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Briefcase,
    title: "Internships",
    description: "Discover internship opportunities to kickstart your career.",
    link: "/internships",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Building2,
    title: "Jobs",
    description: "Find job opportunities from companies and organizations worldwide.",
    link: "/jobs",
    color: "bg-accent/10 text-accent-foreground",
  },
  {
    icon: Video,
    title: "Webinars & Seminars",
    description: "Join free webinars and seminars from industry experts.",
    link: "/webinars",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Free Courses",
    description: "Access certified courses from top universities worldwide.",
    link: "/courses",
    color: "bg-purple-100 text-purple-700",
  },
];

const stats = [
  { value: "500+", label: "Scholarships", icon: Award },
  { value: "200+", label: "Internships", icon: Briefcase },
  { value: "1000+", label: "Free Courses", icon: BookOpen },
  { value: "50K+", label: "Students Helped", icon: Users },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afghanistanFlag})` }} />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Join, Learn, Share, and Grow Together
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Your gateway to educational opportunities from around the world. Find scholarships, internships, courses, and more – all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link to="/scholarships">
                  Explore Scholarships
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/courses">Browse Free Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-serif text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Opportunities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We curate the best educational opportunities to help you achieve your goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.link}>
                <Card className="card-hover h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                ISF Learning Hub is dedicated to democratizing access to education. We believe every student deserves the opportunity to learn and grow, regardless of their background.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Global Reach</h4>
                    <p className="text-sm text-muted-foreground">Access opportunities from universities and organizations worldwide.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Career Growth</h4>
                    <p className="text-sm text-muted-foreground">Build skills and experience through internships and courses.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Community Support</h4>
                    <p className="text-sm text-muted-foreground">Join a network of learners helping each other succeed.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8">
                  <GraduationCap className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="font-serif text-2xl font-bold text-foreground">Education for Everyone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <NewsletterBanner />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Explore thousands of educational opportunities and take the first step towards your future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/scholarships">Find Scholarships</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
