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
  }).index("by_slug", ["slug"])
    .index("by_publishedDate", ["publishedDate"])
    .index("by_isPublished", ["isPublished"]),
}); 