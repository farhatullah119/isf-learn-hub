import { Calendar, MapPin, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OpportunityCardProps {
  title: string;
  description: string;
  category: "Scholarship" | "Internship" | "Course" | "Webinar";
  location?: string;
  deadline?: string;
  duration?: string;
  provider?: string;
  link: string;
  featured?: boolean;
}

const categoryStyles = {
  Scholarship: "category-scholarship",
  Internship: "category-internship",
  Course: "category-course",
  Webinar: "category-webinar",
};

const OpportunityCard = ({
  title,
  description,
  category,
  location,
  deadline,
  duration,
  provider,
  link,
  featured,
}: OpportunityCardProps) => {
  return (
    <Card className={`card-hover ${featured ? "ring-2 ring-accent" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={categoryStyles[category]} variant="outline">
            {category}
          </Badge>
          {featured && (
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>
        <h3 className="font-serif text-lg font-semibold mt-2 line-clamp-2">{title}</h3>
        {provider && (
          <p className="text-sm text-muted-foreground">{provider}</p>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-3 mt-4 text-sm text-muted-foreground">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{deadline}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Learn More
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
