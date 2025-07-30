import { Download, Mail, Phone, Linkedin } from "lucide-react";
import { Button } from "../components/ui/button";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

const AboutPage = () => {
  // Define the CV storage ID
  const cvStorageId = "kg217xf84j279xy4c0kebdgmz17mpbgr" as unknown as Id<"_storage">;
  
  // Get the download URL for the CV
  const cvUrl = useQuery(api.files.getFileUrl, { storageId: cvStorageId });
  
  return (
    <div className="container mx-auto px-4 pt-20">
      <section className="py-8 md:py-12 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About Me</h1>
        
        <div className="space-y-12">
          {/* Professional Summary */}
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed text-muted-foreground">
              I'm a Master's student at the University of Bologna specializing in 
              Digital Transformation Management, with a strong foundation in Python, SQL, 
              and Machine Learning. I thrive on using data to solve problems and drive 
              strategic decisions, drawing on experience in financial analysis and 
              collaborative ML projects. I'm currently seeking an internship where I can 
              contribute actionable insights and further develop my skills.
            </p>
          </div>
          
          {/* Contact Information */}
          <div className="bg-secondary/20 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a 
                  href="mailto:Alireza.shahi@studio.unibo.it" 
                  className="text-foreground hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  Alireza.shahi@studio.unibo.it
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <a 
                  href="tel:+393278488622" 
                  className="text-foreground hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  +39 3278488622
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Linkedin className="h-5 w-5 text-primary" />
                <a 
                  href="https://www.linkedin.com/in/alireza-shahi-dtm" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-foreground hover:text-primary transition-colors"
                  tabIndex={0}
                >
                  www.linkedin.com/in/alireza-shahi-dtm
                </a>
              </div>
            </div>
            
            <div className="mt-6">
              {cvUrl === undefined ? (
                <Button variant="outline" size="sm" className="flex items-center space-x-2" disabled>
                  <Download className="h-4 w-4" />
                  <span>Loading CV...</span>
                </Button>
              ) : cvUrl === null ? (
                <Button variant="outline" size="sm" className="flex items-center space-x-2" disabled>
                  <Download className="h-4 w-4" />
                  <span>CV Unavailable</span>
                </Button>
              ) : (
                <a 
                  href={cvUrl} 
                  download="Alireza_Shahi_CV.pdf"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download CV</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
          
          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            
            <div className="bg-secondary/20 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Alma Mater Studiorum - Università di Bologna (Cesena, Italy)</h3>
              <p className="text-muted-foreground mb-2">Master of Science in Digital Transformation Management (2023-Present)</p>
              
              <h4 className="font-medium mt-4 mb-2">Key Courses:</h4>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Business Intelligence</li>
                <li>Business Performance Analytics</li>
                <li>Database Systems</li>
                <li>Data Mining</li>
                <li>Programming and Computer Architectures</li>
                <li>Big Data and Cloud Platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 