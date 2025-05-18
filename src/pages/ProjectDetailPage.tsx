import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChevronLeft, ExternalLink, Github, Video, FileText } from "lucide-react";
import Carousel from "../components/ui/carousel";

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Fetch the project from Convex by slug
  const project = useQuery(api.projects.getProjectBySlug, { slug: slug || "" });
  
  // Loading state
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse flex flex-col space-y-8 max-w-5xl mx-auto">
          <div className="h-10 bg-secondary/40 rounded w-1/3"></div>
          <div className="h-80 bg-secondary/40 rounded"></div>
          <div className="space-y-4">
            <div className="h-6 bg-secondary/40 rounded w-1/2"></div>
            <div className="h-4 bg-secondary/40 rounded w-full"></div>
            <div className="h-4 bg-secondary/40 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Projects</span>
          </Link>
        </div>
        
        {/* Project Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        
        {/* Subtitle/Elevator Pitch */}
        <p className="text-xl text-primary mb-8">{project.subtitle}</p>
        
        {/* Image Carousel */}
        <div className="mb-12">
          <Carousel images={project.images} />
        </div>
        
        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview/Problem Statement */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p>{project.overview}</p>
              </div>
            </section>
            
            {/* Key Features & Functionality */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>
            
            {/* The Process / Approach */}
            {project.process && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">The Process</h2>
                <div className="prose prose-lg max-w-none">
                  <p>{project.process}</p>
                </div>
              </section>
            )}
            
            {/* Challenges & Solutions */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Challenges & Solutions</h2>
              <div className="prose prose-lg max-w-none">
                <p>{project.challenges}</p>
              </div>
            </section>
            
            {/* Results & Impact / Outcomes */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Outcomes</h2>
              <div className="prose prose-lg max-w-none">
                <p>{project.outcomes}</p>
              </div>
            </section>
          </div>
          
          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Your Role and Responsibilities */}
            <section className="bg-secondary/20 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">My Role</h2>
              <p>{project.role}</p>
            </section>
            
            {/* Technologies & Tools Used */}
            <section className="bg-secondary/20 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center py-1 px-3 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
            
            {/* Links */}
            <section className="bg-secondary/20 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">Links</h2>
              <div className="space-y-2">
                {project.links.liveDemo && (
                  <a 
                    href={project.links.liveDemo}
                    className="flex items-center text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                )}
                
                {project.links.github && (
                  <a 
                    href={project.links.github}
                    className="flex items-center text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </a>
                )}
                
                {project.links.video && (
                  <a 
                    href={project.links.video}
                    className="flex items-center text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Walkthrough
                  </a>
                )}
                
                {project.links.slides && (
                  <a 
                    href={project.links.slides}
                    className="flex items-center text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Slide Deck / Report
                  </a>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage; 