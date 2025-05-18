import { useState, useRef } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

type Project = Doc<"projects">;

const AdminProjectsPage = () => {
  const allProjects = useQuery(api.projects.getProjects);
  const createProject = useMutation(api.projects.createProject);
  const updateProject = useMutation(api.projects.updateProject);
  const deleteProject = useMutation(api.projects.deleteProject);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const storeFileMetadata = useMutation(api.files.storeFileMetadata);
  
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const convex = useConvex();
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [overview, setOverview] = useState("");
  const [role, setRole] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [process, setProcess] = useState("");
  const [challenges, setChallenges] = useState("");
  const [outcomes, setOutcomes] = useState("");
  const [images, setImages] = useState<Array<{url: string; alt: string; caption?: string}>>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [links, setLinks] = useState<{
    liveDemo?: string;
    github?: string;
    video?: string;
    slides?: string;
  }>({});
  const [icon, setIcon] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  // UI state
  const [editingProject, setEditingProject] = useState<Id<"projects"> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/");
    });
  };
  
  const resetForm = () => {
    setTitle("");
    setSlug("");
    setSubtitle("");
    setOverview("");
    setRole("");
    setFeatures([]);
    setFeatureInput("");
    setTechnologies([]);
    setTechInput("");
    setProcess("");
    setChallenges("");
    setOutcomes("");
    setImages([]);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setLinks({});
    setIcon("");
    setIsPublished(false);
    setEditingProject(null);
    setError(null);
  };
  
  const handleCreateOrUpdateProject = async () => {
    if (!title || !slug || !subtitle || !overview || !role || features.length === 0 || technologies.length === 0 || !challenges || !outcomes) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const projectData = {
        title,
        slug,
        subtitle,
        overview,
        role,
        features,
        technologies,
        process: process || undefined,
        challenges,
        outcomes,
        images,
        links,
        icon: icon || undefined,
        isPublished
      };
      
      if (editingProject) {
        await updateProject({
          id: editingProject,
          ...projectData
        });
      } else {
        await createProject(projectData);
      }
      
      setTimeout(() => {
        resetForm();
        setShowForm(false);
        setIsSubmitting(false);
        // Refresh the page
        window.location.href = "/admin/projects";
      }, 1000);
    } catch (error) {
      console.error("Error saving project:", error);
      setError(`Failed to save project: ${error instanceof Error ? error.message : String(error)}`);
      setIsSubmitting(false);
    }
  };
  
  const handleEditProject = (project: Project) => {
    setTitle(project.title);
    setSlug(project.slug);
    setSubtitle(project.subtitle);
    setOverview(project.overview);
    setRole(project.role);
    setFeatures(project.features);
    setTechnologies(project.technologies);
    setProcess(project.process || "");
    setChallenges(project.challenges);
    setOutcomes(project.outcomes);
    setImages(project.images);
    setLinks(project.links);
    setIcon(project.icon || "");
    setIsPublished(project.isPublished);
    setEditingProject(project._id);
    setShowForm(true);
    
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  const handleTogglePublish = async (project: Project) => {
    try {
      await updateProject({
        id: project._id,
        isPublished: !project.isPublished,
      });
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setError(`Failed to toggle publish status: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      try {
        await deleteProject({ id: project._id });
      } catch (error) {
        console.error("Error deleting project:", error);
        setError(`Failed to delete project: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };
  
  const formatDate = (timestamp: number) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  const generateSlug = () => {
    if (!title) return;
    const newSlug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setSlug(newSlug);
  };
  
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };
  
  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput("");
    }
  };
  
  const handleRemoveTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };
  
  const handleAddImage = async () => {
    if (!imageUrl.trim() || !imageAlt.trim()) {
      setError("Image URL and alt text are required");
      return;
    }
    
    const newImage = {
      url: imageUrl.trim(),
      alt: imageAlt.trim(),
      caption: imageCaption.trim() || undefined
    };
    
    setImages([...images, newImage]);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleUpdateLinks = (key: 'liveDemo' | 'github' | 'video' | 'slides', value: string) => {
    setLinks({
      ...links,
      [key]: value.trim() || undefined
    });
  };
  
  const handlePreview = (project: Project) => {
    navigate(`/projects/${project.slug}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Management</h1>
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
              New Project
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
            {editingProject ? "Edit Project" : "Create New Project"}
          </h2>
          
          <div className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="block mb-1 font-medium">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={generateSlug}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Project title"
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
                  placeholder="project-slug"
                  disabled={!!editingProject || isSubmitting}
                />
                {!editingProject && (
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
                {editingProject ? "Slug cannot be changed after creation" : "URL-friendly identifier for your project"}
              </p>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Subtitle/Elevator Pitch*</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Brief pitch describing the project"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Icon (optional)</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={isSubmitting}
              >
                <option value="">Select an icon</option>
                <option value="book">Book</option>
                <option value="chart">Chart</option>
                <option value="building">Building</option>
              </select>
            </div>
            
            {/* Content Sections */}
            <div>
              <label className="block mb-1 font-medium">Overview/Problem Statement*</label>
              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                placeholder="Detailed context and problem solved by the project"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block mb-1 font-medium">Your Role and Responsibilities*</label>
              <textarea
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={2}
                placeholder="Describe your specific role and contributions"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Features List */}
            <div>
              <label className="block mb-1 font-medium">Key Features & Functionality*</label>
              <div className="flex">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Add a feature"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleAddFeature}
                  className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
                  disabled={!featureInput.trim() || isSubmitting}
                >
                  Add
                </button>
              </div>
              
              {features.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                      <span>{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Technologies List */}
            <div>
              <label className="block mb-1 font-medium">Technologies & Tools Used*</label>
              <div className="flex">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Add a technology"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTechnology()}
                  disabled={isSubmitting}
                />
                <button
                  onClick={handleAddTechnology}
                  className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-lg"
                  disabled={!techInput.trim() || isSubmitting}
                >
                  Add
                </button>
              </div>
              
              {technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <div key={index} className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full">
                      <span>{tech}</span>
                      <button
                        onClick={() => handleRemoveTechnology(index)}
                        className="ml-2 text-primary hover:text-primary/70"
                        disabled={isSubmitting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Process */}
            <div>
              <label className="block mb-1 font-medium">The Process / Approach (optional)</label>
              <textarea
                value={process}
                onChange={(e) => setProcess(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                placeholder="Brief description of the methodology"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Challenges */}
            <div>
              <label className="block mb-1 font-medium">Challenges & Solutions*</label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                placeholder="Describe significant challenges and how they were overcome"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Outcomes */}
            <div>
              <label className="block mb-1 font-medium">Results & Impact / Outcomes*</label>
              <textarea
                value={outcomes}
                onChange={(e) => setOutcomes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                placeholder="Quantifiable results and personal learnings"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Images */}
            <div>
              <label className="block mb-1 font-medium">Project Images</label>
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Image URL*"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Alt text*"
                    disabled={isSubmitting}
                  />
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Caption (optional)"
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  onClick={handleAddImage}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg"
                  disabled={!imageUrl.trim() || !imageAlt.trim() || isSubmitting}
                >
                  Add Image
                </button>
              </div>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative border rounded-lg overflow-hidden">
                      <img src={image.url} alt={image.alt} className="w-full h-40 object-cover" />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="bg-red-500 text-white p-1 rounded-full"
                          disabled={isSubmitting}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 bg-gray-100 dark:bg-gray-700">
                        <p className="text-sm truncate">{image.alt}</p>
                        {image.caption && <p className="text-xs text-gray-500 truncate">{image.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Links */}
            <div>
              <label className="block mb-1 font-medium">Links</label>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={links.liveDemo || ""}
                    onChange={(e) => handleUpdateLinks('liveDemo', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">GitHub Repository</label>
                  <input
                    type="text"
                    value={links.github || ""}
                    onChange={(e) => handleUpdateLinks('github', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://github.com/username/repo"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Video Walkthrough</label>
                  <input
                    type="text"
                    value={links.video || ""}
                    onChange={(e) => handleUpdateLinks('video', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://youtube.com/watch?v=id"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Slide Deck / Report</label>
                  <input
                    type="text"
                    value={links.slides || ""}
                    onChange={(e) => handleUpdateLinks('slides', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="https://slides.com/presentation"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
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
                Publish project
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
                onClick={handleCreateOrUpdateProject}
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
                  <>{editingProject ? "Update" : "Create"} Project</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="p-4 text-xl font-semibold border-b dark:border-gray-700">
          All Projects
        </h2>
        
        {allProjects === undefined ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : allProjects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No projects yet. Create your first project!
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
                {allProjects.map((project: Project) => (
                  <tr key={project._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{project.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        /{project.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.isPublished 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        {project.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      {project.isPublished && (
                        <button
                          onClick={() => handlePreview(project)}
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProject(project)}
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
};

export default AdminProjectsPage; 