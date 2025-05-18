import { Link, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { BookOpen, FolderKanban, Settings, LogOut } from "lucide-react";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut().then(() => {
      navigate("/");
    });
  };

  const adminModules = [
    {
      title: "Projects",
      description: "Manage portfolio projects - add, edit, and publish your work.",
      icon: <FolderKanban className="h-10 w-10 text-blue-500" />,
      link: "/admin/projects",
      color: "bg-blue-100 border-blue-200"
    },
    {
      title: "Blog",
      description: "Manage blog posts - write, edit, and publish articles.",
      icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
      link: "/admin/blog",
      color: "bg-emerald-100 border-emerald-200"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Welcome to your admin dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select a module below to manage your content
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminModules.map((module, index) => (
          <Link
            key={index}
            to={module.link}
            className={`block p-6 rounded-lg border-2 ${module.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start">
              <div className="mr-4">
                {module.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {module.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold">Quick Tips</h3>
          </div>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>Use the Projects module to showcase your portfolio work</li>
            <li>Use the Blog module to share your thoughts and expertise</li>
            <li>All content can be saved as drafts before publishing</li>
            <li>Remember to upload high-quality images for better presentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 