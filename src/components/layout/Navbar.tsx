import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useUser, useClerk } from "@clerk/clerk-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // Check if user is an admin
  const isAdmin = isSignedIn && (
    user?.primaryEmailAddress?.emailAddress.endsWith('@yourdomain.com') || 
    user?.publicMetadata?.role === 'admin'
  );

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleToggleMenu();
    }
  };

  const handleSignOut = () => {
    signOut().then(() => {
      // Redirect to home after sign out
      window.location.href = '/';
    });
  };

  return (
    <nav className="bg-background shadow-sm fixed w-full z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-semibold text-primary"
          tabIndex={0}
          aria-label="Alireza Shahi, go to homepage"
        >
          Alireza Shahi
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            About Me
          </Link>
          <Link 
            to="/projects" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            Projects
          </Link>
          <Link 
            to="/skills" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            Skills
          </Link>
          <Link 
            to="/blog" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            Blog
          </Link>
          <Link 
            to="/contact" 
            className="text-foreground hover:text-primary transition-colors"
            tabIndex={0}
          >
            Contact
          </Link>
          
          {/* Admin link - only visible for admins */}
          {isAdmin && (
            <Link 
              to="/admin/blog" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              tabIndex={0}
            >
              Admin
            </Link>
          )}
          
          {/* Logout button - only visible when signed in */}
          {isSignedIn && (
            <button
              onClick={handleSignOut}
              className="flex items-center text-red-500 hover:text-red-600 transition-colors"
              tabIndex={0}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleMenu}
            onKeyDown={handleKeyDown}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            tabIndex={0}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              About Me
            </Link>
            <Link 
              to="/projects" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              Projects
            </Link>
            <Link 
              to="/skills" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              Skills
            </Link>
            <Link 
              to="/blog" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={handleToggleMenu}
              tabIndex={0}
            >
              Contact
            </Link>
            
            {/* Admin link - only visible for admins */}
            {isAdmin && (
              <Link 
                to="/admin/blog" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors py-2"
                onClick={handleToggleMenu}
                tabIndex={0}
              >
                Admin
              </Link>
            )}
            
            {/* Logout button - only visible when signed in */}
            {isSignedIn && (
              <button
                onClick={() => {
                  handleSignOut();
                  handleToggleMenu();
                }}
                className="flex items-center text-red-500 hover:text-red-600 transition-colors py-2"
                tabIndex={0}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 