import { Book, BarChart3, Building } from "lucide-react";

const ProjectsPage = () => {
  const projects = [
    {
      id: 1,
      title: "Book Recommendation Website (Bookbuddy)",
      description: "Developing a book recommendation platform using Flask. Leveraged Git/GitHub. Designed SQL database. Implementing ML algorithms for recommendations based on genres, authors, habits. Integrating Google Books/Goodreads APIs.",
      role: "Developer",
      technologies: ["Python", "Flask", "SQL", "Machine Learning", "Git/GitHub", "APIs"],
      icon: <Book className="h-8 w-8 text-primary" />,
      link: "#"
    },
    {
      id: 2,
      title: "Financial analysis and strategic risk analysis (Phosagro)",
      description: "Team project delivering financial analysis of Phosagro. Developed KPI, challenges, drivers analysis. Identified stakeholders, customer segments, business model canvas. Developed risk matrix using Excel. Provided strategic recommendations aimed at enhancing profitability.",
      role: "Team Member / Analyst",
      technologies: ["Financial Analysis", "Strategic Planning", "Risk Assessment", "Excel"],
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      link: "#"
    },
    {
      id: 3,
      title: "Business Model Innovation: JDE Peet's",
      description: "Analyzed JDE Peet's business model focusing on enhancement and sustainability. Researched and proposed model configurations for innovation and performance improvement based on KPIs.",
      role: "Analyst",
      technologies: ["Business Model Analysis", "Strategic Innovation", "KPI Analysis"],
      icon: <Building className="h-8 w-8 text-primary" />,
      link: "#"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <section className="py-12 md:py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Projects</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-secondary/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {project.icon}
                      <span className="ml-3">{project.title}</span>
                    </h2>
                    <p className="text-sm text-primary mb-2">Role: {project.role}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{project.description}</p>
                
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage; 