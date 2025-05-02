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
      <div className="prose dark:prose-invert max-w-none">
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
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/blog" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 mb-6 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <article className="prose dark:prose-invert lg:prose-lg max-w-none">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="text-gray-500 dark:text-gray-400 mb-8">
              {formatDate(post.publishedDate)}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
              <SafeMarkdown content={post.content} />
            </div>
          </article>
        </motion.div>
      </div>
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