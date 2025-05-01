import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Alireza Shahi | Data Analytics & Digital Transformation
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Detail-oriented Master's student (Digital Transformation Management, UniBo) 
            skilled in Python, SQL, and Machine Learning. Passionate about using 
            data-driven insights for strategic decisions. Seeking an internship.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">About Me</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Key Skills</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Python", "SQL", "Machine Learning", "Data Analysis", "Business Intelligence"].map((skill, index) => (
            <div 
              key={index} 
              className="bg-secondary/60 rounded-lg p-4 text-center hover:bg-primary/10 transition-colors"
            >
              <p className="font-medium">{skill}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 