import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Gets the current authenticated Clerk user ID
 * 
 * @param ctx The Convex query or mutation context
 * @returns The user ID from Clerk authentication
 * @throws ConvexError if the user is not authenticated
 */
export async function getAuthenticatedUserId(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }
  
  return identity.subject;
}

/**
 * Checks if the current user is authenticated and is an admin
 * 
 * @param ctx The Convex query or mutation context
 * @returns True if the user is authenticated and is an admin
 * @throws ConvexError if the user is not authenticated
 */
export async function isAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  try {
    const identity = await ctx.auth.getUserIdentity();
    
    if (!identity) {
      return false;
    }
    
    // Administrator email domains
    const adminDomains = [
      "yourdomain.com",
      "gmail.com", // For testing purposes
      "hotmail.com" // For testing purposes
      // Add your admin domains here
    ];

    // Check if the email is from an admin domain
    if (identity.email) {
      const emailDomain = identity.email.split('@')[1];
      if (adminDomains.includes(emailDomain)) {
        return true;
      }
    }
    
    // Check for admin role in metadata
    const metadata = identity.metadata;
    if (metadata) {
      // Use type assertion to help TypeScript understand the structure
      const metadataObj = metadata as { role?: string };
      if (metadataObj.role === "admin") {
        return true;
      }
    }
    
    // For development purposes, can add specific user IDs here
    const adminUserIds: string[] = [
      // Add your admin user IDs here
    ];
    
    if (adminUserIds.includes(identity.subject)) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
} 