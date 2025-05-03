/**
 * Environment variables helper module
 * This centralizes all environment variable access in one place
 */

// Environment variable for the Clerk publishable key
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Convex URL for the backend
export const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;

// Helper to check if we're in a development environment
export const isDevelopment = import.meta.env.DEV === true;

// Helper to manually set your publishable key if environment variables aren't working
// Only used as a fallback - should use .env file in production
export const getClerkKey = (): string => {
  // First try to get from environment variables
  if (CLERK_PUBLISHABLE_KEY) {
    return CLERK_PUBLISHABLE_KEY;
  }
  
  // Fallback value for development only
  if (isDevelopment) {
    console.warn("⚠️ Using hardcoded Clerk publishable key. This should only be used in development.");
    return "pk_test_replace_with_your_actual_key";
  }
  
  // Return empty string if not found - will trigger error UI
  return "";
};

// Log environment variables during development
if (isDevelopment) {
  console.log("Environment variables:", {
    CLERK_KEY: CLERK_PUBLISHABLE_KEY ? "Found (masked)" : "Not found",
    CONVEX_URL: CONVEX_URL || "Not found",
    DEV: isDevelopment
  });
} 