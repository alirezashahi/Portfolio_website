import { UserProfile } from "@clerk/clerk-react";

const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Manage Your Profile</h1>
      <UserProfile path="/profile" routing="path" />
    </div>
  );
};

export default ProfilePage;
