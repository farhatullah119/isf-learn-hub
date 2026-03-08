import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, Download, ExternalLink, GraduationCap, PenTool, Calculator } from "lucide-react";

const resourceCategories = [
  {
    title: "Essay Writing Guides",
    description: "Learn how to write compelling personal statements and scholarship essays.",
    icon: PenTool,
    resources: [
      { name: "Personal Statement Template", type: "PDF" },
      { name: "Essay Writing Tips", type: "Article" },
      { name: "Common Essay Mistakes", type: "Video" },
    ],
  },
  {
    title: "Test Preparation",
    description: "Study materials for standardized tests like GRE, TOEFL, IELTS, and SAT.",
    icon: Calculator,
    resources: [
      { name: "GRE Study Plan", type: "PDF" },
      { name: "TOEFL Practice Tests", type: "Interactive" },
      { name: "SAT Math Review", type: "Video" },
    ],
  },
  {
    title: "Application Guides",
    description: "Step-by-step guides for university and scholarship applications.",
    icon: FileText,
    resources: [
      { name: "University Application Checklist", type: "PDF" },
      { name: "Recommendation Letter Guide", type: "Article" },
      { name: "Interview Preparation", type: "Video" },
    ],
  },
  {
    title: "Study Skills",
    description: "Improve your learning techniques and academic performance.",
    icon: BookOpen,
    resources: [
      { name: "Effective Study Methods", type: "Article" },
      { name: "Time Management Tips", type: "PDF" },
      { name: "Note-Taking Strategies", type: "Video" },
    ],
  },
];

const featuredResources = [
  {
    title: "Complete Scholarship Application Guide",
    description: "A comprehensive guide covering everything from finding scholarships to submitting winning applications.",
    type: "eBook",
    icon: BookOpen,
  },
  {
    title: "University Comparison Tool",
    description: "Compare universities based on rankings, costs, programs, and student satisfaction.",
    type: "Interactive Tool",
    icon: GraduationCap,
  },
  {
    title: "Video Tutorial Series",
    description: "Watch expert tutorials on application strategies, interview tips, and study abroad preparation.",
    type: "Video Series",
    icon: Video,
  },
];

const Resources = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            Study Resources
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Access free study materials, guides, and tools to help you succeed in your academic journey.
          </p>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6">Featured Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <resource.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {resource.type}
                  </span>
                  <h3 className="font-serif text-lg font-semibold mt-1 mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="outline" size="sm">
                    Access Resource
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-6">Resource Library</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resourceCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.resources.map((resource, rIndex) => (
                      <li key={rIndex}>
                        <a
                          href="#"
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{resource.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {resource.type}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Resources;
