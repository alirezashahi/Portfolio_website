import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Define the expected post type
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedDate: number;
  summary?: string;
}

// Define a type for possible response formats
type BlogResponse = BlogPost[] | { results?: BlogPost[] };

const BlogPage = () => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    posts: BlogPost[] | null;
  }>({
    loading: true,
    error: null,
    posts: null
  });

  // Debug function only
  const debug = useQuery(api.blog.debugFunction);
  
  // Get blog posts
  const blogPostsResponse = useQuery(api.blog.getPublishedBlogPosts);
  
  // Process the response when it changes
  useEffect(() => {
    console.log("API object:", api);
    console.log("Debug function result:", debug);
    console.log("Blog posts response:", blogPostsResponse);
    
    if (blogPostsResponse === undefined) {
      // Still loading
      return;
    }
    
    try {
      // Check if we got an array of posts
      if (Array.isArray(blogPostsResponse)) {
        setState({
          loading: false,
          error: null,
          posts: blogPostsResponse
        });
        return;
      }
      
      // If not an array but a valid response object
      if (blogPostsResponse && typeof blogPostsResponse === 'object') {
        console.log("Response object keys:", Object.keys(blogPostsResponse));
        
        // Try to convert to array of posts
        let validPosts: BlogPost[] = [];
        
        // Case: The response has a 'results' property
        const responseObj = blogPostsResponse as Record<string, any>;
        if ('results' in responseObj && Array.isArray(responseObj.results)) {
          validPosts = responseObj.results as BlogPost[];
        } else {
          // Try to extract posts from object values
          Object.values(blogPostsResponse).forEach(item => {
            // Validate each item has required blog post fields
            if (item && 
                typeof item === 'object' && 
                '_id' in item && 
                'title' in item && 
                'slug' in item && 
                'publishedDate' in item) {
              validPosts.push(item as BlogPost);
            }
          });
        }
        
        setState({
          loading: false,
          error: validPosts.length ? null : "No valid blog posts found in response",
          posts: validPosts
        });
        return;
      }
      
      // If we get here, the response is neither an array nor a valid object
      setState({
        loading: false,
        error: `Received unexpected response: ${JSON.stringify(blogPostsResponse)}`,
        posts: []
      });
      
    } catch (err) {
      console.error("Error processing blog posts response:", err);
      setState({
        loading: false,
        error: `Error processing response: ${err instanceof Error ? err.message : String(err)}`,
        posts: []
      });
    }
  }, [blogPostsResponse, debug]);

  if (state.loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Something went wrong</p>
          <p className="text-gray-600 dark:text-gray-400">{state.error}</p>
          <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-w-2xl mx-auto text-xs">
            {JSON.stringify({
              apiExists: !!api,
              blogExists: !!(api as any).blog,
              debugResult: debug,
              blogPostsResponse: typeof blogPostsResponse === 'object' ? 
                'Object with keys: ' + Object.keys(blogPostsResponse || {}).join(', ') : 
                String(blogPostsResponse),
              envVar: import.meta.env.VITE_CONVEX_URL || 'undefined'
            }, null, 2)}
          </pre>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Simplified blog post rendering
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
      
      {!state.posts || state.posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">No blog posts found.</p>
          <Link to="/admin/blog" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {state.posts.map((post) => {
            // Extra safety check for each post
            if (!post || typeof post !== 'object' || !post._id || !post.title || !post.slug) {
              console.error("Invalid post object:", post);
              return null;
            }
            
            return (
              <div
                key={post._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/blog/${post.slug}`} className="block p-6">
                  <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {new Date(post.publishedDate).toLocaleDateString()}
                  </p>
                  {post.summary && (
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                      {post.summary}
                    </p>
                  )}
                  <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
                    Read more →
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogPage; 