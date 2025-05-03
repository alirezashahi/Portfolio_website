import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// File retrieval endpoint
http.route({
  path: "/file/:storageId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    
    // Extract storageId from the path correctly
    // The path will be something like /file/abc123
    const pathParts = url.pathname.split('/');
    const storageId = pathParts[pathParts.length - 1];
    
    console.log("File retrieval request for ID:", storageId);
    
    if (!storageId) {
      return new Response("Missing file ID", { status: 400 });
    }
    
    try {
      // Get the file URL from Convex storage
      const fileUrl = await ctx.storage.getUrl(storageId);
      
      if (!fileUrl) {
        return new Response("File not found", { status: 404 });
      }
      
      // Redirect to the actual file
      return new Response(null, {
        status: 302, // Temporary redirect
        headers: {
          Location: fileUrl,
          "Cache-Control": "public, max-age=3600" // Add caching for 1 hour
        },
      });
    } catch (error) {
      console.error("Error retrieving file:", error);
      return new Response("Error retrieving file", { status: 500 });
    }
  }),
});

// Add a direct image serving endpoint
http.route({
  path: "/image/:storageId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    
    // Extract storageId from URL path
    const pathParts = url.pathname.split('/');
    const storageId = pathParts[pathParts.length - 1];
    
    console.log("Image serving request for ID:", storageId);
    
    if (!storageId) {
      return new Response("Missing image ID", { status: 400 });
    }
    
    try {
      // Get the file URL from Convex storage
      const fileUrl = await ctx.storage.getUrl(storageId);
      
      if (!fileUrl) {
        return new Response("Image not found", { status: 404 });
      }
      
      // Fetch the image data
      const imageResponse = await fetch(fileUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      
      // Get content type from the response
      const contentType = imageResponse.headers.get("Content-Type") || "application/octet-stream";
      const imageData = await imageResponse.arrayBuffer();
      
      // Return the image with appropriate headers
      return new Response(imageData, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400", // Cache for 1 day
          "Access-Control-Allow-Origin": "*" // Allow cross-origin requests
        }
      });
    } catch (error) {
      console.error("Error serving image:", error);
      return new Response("Error serving image", { status: 500 });
    }
  }),
});

export default http; 