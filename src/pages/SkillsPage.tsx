import { Code, Database, Share2, Globe, Languages, Award, Cpu } from "lucide-react";

const SkillsPage = () => {
  const skillCategories = [
    {
      id: 1,
      title: "Programming",
      icon: <Code className="h-6 w-6 text-primary" />,
      skills: ["Python", "SQL", "HTML", "CSS", "JavaScript", "TypeScript"]
    },
    {
      id: 2,
      title: "Web Technologies",
      icon: <Globe className="h-6 w-6 text-primary" />,
      skills: ["React", "Node.js"]
    },
    {
      id: 3,
      title: "ML/Data Science",
      icon: <Cpu className="h-6 w-6 text-primary" />,
      skills: ["TensorFlow", "Scikit-learn", "NumPy", "Pandas", "Weka", "Data Mining"]
    },
    {
      id: 4,
      title: "Tools/Platforms",
      icon: <Share2 className="h-6 w-6 text-primary" />,
      skills: ["Power BI", "Git/GitHub", "Shadcn/ui", "Convex"]
    },
    {
      id: 5,
      title: "Databases",
      icon: <Database className="h-6 w-6 text-primary" />,
      skills: ["SQL (Database Systems)", "AWS (Basic knowledge)"]
    },
    {
      id: 6,
      title: "Languages",
      icon: <Languages className="h-6 w-6 text-primary" />,
      skills: ["English (Advanced)", "Persian (Native)", "Italian (Pre-Intermediate)"]
    },
    {
      id: 7,
      title: "Soft Skills",
      icon: <Award className="h-6 w-6 text-primary" />,
      skills: ["Business Insights", "Research", "Critical Thinking", "Analytical", "Communication", "Organization", "Teamwork", "Detail-Oriented"]
    }
  ];

  const certifications = [
    "Python Specialization (U Michigan, Coursera)",
    "Machine Learning Specialization (Stanford Online, Coursera)",
    "Intro to TensorFlow (DeepLearning.AI, Coursera)"
  ];

  const interests = [
    "Data Analytics and Visualization", 
    "Business Intelligence", 
    "Web and Digital Analytics", 
    "Deep Learning", 
    "Transformers"
  ];

  return (
    <div className="container mx-auto px-4 pt-24">
      <section className="py-12 md:py-16 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Skills</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-secondary/20 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                {category.icon}
                <span className="ml-3">{category.title}</span>
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center py-1 px-3 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Certifications */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Certifications</h2>
          <div className="bg-secondary/20 rounded-lg p-6">
            <ul className="space-y-2">
              {certifications.map((cert, index) => (
                <li 
                  key={index}
                  className="flex items-start"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-primary mt-2 mr-3"></span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Interests */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Interests</h2>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <span 
                key={index} 
                className="inline-flex items-center py-2 px-4 bg-secondary/40 text-foreground rounded-lg"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsPage; 