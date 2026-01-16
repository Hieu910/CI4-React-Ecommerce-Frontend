import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { updateProfileAsync } from "@/store/authSlice";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changeUserPassword } from "@/services/api";

const UserProfileForm = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      await dispatch(updateProfileAsync({ name: name.trim() })).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Email
            </label>
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="bg-muted rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary rounded-lg"
            />
          </div>
          <Button type="submit" className="rounded-lg">
            Save Changes
          </Button>
        </form>
      </div>

      <div className="bg-card rounded-xl p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-secondary rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-secondary rounded-lg"
            />
          </div>
          <Button type="submit" className="rounded-lg">
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
