import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define the expected post type
interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedDate: number;
  summary?: string;
  imageUrl?: string;
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">My Blog</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">My Blog</h1>
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <p className="text-xl text-red-600 dark:text-red-400 mb-4 font-semibold">Something went wrong</p>
            <p className="text-gray-600 dark:text-gray-400">{state.error}</p>
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left overflow-auto max-w-full mx-auto text-xs">
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
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Simplified blog post rendering
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">My Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Thoughts, ideas, and discoveries</p>
          </header>
          
          {!state.posts || state.posts.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">No blog posts found</p>
              <Link to="/admin/blog" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {state.posts.map((post) => {
                  // Extra safety check for each post
                  if (!post || typeof post !== 'object' || !post._id || !post.title || !post.slug) {
                    console.error("Invalid post object:", post);
                    return null;
                  }
                  
                  return (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="h-3 bg-blue-600 dark:bg-blue-500"></div>
                        <div className="p-6">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                            {new Date(post.publishedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {post.title}
                          </h2>
                          {post.summary && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                              {post.summary}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                              Read article
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPage; 