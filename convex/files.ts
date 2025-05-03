import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { requireAdmin } from "./auth";
import { isAdmin } from "./lib/auth"; // Import isAdmin
import { Id } from "./_generated/dataModel";

// Test function to verify that the API is working
export const testFilesApi = query({
  args: {},
  returns: v.object({ 
    status: v.string(),
    timestamp: v.number()
  }),
  handler: async (ctx) => {
    return {
      status: "Files API is working correctly",
      timestamp: Date.now()
    };
  }
});

// Generate a URL for file uploads
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if user is an admin
    await requireAdmin(ctx);
    
    // Generate the upload URL
    return await ctx.storage.generateUploadUrl();
  },
});

// List all files stored in the system
export const listFiles = query({
  args: {},
  handler: async (ctx) => {
    // Check if user is an admin
    await requireAdmin(ctx);
    
    // Fetch all storage files
    const files = await ctx.db.query("storageFiles").collect();
    
    // Return the files with their URLs
    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );
  },
});

// Get the URL for a specific file by storageId
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Store file metadata after upload
export const storeFileMetadata = mutation({
  args: {
    storageId: v.string(),
    filename: v.string(),
    contentType: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user is an admin
    await requireAdmin(ctx);
    
    try {
      // Check for invalid storageId like "upload"
      if (args.storageId === "upload") {
        throw new ConvexError("Invalid storageId: 'upload' is not a valid storage ID");
      }
      
      // Validate that the storageId exists in storage
      try {
        const url = await ctx.storage.getUrl(args.storageId as unknown as Id<"_storage">);
        if (!url) {
          throw new ConvexError(`StorageId "${args.storageId}" does not exist in storage`);
        }
      } catch (e) {
        console.error("Error validating storageId:", e);
        throw new ConvexError(`Invalid storageId: ${args.storageId}`);
      }
      
      // Store the file metadata
      return await ctx.db.insert("storageFiles", {
        storageId: args.storageId as unknown as Id<"_storage">,
        filename: args.filename,
        contentType: args.contentType,
        description: args.description,
        uploadedAt: Date.now(),
      });
    } catch (error) {
      console.error("Error in storeFileMetadata:", error);
      throw new ConvexError(`Failed to store file metadata: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Delete a file from storage
export const deleteFile = mutation({
  args: {
    fileId: v.id("storageFiles"),
  },
  handler: async (ctx, args) => {
    // Check if user is an admin
    await requireAdmin(ctx);
    
    // Get the file record
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("File not found");
    }
    
    // Delete from storage
    await ctx.storage.delete(file.storageId);
    
    // Remove from database
    await ctx.db.delete(args.fileId);
    
    return true;
  },
});

// Debug function to check auth status
export const debugAuth = query({
  args: {},
  returns: v.object({
    status: v.string(),
    authInfo: v.any(),
    isAdmin: v.boolean(),
    timestamp: v.number()
  }),
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      // Use isAdmin directly to get the boolean status
      const adminStatus = await isAdmin(ctx); 
      
      return {
        status: identity ? "authenticated" : "unauthenticated",
        authInfo: identity || null,
        isAdmin: adminStatus, // Now correctly a boolean
        timestamp: Date.now()
      };
    } catch (error) {
      // If isAdmin throws, it means not authenticated or other auth error
      return {
        status: "error",
        authInfo: String(error),
        isAdmin: false, // Default to false on error
        timestamp: Date.now()
      };
    }
  }
});
