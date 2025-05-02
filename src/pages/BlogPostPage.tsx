import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = useQuery(api.blog.getBlogPostBySlug, { slug: slug || "" });

  useEffect(() => {
    if (post === null) {
      navigate("/blog", { replace: true });
    }
  }, [post, navigate]);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMMM dd, yyyy");
  };

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
            <ReactMarkdown>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </motion.div>
    </div>
  );
};

export default BlogPostPage; 