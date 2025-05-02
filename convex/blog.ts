import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Debug function to test if the API is working
export const debugFunction = query({
  args: {},
  returns: v.object({
    status: v.string(),
    timestamp: v.number(),
    info: v.string()
  }),
  handler: async (ctx) => {
    console.log("Debug function called");
    try {
      // Count posts
      const postCount = await ctx.db
        .query("blogPosts")
        .collect()
        .then(posts => posts.length);
      
      return {
        status: "success",
        timestamp: Date.now(),
        info: `Database connection successful. Found ${postCount} blog posts.`
      };
    } catch (error) {
      console.error("Error in debug function:", error);
      return {
        status: "error",
        timestamp: Date.now(),
        info: `Error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  },
});

// Get all published blog posts
export const getPublishedBlogPosts = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("blogPosts"),
    _creationTime: v.number(),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    publishedDate: v.number(),
    isPublished: v.boolean(),
  })),
  handler: async (ctx) => {
    console.log("getPublishedBlogPosts called");
    try {
      const posts = await ctx.db
        .query("blogPosts")
        .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
        .order("desc")
        .collect();
      
      // Ensure we return an array
      const result = Array.isArray(posts) ? posts : [];
      console.log(`Found ${result.length} published posts:`, result);
      return result;
    } catch (error) {
      console.error("Error fetching published blog posts:", error);
      // If there's an error, return an empty array instead of throwing
      return [];
    }
  },
});

// Get all blog posts (for admin)
export const getAllBlogPosts = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("blogPosts"),
    _creationTime: v.number(),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    publishedDate: v.number(),
    isPublished: v.boolean(),
  })),
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .order("desc")
      .collect();
    
    return posts;
  },
});

// Get a single blog post by slug
export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blogPosts"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      content: v.string(),
      summary: v.optional(v.string()),
      publishedDate: v.number(),
      isPublished: v.boolean(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    console.log("getBlogPostBySlug called with slug:", args.slug);
    
    try {
      if (!args.slug) {
        console.error("Empty slug provided");
        return null;
      }
      
      const post = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug))
        .first();
      
      if (!post) {
        console.log(`No post found with slug: ${args.slug}`);
        return null;
      }
      
      console.log("Found post:", post);
      return post;
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      throw error;
    }
  },
});

// Create a new blog post
export const createBlogPost = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    console.log("Creating blog post with args:", {
      title: args.title,
      slug: args.slug,
      contentLength: args.content.length,
      hasSummary: !!args.summary,
      isPublished: args.isPublished
    });
    
    try {
      // Validate data
      if (!args.title || !args.slug || !args.content) {
        console.error("Missing required fields");
        throw new Error("Missing required fields");
      }
      
      // Check if a post with the same slug already exists
      const existingPost = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug))
        .first();
        
      if (existingPost) {
        console.error("A post with this slug already exists");
        throw new Error("A post with this slug already exists");
      }
      
      // Insert the post
      const postId = await ctx.db.insert("blogPosts", {
        title: args.title,
        slug: args.slug,
        content: args.content,
        summary: args.summary,
        isPublished: args.isPublished,
        publishedDate: Date.now(),
      });
      
      console.log("Blog post created successfully with ID:", postId);
      return postId;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  },
});

// Update an existing blog post
export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    summary: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    
    // If post is being published for the first time, update publishedDate
    const post = await ctx.db.get(id);
    const updatedFields: Partial<{
      title: string;
      content: string;
      summary: string | undefined;
      isPublished: boolean;
      publishedDate: number;
    }> = fields;
    
    if (post && !post.isPublished && args.isPublished) {
      updatedFields.publishedDate = Date.now();
    }
    
    await ctx.db.patch(id, updatedFields);
    return id;
  },
}); 