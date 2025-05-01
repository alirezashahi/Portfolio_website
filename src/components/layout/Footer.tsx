import { Mail, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/30 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Alireza Shahi. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="mailto:Alireza.shahi@studio.unibo.it" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email Alireza Shahi"
              tabIndex={0}
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/alireza-shahi-dtm" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Visit Alireza Shahi's LinkedIn profile"
              tabIndex={0}
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4 text-sm">
              <Link 
                to="/" 
                className="text-muted-foreground hover:text-primary transition-colors"
                tabIndex={0}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-muted-foreground hover:text-primary transition-colors"
                tabIndex={0}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-muted-foreground hover:text-primary transition-colors"
                tabIndex={0}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 