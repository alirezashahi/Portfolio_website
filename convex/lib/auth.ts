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
      throw new ConvexError("Not authenticated");
    }
    
    // Check if the email is from an admin domain
    if (identity.email && identity.email.endsWith("@yourdomain.com")) {
      return true;
    }
    
    // Look for admin role in metadata
    const metadata = identity.metadata;
    if (metadata) {
      // Use type assertion to help TypeScript understand the structure
      const metadataObj = metadata as { role?: string };
      if (metadataObj.role === "admin") {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
} 