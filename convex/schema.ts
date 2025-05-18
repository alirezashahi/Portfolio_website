import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    summary: v.optional(v.string()),
    isPublished: v.boolean(),
    publishedDate: v.number(),
    imageUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"])
    .index("by_publishedDate", ["publishedDate"])
    .index("by_isPublished", ["isPublished"]),
  
  // Add projects table for detailed project information
  projects: defineTable({
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
    createdAt: v.number(),
    isPublished: v.boolean(),
  }).index("by_slug", ["slug"])
    .index("by_isPublished", ["isPublished"]),
  
  // Add storageFiles table for handling uploaded files
  storageFiles: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
    description: v.optional(v.string()),
    uploadedAt: v.number(),
  }),
}); 