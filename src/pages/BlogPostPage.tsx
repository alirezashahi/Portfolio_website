import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

// Add a simple error boundary for the markdown rendering
const SafeMarkdown = ({ content }: { content: string }) => {
  try {
    return (
      <div className="prose prose-lg prose-slate max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-800
                      prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:text-gray-900
                      prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-gray-800 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
                      prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800
                      prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-700
                      prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                      prose-a:text-gray-900 prose-a:underline prose-a:decoration-gray-400 hover:prose-a:decoration-gray-600 prose-a:underline-offset-2
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-em:text-gray-700 prose-em:italic
                      prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-gray-800 prose-code:font-mono
                      prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:p-4
                      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic
                      prose-ul:space-y-2 prose-ol:space-y-2
                      prose-li:text-gray-700 prose-li:leading-relaxed
                      prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 prose-img:border prose-img:border-gray-200
                      prose-hr:border-gray-300 prose-hr:my-8
                      prose-table:text-sm prose-thead:bg-gray-50 prose-th:p-3 prose-td:p-3 prose-th:text-gray-900 prose-td:text-gray-700">
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-medium mb-2">Error rendering content</p>
        <p className="text-red-600 text-sm">Please contact the administrator if this problem persists.</p>
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

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  // Handle errors
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Post</h1>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading article...</p>
            </div>
          </div>
        </div>
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
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.094-.833-2.864 0L4.95 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid Post Data</h1>
              <p className="text-gray-600">This post contains invalid or incomplete data.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safely check if post should be displayed
  if (post && 'isPublished' in post && post.isPublished === false) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-50 border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Post Not Published</h1>
              <p className="text-gray-600">This content is not yet available to the public.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main rendering with error boundary
  try {
    const readingTime = estimateReadingTime(post.content);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 pt-20"
      >
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Back Navigation */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Article Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 mb-8">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(post.publishedDate).toISOString()}>
                    {formatDate(post.publishedDate)}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Summary/Excerpt */}
              {post.summary && (
                <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="border-t border-gray-200 pt-8">
              <SafeMarkdown content={post.content} />
            </div>
          </div>

          {/* Article Footer */}
          <footer className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors group font-medium"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                All Articles
              </Link>
              
              <div className="text-sm text-gray-500">
                Published on {formatDate(post.publishedDate)}
              </div>
            </div>
          </footer>
        </article>
      </motion.div>
    );
  } catch (renderError) {
    console.error("Error rendering blog post:", renderError);
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">Rendering Error</h1>
              <p className="text-gray-600">There was a problem displaying this content.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default BlogPostPage; 