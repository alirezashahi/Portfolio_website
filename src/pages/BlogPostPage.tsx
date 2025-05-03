import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Add a simple error boundary for the markdown rendering
const SafeMarkdown = ({ content }: { content: string }) => {
  try {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none font-serif prose-img:rounded-xl prose-img:mx-auto prose-headings:text-blue-900 dark:prose-headings:text-blue-200 prose-a:text-blue-600 dark:prose-a:text-blue-400">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          skipHtml={true}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error("Error rendering markdown:", error);
    return (
      <div className="markdown-error">
        <p>Error rendering content. Please contact the administrator.</p>
        <pre className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          {content.substring(0, 150)}...
        </pre>
      </div>
    );
  }
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  console.log("BlogPostPage rendering with slug:", slug);
  const post = useQuery(api.blog.getBlogPostBySlug, { slug: slug || "" });

  useEffect(() => {
    console.log("BlogPostPage useEffect triggered with post:", post);
    
    // Handle null post (not found)
    if (post === null) {
      console.log("Post not found, redirecting to blog list");
      navigate("/blog", { replace: true });
    }
    
    // Handle post with incorrect/missing data
    if (post && (!post.title || !post.content || !post.publishedDate)) {
      console.error("Post has invalid data:", post);
      setError("This post appears to be corrupted or incomplete.");
    }
  }, [post, navigate]);

  const formatDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp), "MMMM dd, yyyy");
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  // Handle errors
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Error loading blog post</p>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (post === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (post === null) {
    return null; // Will redirect via the useEffect
  }

  // Validate post has all required fields
  if (!post.title || !post.content || !post.publishedDate) {
    console.error("Invalid post data:", post);
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Invalid blog post data</p>
          <p className="text-gray-600 dark:text-gray-400">This post contains invalid data.</p>
        </div>
      </div>
    );
  }

  // Safely check if post should be displayed
  if (post && 'isPublished' in post && post.isPublished === false) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">This post is not yet published</p>
          <p className="text-gray-500 dark:text-gray-400">This content is currently unavailable.</p>
        </div>
      </div>
    );
  }

  // Main rendering with error boundary
  try {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>

            <article>
              <header className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="text-gray-600 dark:text-gray-400 text-lg">
                  {formatDate(post.publishedDate)}
                </div>
              </header>
              
              {post.summary && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
                  <p className="text-lg italic text-gray-700 dark:text-gray-300">{post.summary}</p>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
                <SafeMarkdown content={post.content} />
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all articles
                </Link>
              </div>
            </article>
          </div>
        </div>
      </motion.div>
    );
  } catch (renderError) {
    console.error("Error rendering blog post:", renderError);
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Error displaying blog post</p>
          <p className="text-gray-600 dark:text-gray-400">There was a problem displaying this content.</p>
        </div>
      </div>
    );
  }
};

export default BlogPostPage; 