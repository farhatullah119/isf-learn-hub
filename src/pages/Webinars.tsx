import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import { Calendar, Clock, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const webinars = [
  {
    title: "Mastering Your Scholarship Application",
    description: "Learn proven strategies for writing winning scholarship essays and preparing strong applications.",
    date: "March 15, 2024",
    time: "2:00 PM EST",
    speaker: "Dr. Sarah Johnson",
    attendees: 234,
    category: "Workshop",
    link: "#",
    upcoming: true,
  },
  {
    title: "Career Pathways in Tech",
    description: "Explore different career opportunities in the technology industry with insights from industry professionals.",
    date: "March 20, 2024",
    time: "11:00 AM EST",
    speaker: "James Chen, Google",
    attendees: 456,
    category: "Seminar",
    link: "#",
    upcoming: true,
  },
  {
    title: "Study Abroad: What You Need to Know",
    description: "Essential information for students planning to study abroad, including visa requirements and cultural preparation.",
    date: "March 25, 2024",
    time: "4:00 PM EST",
    speaker: "Maria Rodriguez",
    attendees: 189,
    category: "Webinar",
    link: "#",
    upcoming: true,
  },
  {
    title: "Building Your Personal Brand",
    description: "Learn how to create a compelling personal brand that stands out to employers and scholarship committees.",
    date: "April 2, 2024",
    time: "1:00 PM EST",
    speaker: "Alex Thompson",
    attendees: 312,
    category: "Workshop",
    link: "#",
    upcoming: true,
  },
  {
    title: "Graduate School Application Strategies",
    description: "Expert advice on preparing competitive graduate school applications, including SOPs and recommendation letters.",
    date: "April 10, 2024",
    time: "3:00 PM EST",
    speaker: "Prof. Emily Watson",
    attendees: 278,
    category: "Seminar",
    link: "#",
    upcoming: true,
  },
  {
    title: "Interview Skills for Scholarships",
    description: "Practice and perfect your interview skills for scholarship and university admissions interviews.",
    date: "April 15, 2024",
    time: "10:00 AM EST",
    speaker: "David Lee",
    attendees: 145,
    category: "Workshop",
    link: "#",
    upcoming: true,
  },
];

const categoryColors: Record<string, string> = {
  Workshop: "bg-purple-100 text-purple-700",
  Seminar: "bg-amber-100 text-amber-700",
  Webinar: "bg-primary/10 text-primary",
};

const Webinars = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWebinars = webinars.filter((webinar) => {
    return (
      webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webinar.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-amber-500 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            Webinars & Seminars
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Join free online events led by experts. Learn from industry professionals and connect with fellow students.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search webinars and seminars..."
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="pb-3">
                  <Badge className={categoryColors[webinar.category]} variant="outline">
                    {webinar.category}
                  </Badge>
                  <h3 className="font-serif text-lg font-semibold mt-2">{webinar.title}</h3>
                  <p className="text-sm text-muted-foreground">{webinar.speaker}</p>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground mb-4">{webinar.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{webinar.attendees} registered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Register Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {filteredWebinars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Webinars;
