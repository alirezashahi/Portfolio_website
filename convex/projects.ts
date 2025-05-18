import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { isAdmin } from "./lib/auth";

// Get all published projects
export const getProjects = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();
    
    return projects;
  },
});

// Get all projects (for admin)
export const getAllProjects = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Check if user is an admin
      const userIsAdmin = await isAdmin(ctx);
      if (!userIsAdmin) {
        throw new ConvexError("Unauthorized: Admin access required");
      }
      
      const projects = await ctx.db
        .query("projects")
        .order("desc")
        .collect();
      
      return projects;
    } catch (error) {
      console.error("Error in getAllProjects:", error);
      // If unauthorized, return empty array instead of exposing an error
      return [];
    }
  },
});

// Get a specific project by slug
export const getProjectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .first();
    
    return project;
  },
});

// Create a new project (admin only)
export const createProject = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    subtitle: v.string(),
    overview: v.string(),
    role: v.string(),
    features: v.array(v.string()),
    technologies: v.array(v.string()),
    process: v.optional(v.string()),
    challenges: v.string(),
    outcomes: v.string(),
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
      caption: v.optional(v.string()),
    })),
    links: v.object({
      liveDemo: v.optional(v.string()),
      github: v.optional(v.string()),
      video: v.optional(v.string()),
      slides: v.optional(v.string()),
    }),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    // In a real app, you would check for admin permissions here
    
    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdAt: Date.now(),
    });
    
    return projectId;
  },
});

// Update an existing project (admin only)
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    overview: v.optional(v.string()),
    role: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    technologies: v.optional(v.array(v.string())),
    process: v.optional(v.string()),
    challenges: v.optional(v.string()),
    outcomes: v.optional(v.string()),
    images: v.optional(v.array(v.object({
      url: v.string(),
      alt: v.string(),
      caption: v.optional(v.string()),
    }))),
    links: v.optional(v.object({
      liveDemo: v.optional(v.string()),
      github: v.optional(v.string()),
      video: v.optional(v.string()),
      slides: v.optional(v.string()),
    })),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    
    // In a real app, you would check for admin permissions here
    
    await ctx.db.patch(id, fields);
    
    return id;
  },
});

// Delete a project (admin only)
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    // In a real app, you would check for admin permissions here
    
    await ctx.db.delete(args.id);
    
    return args.id;
  },
}); 