import { Book, BarChart3, Building, Code, Database, Globe, Server, Settings, Smartphone, Monitor, Cloud, BarChart, Brain, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Define types for projects
type Project = {
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

const ProjectsPage = () => {
  // Fetch projects from Convex
  const projects = useQuery(api.projects.getProjects) as Project[] | undefined;

  // Function to get the appropriate icon based on icon name
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case "book":
        return <Book className="h-8 w-8 text-primary" />;
      case "chart":
        return <BarChart3 className="h-8 w-8 text-primary" />;
      case "building":
        return <Building className="h-8 w-8 text-primary" />;
      case "code":
        return <Code className="h-8 w-8 text-primary" />;
      case "database":
        return <Database className="h-8 w-8 text-primary" />;
      case "globe":
        return <Globe className="h-8 w-8 text-primary" />;
      case "server":
        return <Server className="h-8 w-8 text-primary" />;
      case "settings":
        return <Settings className="h-8 w-8 text-primary" />;
      case "smartphone":
        return <Smartphone className="h-8 w-8 text-primary" />;
      case "desktop":
        return <Monitor className="h-8 w-8 text-primary" />;
      case "cloud":
        return <Cloud className="h-8 w-8 text-primary" />;
      case "analytics":
        return <BarChart className="h-8 w-8 text-primary" />;
      case "robot":
        return <Bot className="h-8 w-8 text-primary" />;
      case "ai":
      case "brain":
        return <Brain className="h-8 w-8 text-primary" />;
      default:
        return <Book className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-20">
      <section className="py-8 md:py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Projects</h1>
        
        {/* Loading state */}
        {projects === undefined && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {/* No projects state */}
        {projects && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-300">No projects available yet.</p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">Check back soon!</p>
          </div>
        )}
        
        {/* Projects list */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
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
                  
                  <p className="text-muted-foreground">{project.subtitle}</p>
                  
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
        )}
      </section>
    </div>
  );
};

export default ProjectsPage; 