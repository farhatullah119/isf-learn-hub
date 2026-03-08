import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, FileText, Send, Clock, ExternalLink } from "lucide-react";

const applicationSteps = [
  {
    step: 1,
    title: "Research Programs",
    description: "Explore universities and programs that match your academic interests and career goals.",
    tips: [
      "Compare program rankings and faculty expertise",
      "Check admission requirements and prerequisites",
      "Consider location, cost, and scholarship opportunities",
    ],
  },
  {
    step: 2,
    title: "Prepare Documents",
    description: "Gather all required documents well in advance of application deadlines.",
    tips: [
      "Academic transcripts (official and translated if needed)",
      "Standardized test scores (GRE, TOEFL, IELTS)",
      "Letters of recommendation from professors or employers",
    ],
  },
  {
    step: 3,
    title: "Write Your Essays",
    description: "Craft compelling personal statements and essays that showcase your unique story.",
    tips: [
      "Start early and revise multiple times",
      "Show don't tell - use specific examples",
      "Have others review your essays for feedback",
    ],
  },
  {
    step: 4,
    title: "Submit Applications",
    description: "Complete and submit your applications before the deadline.",
    tips: [
      "Double-check all information for accuracy",
      "Pay application fees on time",
      "Keep copies of all submitted materials",
    ],
  },
  {
    step: 5,
    title: "Track & Follow Up",
    description: "Monitor your application status and respond promptly to any requests.",
    tips: [
      "Create a tracking spreadsheet for all applications",
      "Check email regularly for updates",
      "Prepare for interviews if required",
    ],
  },
];

const applicationPortals = [
  {
    name: "Common App",
    description: "Apply to over 900+ US colleges and universities",
    link: "https://www.commonapp.org/",
  },
  {
    name: "UCAS",
    description: "Apply to universities in the United Kingdom",
    link: "https://www.ucas.com/",
  },
  {
    name: "Uni-assist",
    description: "Application service for German universities",
    link: "https://www.uni-assist.de/",
  },
  {
    name: "University Admissions",
    description: "Apply to universities in Sweden",
    link: "https://www.universityadmissions.se/",
  },
];

const Apply = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            How to Apply
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Your step-by-step guide to applying to colleges and universities worldwide.
          </p>
        </div>
      </section>

      {/* Application Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center">Application Process</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {applicationSteps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="bg-primary text-primary-foreground w-16 flex-shrink-0 flex items-center justify-center font-serif text-2xl font-bold">
                      {step.step}
                    </div>
                    <div className="p-6 flex-1">
                      <h3 className="font-serif text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Portals */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-bold mb-8 text-center">Application Portals</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {applicationPortals.map((portal, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{portal.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{portal.description}</p>
                  <Button asChild variant="outline" size="sm">
                    <a href={portal.link} target="_blank" rel="noopener noreferrer">
                      Visit Site
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Tips */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Application Timeline</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">12-18 months before</h4>
                      <p className="text-sm text-muted-foreground">Research programs, take standardized tests, build your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">6-12 months before</h4>
                      <p className="text-sm text-muted-foreground">Request transcripts, ask for recommendations, draft essays</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Send className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold">3-6 months before</h4>
                      <p className="text-sm text-muted-foreground">Finalize essays, submit applications, apply for scholarships</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
