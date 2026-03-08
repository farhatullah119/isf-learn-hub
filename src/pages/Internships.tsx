import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import OpportunityCard from "@/components/OpportunityCard";

const internships = [
  {
    title: "Google STEP Internship",
    description: "First-year and sophomore students can gain experience in software engineering at Google. Paid internship with mentorship.",
    category: "Internship" as const,
    location: "United States",
    deadline: "October 2024",
    duration: "12 weeks",
    provider: "Google",
    link: "https://careers.google.com/",
    featured: true,
  },
  {
    title: "Microsoft Explore Program",
    description: "For first and second-year students interested in software engineering, program management, or UX design.",
    category: "Internship" as const,
    location: "United States",
    deadline: "September 2024",
    duration: "12 weeks",
    provider: "Microsoft",
    link: "https://careers.microsoft.com/",
    featured: true,
  },
  {
    title: "United Nations Internship Programme",
    description: "Work with the UN on global issues including peace, development, and human rights. Various departments available.",
    category: "Internship" as const,
    location: "International",
    deadline: "Rolling",
    duration: "2-6 months",
    provider: "United Nations",
    link: "https://careers.un.org/",
  },
  {
    title: "World Bank Internship",
    description: "Join the World Bank Group and work on projects addressing poverty and development challenges worldwide.",
    category: "Internship" as const,
    location: "Washington D.C.",
    deadline: "January 2025",
    duration: "4 months",
    provider: "World Bank Group",
    link: "https://www.worldbank.org/",
  },
  {
    title: "European Commission Traineeship",
    description: "Work in the EU institutions and gain experience in European policy-making. Paid traineeship program.",
    category: "Internship" as const,
    location: "Brussels, Belgium",
    deadline: "August 2024",
    duration: "5 months",
    provider: "European Commission",
    link: "https://traineeships.ec.europa.eu/",
  },
  {
    title: "Tesla Engineering Internship",
    description: "Work on cutting-edge electric vehicle and clean energy technology. Multiple engineering disciplines.",
    category: "Internship" as const,
    location: "United States",
    deadline: "Rolling",
    duration: "12 weeks",
    provider: "Tesla",
    link: "https://www.tesla.com/careers",
  },
  {
    title: "UNICEF Internship Programme",
    description: "Support UNICEF's mission to protect children's rights. Opportunities in various fields including communications and policy.",
    category: "Internship" as const,
    location: "International",
    deadline: "Rolling",
    duration: "6-26 weeks",
    provider: "UNICEF",
    link: "https://www.unicef.org/careers/",
  },
  {
    title: "Amazon Student Programs",
    description: "Internship opportunities across technology, operations, and business roles. Competitive compensation package.",
    category: "Internship" as const,
    location: "Global",
    deadline: "Rolling",
    duration: "12 weeks",
    provider: "Amazon",
    link: "https://www.amazon.jobs/",
  },
];

const fields = ["Technology", "International", "Finance", "Engineering", "Non-profit"];

const Internships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("all");

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-secondary-foreground mb-4">
            Internships
          </h1>
          <p className="text-lg text-secondary-foreground/90 max-w-2xl">
            Kickstart your career with internship opportunities at leading companies and organizations worldwide.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search internships..."
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredInternships.length} internships
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((internship, index) => (
              <OpportunityCard key={index} {...internship} />
            ))}
          </div>
          {filteredInternships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No internships found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Internships;
