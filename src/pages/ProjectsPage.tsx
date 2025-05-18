import { Book, BarChart3, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Define types for projects
type ConvexProject = {
  _id: Id<"projects">;
  _creationTime: number;
  title: string;
  slug: string;
  subtitle: string;
  overview: string;
  role: string;
  features: string[];
  technologies: string[];
  process?: string;
  challenges: string;
  outcomes: string;
  images: { url: string; alt: string; caption?: string }[];
  links: {
    liveDemo?: string;
    github?: string;
    video?: string;
    slides?: string;
  };
  icon?: string;
  createdAt: number;
  isPublished: boolean;
};

type FallbackProject = {
  _id: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  icon: string;
  slug: string;
};

type Project = ConvexProject | FallbackProject;

const ProjectsPage = () => {
  // Fetch projects from Convex
  const convexProjects = useQuery(api.projects.getProjects) as ConvexProject[] | undefined;

  // Fallback to hardcoded projects if none are available from the database
  const fallbackProjects: FallbackProject[] = [
    {
      _id: "1",
      title: "Book Recommendation Website (Bookbuddy)",
      description: "Developing a book recommendation platform using Flask. Leveraged Git/GitHub. Designed SQL database. Implementing ML algorithms for recommendations based on genres, authors, habits. Integrating Google Books/Goodreads APIs.",
      role: "Developer",
      technologies: ["Python", "Flask", "SQL", "Machine Learning", "Git/GitHub", "APIs"],
      icon: "book",
      slug: "book-recommendation-website",
    },
    {
      _id: "2",
      title: "Financial analysis and strategic risk analysis (Phosagro)",
      description: "Team project delivering financial analysis of Phosagro. Developed KPI, challenges, drivers analysis. Identified stakeholders, customer segments, business model canvas. Developed risk matrix using Excel. Provided strategic recommendations aimed at enhancing profitability.",
      role: "Team Member / Analyst",
      technologies: ["Financial Analysis", "Strategic Planning", "Risk Assessment", "Excel"],
      icon: "chart",
      slug: "financial-analysis-phosagro",
    },
    {
      _id: "3",
      title: "Business Model Innovation: JDE Peet's",
      description: "Analyzed JDE Peet's business model focusing on enhancement and sustainability. Researched and proposed model configurations for innovation and performance improvement based on KPIs.",
      role: "Analyst",
      technologies: ["Business Model Analysis", "Strategic Innovation", "KPI Analysis"],
      icon: "building",
      slug: "business-model-innovation",
    }
  ];

  const displayProjects: Project[] = convexProjects?.length ? convexProjects : fallbackProjects;

  // Function to get the appropriate icon based on icon name
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case "book":
        return <Book className="h-8 w-8 text-primary" />;
      case "chart":
        return <BarChart3 className="h-8 w-8 text-primary" />;
      case "building":
        return <Building className="h-8 w-8 text-primary" />;
      default:
        return <Book className="h-8 w-8 text-primary" />;
    }
  };

  // Function to get description text (handle both project types)
  const getDescription = (project: Project): string => {
    if ('description' in project) {
      return project.description;
    } else {
      return project.subtitle;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Projects</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {displayProjects.map((project, index) => (
            <div 
              key={index} 
              className="bg-secondary/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {getIconComponent(project.icon)}
                      <span className="ml-3">{project.title}</span>
                    </h2>
                    <p className="text-sm text-primary mb-2">Role: {project.role}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{getDescription(project)}</p>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-2">Technologies Used:</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center py-1 px-3 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Link 
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage; 