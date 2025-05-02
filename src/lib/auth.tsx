import { SignIn, useUser } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

// Protected route component to secure admin pages
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  
  // Check if user is signed in
  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Admin Authentication</h1>
        <SignIn redirectUrl={location.pathname} />
      </div>
    );
  }
  
  // Check if user has admin role
  // You can customize this logic based on how you identify admins
  // This example checks for a specific email or metadata
  const isAdmin = user.primaryEmailAddress?.emailAddress.endsWith('@your-domain.com') || 
                  user.publicMetadata?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Access Denied</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>You don't have permission to access this page.</p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  // If user is signed in and is an admin, render the children
  return <>{children}</>;
}; 