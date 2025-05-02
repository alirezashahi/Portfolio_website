import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type BlogPost = Doc<"blogPosts">;

const AdminBlogPage = () => {
  try {
    // Log the available API functions
    console.log("Available API functions:", api);
    
    const allPosts = useQuery(api.blog.getAllBlogPosts);
    const createPost = useMutation(api.blog.createBlogPost);
    const updatePost = useMutation(api.blog.updateBlogPost);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [editingPost, setEditingPost] = useState<Id<"blogPosts"> | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    const handleCreateOrUpdatePost = async () => {
      if (!title || !slug || !content) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        
        console.log("Attempting to save post with data:", {
          title,
          slug, 
          content,
          summary,
          isPublished
        });
        
        if (editingPost) {
          console.log("Updating post with ID:", editingPost);
          await updatePost({
            id: editingPost,
            title,
            content,
            summary: summary || undefined,
            isPublished,
          });
        } else {
          console.log("Creating new post");
          // Create the post with full content
          await createPost({
            title,
            slug,
            content,
            summary: summary || undefined,
            isPublished,
          });
        }
        console.log("Post saved successfully!");
        setTimeout(() => {
          resetForm();
          setShowForm(false);
          setIsSubmitting(false);
          // Refresh the page after successful creation
          window.location.href = "/admin/blog";
        }, 1000);
      } catch (error) {
        console.error("Error saving post:", error);
        setError("Failed to save post. Please try again.");
        setIsSubmitting(false);
      }
    };

    const handleEditPost = (post: BlogPost) => {
      try {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setSummary(post.summary || "");
        setIsPublished(post.isPublished);
        setEditingPost(post._id);
        setShowForm(true);
        
        // Scroll to form
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Error editing post:", error);
        setError("Failed to edit post. Please try again.");
      }
    };

    const resetForm = () => {
      setTitle("");
      setSlug("");
      setContent("");
      setSummary("");
      setIsPublished(false);
      setEditingPost(null);
      setError(null);
    };

    const handleTogglePublish = async (post: BlogPost) => {
      try {
        console.log("Toggling publish status for post:", post._id);
        await updatePost({
          id: post._id,
          isPublished: !post.isPublished,
        });
        console.log("Publish status toggled successfully");
      } catch (error) {
        console.error("Error toggling publish status:", error);
        setError("Failed to toggle publish status. Please try again.");
      }
    };

    const formatDate = (timestamp: number) => {
      try {
        return format(new Date(timestamp), "MMM d, yyyy");
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    };

    const generateSlug = () => {
      if (!title) return;
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      setSlug(slug);
    };

    const handlePreview = (post: BlogPost) => {
      navigate(`/blog/${post.slug}`);
    };

    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Blog Management</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            {showForm ? "Cancel" : "New Blog Post"}
          </button>
        </div>

        {showForm && (
          <div 
            ref={formRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title*</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={generateSlug}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter post title"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Slug*</label>
                <div className="flex">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="your-post-slug"
                    disabled={!!editingPost || isSubmitting}
                  />
                  {!editingPost && (
                    <button
                      onClick={generateSlug}
                      className="ml-2 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-lg"
                      disabled={!title || isSubmitting}
                    >
                      Generate
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {editingPost ? "Slug cannot be changed after creation" : "URL-friendly identifier for your post"}
                </p>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Summary (optional)</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={2}
                  placeholder="Brief summary of your post"
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-1 font-medium">Content*</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={12}
                  placeholder="Write your post content in Markdown format"
                  disabled={isSubmitting}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <label htmlFor="isPublished" className="font-medium">
                  Publish post
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdatePost}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>{editingPost ? "Update" : "Create"} Post</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <h2 className="p-4 text-xl font-semibold border-b dark:border-gray-700">
            All Blog Posts
          </h2>
          
          {allPosts === undefined ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : allPosts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No blog posts yet. Create your first post!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allPosts.map((post: BlogPost) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{post.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          /{post.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(post.publishedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.isPublished 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className="text-green-600 dark:text-green-400 hover:underline"
                        >
                          {post.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        {post.isPublished && (
                          <button
                            onClick={() => handlePreview(post)}
                            className="text-purple-600 dark:text-purple-400 hover:underline"
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Fatal error in AdminBlogPage:", error);
    
    // Ultimate fallback that will always render
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Blog Management</h1>
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-4">Something went wrong</p>
          <p className="text-gray-600 dark:text-gray-400">There was a problem loading the blog management interface.</p>
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
};

export default AdminBlogPage; 