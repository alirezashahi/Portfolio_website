import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Migration to remove the blocks field from all blogPosts
export const cleanupBlogPostsFields = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    // Get all blogPosts
    const posts = await ctx.db
      .query("blogPosts")
      .collect();

    let count = 0;
    for (const post of posts) {
      // Check if the post has the blocks field
      if ('blocks' in post) {
        // Destructure to remove blocks (and any other fields we want to remove)
        const { blocks, ...restOfPost } = post;
        
        // Replace the document with the clean version
        await ctx.db.replace(post._id, restOfPost);
        count++;
      }
    }
    
    console.log(`Cleaned up fields from ${count} blogPosts documents.`);
    return count;
  },
}); 