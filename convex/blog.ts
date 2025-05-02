import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Get all published blog posts
export const getPublishedBlogPosts = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("blogPosts"),
    _creationTime: v.number(),
    title: v.string(),
    slug: v.string(),
    summary: v.optional(v.string()),
    publishedDate: v.number(),
  })),
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
    
    return posts;
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
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    return post;
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
    const postId = await ctx.db.insert("blogPosts", {
      title: args.title,
      slug: args.slug,
      content: args.content,
      summary: args.summary,
      isPublished: args.isPublished,
      publishedDate: Date.now(),
    });
    
    return postId;
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