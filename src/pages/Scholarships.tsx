import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import OpportunityCard from "@/components/OpportunityCard";

const scholarships = [
  {
    title: "Fulbright Foreign Student Program",
    description: "Fully funded scholarships for international students to study in the United States. Covers tuition, living expenses, and travel.",
    category: "Scholarship" as const,
    location: "United States",
    deadline: "Rolling",
    provider: "U.S. Department of State",
    link: "https://foreign.fulbrightonline.org/",
    featured: true,
  },
  {
    title: "Chevening Scholarships",
    description: "UK Government's global scholarship program for future leaders. Fully funded master's degrees at any UK university.",
    category: "Scholarship" as const,
    location: "United Kingdom",
    deadline: "November 2024",
    provider: "UK Government",
    link: "https://www.chevening.org/",
    featured: true,
  },
  {
    title: "DAAD Scholarships",
    description: "Study and research in Germany with DAAD scholarships. Various programs for undergraduate, graduate, and doctoral students.",
    category: "Scholarship" as const,
    location: "Germany",
    deadline: "Varies by program",
    provider: "German Academic Exchange Service",
    link: "https://www.daad.de/",
  },
  {
    title: "Erasmus Mundus Joint Masters",
    description: "EU-funded scholarships for international master's programs. Study in multiple European countries.",
    category: "Scholarship" as const,
    location: "Europe",
    deadline: "January 2025",
    provider: "European Commission",
    link: "https://erasmus-plus.ec.europa.eu/",
  },
  {
    title: "Australia Awards Scholarships",
    description: "Full scholarships for students from developing countries to study in Australia. Covers tuition, living costs, and airfare.",
    category: "Scholarship" as const,
    location: "Australia",
    deadline: "April 2025",
    provider: "Australian Government",
    link: "https://www.dfat.gov.au/people-to-people/australia-awards",
  },
  {
    title: "Commonwealth Scholarships",
    description: "Scholarships for students from Commonwealth countries to pursue master's and PhD degrees in the UK.",
    category: "Scholarship" as const,
    location: "United Kingdom",
    deadline: "December 2024",
    provider: "Commonwealth Scholarship Commission",
    link: "https://cscuk.fcdo.gov.uk/",
  },
  {
    title: "Swedish Institute Scholarships",
    description: "Full scholarships for master's programs in Sweden. Covers tuition fees, living expenses, and travel grants.",
    category: "Scholarship" as const,
    location: "Sweden",
    deadline: "February 2025",
    provider: "Swedish Institute",
    link: "https://si.se/en/",
  },
  {
    title: "Gates Cambridge Scholarship",
    description: "Prestigious scholarship for outstanding applicants from outside the UK to pursue postgraduate study at Cambridge.",
    category: "Scholarship" as const,
    location: "United Kingdom",
    deadline: "October 2024",
    provider: "Bill & Melinda Gates Foundation",
    link: "https://www.gatescambridge.org/",
  },
];

const regions = ["United States", "United Kingdom", "Germany", "Europe", "Australia", "Sweden"];

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion =
      selectedRegion === "all" || scholarship.location === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Scholarships
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Discover fully funded scholarships from universities and organizations around the world. Start your educational journey without financial barriers.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search scholarships..."
          />
          <CategoryFilter
            categories={regions}
            selected={selectedRegion}
            onChange={setSelectedRegion}
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredScholarships.length} scholarships
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship, index) => (
              <OpportunityCard key={index} {...scholarship} />
            ))}
          </div>
          {filteredScholarships.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Scholarships;
