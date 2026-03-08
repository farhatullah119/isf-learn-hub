import { useState } from "react";
import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import OpportunityCard from "@/components/OpportunityCard";

const courses = [
  {
    title: "CS50: Introduction to Computer Science",
    description: "Harvard's introduction to computer science and programming. Learn algorithms, data structures, and software engineering.",
    category: "Course" as const,
    provider: "Harvard University",
    duration: "12 weeks",
    link: "https://cs50.harvard.edu/",
    featured: true,
  },
  {
    title: "Machine Learning by Andrew Ng",
    description: "Learn machine learning fundamentals from Stanford professor Andrew Ng. One of the most popular online courses.",
    category: "Course" as const,
    provider: "Stanford / Coursera",
    duration: "11 weeks",
    link: "https://www.coursera.org/learn/machine-learning",
    featured: true,
  },
  {
    title: "The Science of Well-Being",
    description: "Learn what the latest research says about happiness and how to apply it to your own life.",
    category: "Course" as const,
    provider: "Yale University",
    duration: "10 weeks",
    link: "https://www.coursera.org/learn/the-science-of-well-being",
  },
  {
    title: "Financial Markets",
    description: "An overview of finance, insurance, and securities with Nobel laureate Robert Shiller.",
    category: "Course" as const,
    provider: "Yale University",
    duration: "7 weeks",
    link: "https://www.coursera.org/learn/financial-markets-global",
  },
  {
    title: "Python for Everybody",
    description: "Learn to program and analyze data with Python. Perfect for beginners wanting to start coding.",
    category: "Course" as const,
    provider: "University of Michigan",
    duration: "8 weeks",
    link: "https://www.py4e.com/",
  },
  {
    title: "Learning How to Learn",
    description: "Powerful mental tools to help you master tough subjects. Based on neuroscience research.",
    category: "Course" as const,
    provider: "UC San Diego",
    duration: "4 weeks",
    link: "https://www.coursera.org/learn/learning-how-to-learn",
  },
  {
    title: "Introduction to Data Science",
    description: "Learn the basics of data science including visualization, statistical analysis, and machine learning.",
    category: "Course" as const,
    provider: "IBM",
    duration: "10 weeks",
    link: "https://www.coursera.org/professional-certificates/ibm-data-science",
  },
  {
    title: "Digital Marketing Specialization",
    description: "Master digital marketing including SEO, social media, and analytics. Earn a professional certificate.",
    category: "Course" as const,
    provider: "University of Illinois",
    duration: "8 months",
    link: "https://www.coursera.org/specializations/digital-marketing",
  },
  {
    title: "Web Development Bootcamp",
    description: "Full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js.",
    category: "Course" as const,
    provider: "freeCodeCamp",
    duration: "Self-paced",
    link: "https://www.freecodecamp.org/",
  },
];

const subjects = ["Computer Science", "Business", "Psychology", "Data Science", "Marketing"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="bg-purple-600 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-4">
            Free Online Courses
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            Access world-class education from top universities. Earn certificates and build valuable skills at no cost.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search courses..."
          />
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground mb-6">
            Showing {filteredCourses.length} courses
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <OpportunityCard key={index} {...course} />
            ))}
          </div>
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
