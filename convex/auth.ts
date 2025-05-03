import { ConvexError } from "convex/values";
import { isAdmin } from "./lib/auth";
import { QueryCtx, MutationCtx } from "./_generated/server";

// Admin check function that throws an error if the user is not an admin
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx
) {
  const isUserAdmin = await isAdmin(ctx);
  
  if (!isUserAdmin) {
    throw new ConvexError("Access denied. Admin privileges required.");
  }
  
  return true;
} 