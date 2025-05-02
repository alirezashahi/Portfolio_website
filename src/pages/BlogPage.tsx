import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Doc } from "../../convex/_generated/dataModel";
import { useEffect } from "react";

type BlogPost = Doc<"blogPosts">;

const BlogPage = () => {
  console.log("API object:", api);
  
  const blogPosts = useQuery(api.blog.getPublishedBlogPosts);
  const debugResult = useQuery(api.blog.debugFunction);
  
  useEffect(() => {
    console.log("Debug function result:", debugResult);
    console.log("Blog posts:", blogPosts);
  }, [debugResult, blogPosts]);

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMMM dd, yyyy");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
      
      {blogPosts === undefined ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">No blog posts found.</p>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {blogPosts.map((post: BlogPost) => (
            <motion.div
              key={post._id}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link to={`/blog/${post.slug}`} className="block p-6">
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {formatDate(post.publishedDate)}
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BlogPage; 