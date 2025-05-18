const { ConvexClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");

async function createProject() {
  // Import environment variables from .env file
  require("dotenv").config();

  // Create a new client using admin key or a deployment URL
  const CONVEX_URL = process.env.CONVEX_URL || "http://localhost:8000";
  const client = new ConvexClient(CONVEX_URL);

  // Define the project data
  const projectData = {
    title: "Portfolio Website",
    slug: "portfolio-website",
    subtitle: "A modern, responsive portfolio website built with React, TypeScript, and Convex",
    overview: "This portfolio website showcases my skills, projects, and professional background. It features a clean, responsive design with dynamic content management through a custom admin interface. The site includes project galleries, blog functionality, and contact forms.",
    role: "Full-stack Developer",
    features: [
      "Responsive design for all devices",
      "Dynamic project showcase with detail pages",
      "Markdown support for rich content",
      "Blog system with content management",
      "Admin dashboard for content management",
      "Image upload functionality",
      "Contact form with backend validation",
      "Authentication using Clerk"
    ],
    technologies: [
      "React", 
      "TypeScript", 
      "Tailwind CSS", 
      "Convex DB", 
      "Clerk Auth",
      "React Router",
      "Lucide Icons",
      "React Markdown"
    ],
    process: "The development of this portfolio followed a structured approach. I started by planning the site architecture and creating wireframes for the key pages. Next, I built the frontend components following a component-based architecture with React and TypeScript. For the backend, I implemented Convex functions for data management and Clerk for authentication. The admin interface was developed to allow easy content management without requiring code changes.",
    challenges: "One key challenge was creating a flexible content management system that would allow for rich formatting while maintaining a clean design. I solved this by implementing markdown support for project descriptions and blog posts. Another challenge was handling image uploads efficiently, which I addressed by creating a custom ImageUploader component that interfaces with Convex storage.",
    outcomes: "The result is a modern, responsive portfolio website that effectively showcases projects and professional experience. The site features fast load times, smooth animations, and a cohesive design language. The admin dashboard provides an intuitive interface for managing all content without touching code, making updates quick and easy.",
    images: [
      {
        url: "https://placehold.co/600x400/png",
        alt: "Portfolio Website Homepage"
      },
      {
        url: "https://placehold.co/600x400/png",
        alt: "Projects Showcase Page"
      },
      {
        url: "https://placehold.co/600x400/png",
        alt: "Admin Dashboard"
      }
    ],
    links: {
      liveDemo: "https://your-portfolio-url.com",
      github: "https://github.com/yourusername/portfolio"
    },
    icon: "code",
    isPublished: true
  };

  try {
    // Create the project
    const projectId = await client.mutation(api.projects.createProject, projectData);
    
    console.log("Project created successfully with ID:", projectId);
    return projectId;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Run the function
createProject()
  .then(() => process.exit(0))
  .catch(() => process.exit(1)); 