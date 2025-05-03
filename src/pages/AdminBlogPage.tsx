import { useState, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react"; // Import useConvex instead
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useEffect } from "react"; // Import useEffect

type BlogPost = Doc<"blogPosts">;

const AdminBlogPage = () => {
  try {
    // Log the available API functions
    console.log("Available API functions:", api);
    
    const allPosts = useQuery(api.blog.getAllBlogPosts);
    const createPost = useMutation(api.blog.createBlogPost);
    const updatePost = useMutation(api.blog.updateBlogPost);
    const deletePost = useMutation(api.blog.deleteBlogPost);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const storeFileMetadata = useMutation(api.files.storeFileMetadata);
    // We don't need useQuery for getFileUrl here, we'll use the client directly
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const convex = useConvex(); // Use useConvex() to get the client instance
    const storedFiles = useQuery(api.files.listFiles); // Fetch list of files

    // Temporary useEffect to log stored files for debugging
    useEffect(() => {
      if (storedFiles) {
        console.log("Stored Files List:", storedFiles);
      }
    }, [storedFiles]);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [editingPost, setEditingPost] = useState<Id<"blogPosts"> | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const formRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSignOut = () => {
      signOut().then(() => {
        navigate("/");
      });
    };

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

    const handleImageUpload = async () => {
      if (!fileInputRef.current?.files?.length) return;
      
      const file = fileInputRef.current.files[0];
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        // 1. Get a URL to upload the image to
        const uploadUrl = await generateUploadUrl();
        console.log("Got upload URL:", uploadUrl);
        
        // 2. Upload the image to the URL
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl); // Changed from PUT to POST
        xhr.setRequestHeader("Content-Type", file.type);
        
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
        
        xhr.onload = async () => {
          if (xhr.status === 200 || xhr.status === 201) {
            // Success - Extract storageId from response
            let storageId: Id<"_storage"> | null = null;
            try {
              const responseData = JSON.parse(xhr.responseText);
              if (responseData.storageId) {
                storageId = responseData.storageId as Id<"_storage">;
                console.log("Storage ID from response:", storageId);
              } else {
                throw new Error("storageId not found in response JSON");
              }
            } catch (e) {
              console.error("Error parsing upload response or missing storageId:", e);
              setError(`File uploaded, but failed to get storage ID: ${e instanceof Error ? e.message : String(e)}`);
              setIsUploading(false);
              return; // Stop processing if we can't get the ID
            }

            if (!storageId) {
              setError("File uploaded, but could not determine storage ID.");
              setIsUploading(false);
              return;
            }

            try {
              // Store the file metadata (optional, but good practice)
              await storeFileMetadata({
                storageId: storageId, // Pass the validated ID
                filename: file.name,
                contentType: file.type,
                description: `Image uploaded for blog post`,
              });
              console.log("File metadata stored successfully for:", storageId);

              // Get the permanent retrieval URL using the new query
              const retrievalUrl = await convex.query(api.files.getFileUrl, { storageId });

              if (!retrievalUrl) {
                throw new Error("Could not retrieve file URL after upload.");
              }
              console.log("Got retrieval URL:", retrievalUrl);

              // Insert at current cursor position or at the end
              if (contentTextareaRef.current) {
                const textarea = contentTextareaRef.current;
                const cursorPos = textarea.selectionStart;
                const textBefore = content.substring(0, cursorPos);
                const textAfter = content.substring(cursorPos);

                // Insert markdown image syntax WITH THE CORRECT URL
                const imageMarkdown = `![${file.name}](${retrievalUrl})`;
                setContent(textBefore + imageMarkdown + textAfter);

                // Reset after short delay
                setTimeout(() => {
                  setIsUploading(false);
                  setUploadProgress(0);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }, 1000);
                
                // Focus back on textarea and place cursor after inserted image
                setTimeout(() => {
                  textarea.focus();
                  const newCursorPos = cursorPos + imageMarkdown.length;
                  textarea.setSelectionRange(newCursorPos, newCursorPos);
                }, 100);
              }
            } catch (metadataError) {
              console.error("Error storing file metadata:", metadataError);
              setError(`File uploaded but could not store metadata: ${metadataError instanceof Error ? metadataError.message : String(metadataError)}`);
              setIsUploading(false);
            }
          } else {
            throw new Error("Upload failed with status: " + xhr.status);
          }
        };
        
        xhr.onerror = () => {
          throw new Error("Network error during upload");
        };
        
        xhr.send(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(`Failed to upload image: ${error instanceof Error ? error.message : String(error)}`);
        setIsUploading(false);
      }
    };

    const insertTemplate = (template: string) => {
      if (contentTextareaRef.current) {
        const textarea = contentTextareaRef.current;
        const cursorPos = textarea.selectionStart;
        const textBefore = content.substring(0, cursorPos);
        const textAfter = content.substring(cursorPos);
        
        setContent(textBefore + template + textAfter);
        
        // Focus back on textarea and place cursor at a strategic position
        setTimeout(() => {
          textarea.focus();
          const newCursorPos = cursorPos + template.indexOf("▒"); // Place cursor where the special char is
          const finalContent = textBefore + template.replace("▒", "") + textAfter;
          setContent(finalContent);
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 50);
      }
    };

    const handleInsertMarkdownElement = (type: string) => {
      switch (type) {
        case 'h1':
          insertTemplate("\n# ▒Heading 1\n");
          break;
        case 'h2':
          insertTemplate("\n## ▒Heading 2\n");
          break;
        case 'h3':
          insertTemplate("\n### ▒Heading 3\n");
          break;
        case 'bold':
          insertTemplate("**▒bold text**");
          break;
        case 'italic':
          insertTemplate("*▒italic text*");
          break;
        case 'link':
          insertTemplate("[▒link text](https://example.com)");
          break;
        case 'list':
          insertTemplate("\n- ▒Item 1\n- Item 2\n- Item 3\n");
          break;
        case 'code':
          insertTemplate("\n```\n▒// Your code here\n```\n");
          break;
        case 'quote':
          insertTemplate("\n> ▒Quote goes here\n");
          break;
        case 'hr':
          insertTemplate("\n---\n▒");
          break;
        case 'image':
          // Open file upload dialog
          fileInputRef.current?.click();
          break;
        default:
          break;
      }
    };

    // Handle delete post
    const handleDeletePost = async (post: BlogPost) => {
      if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
        try {
          console.log("Deleting post:", post._id);
          await deletePost({ id: post._id });
          console.log("Post deleted successfully");
        } catch (error) {
          console.error("Error deleting post:", error);
          setError("Failed to delete post. Please try again.");
        }
      }
    };

    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

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
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {showForm ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Blog Post
              </>
            )}
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
                <div className="mb-2 flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <button 
                    onClick={() => handleInsertMarkdownElement('h1')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Heading 1"
                  >
                    H1
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('h2')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('h3')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Heading 3"
                  >
                    H3
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('bold')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('italic')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('link')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Link"
                  >
                    <span className="underline">Link</span>
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('list')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="List"
                  >
                    List
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('code')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Code"
                  >
                    Code
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('quote')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Quote"
                  >
                    Quote
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('hr')}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                    title="Horizontal Rule"
                  >
                    HR
                  </button>
                  <button 
                    onClick={() => handleInsertMarkdownElement('image')}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Insert Image"
                    disabled={isUploading}
                  >
                    {isUploading ? `Uploading ${uploadProgress}%` : 'Image'}
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <textarea
                  ref={contentTextareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 font-mono"
                  rows={16}
                  placeholder="Write your post content in Markdown format"
                  disabled={isSubmitting}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Supports Markdown formatting. Use the buttons above to insert common elements or upload images.
                </p>
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
                        <button
                          onClick={() => handleDeletePost(post)}
                          className="text-red-600 dark:text-red-400 hover:underline"
                        >
                          Delete
                        </button>
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
