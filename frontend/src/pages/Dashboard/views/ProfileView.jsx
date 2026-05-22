import { User } from "lucide-react";

function ProfileView() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="bg-white border p-6 rounded-2xl flex items-center gap-4">
        <User size={40} />

        <div>
          <p className="font-bold">Eko</p>
          <p className="text-sm text-gray-500">Eko@email.com</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;