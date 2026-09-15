import { useState } from "react";
import {
  Check,
  KeyRound,
  LogOut,
  Mail,
  Save,
  User,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import {
  changePassword,
  updateProfile,
} from "../services/profileService";

import "./Profile.css";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const getInitials = () => {
    if (!user?.name) return "U";

    return user.name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!profileForm.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSavingProfile(true);

      const data = await updateProfile({
        name: profileForm.name,
        email: profileForm.email,
      });

      updateUser(data.user);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword) {
      toast.error("Enter your current password");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("Enter a new password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <p className="profile-eyebrow">Account</p>
          <h1>Profile</h1>
          <p>
            Manage your personal information and account
            settings.
          </p>
        </div>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              getInitials()
            )}
          </div>

          <h2>{user?.name}</h2>

          <div className="profile-email">
            <Mail size={15} />
            <span>{user?.email}</span>
          </div>

          <div className="profile-status">
            <span className="status-dot" />
            Active account
          </div>

          <div className="profile-summary-divider" />

          <button
            className="profile-logout-button"
            onClick={logout}
          >
            <LogOut size={17} />
            Logout
          </button>
        </aside>

        <main className="profile-content">
          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <UserRound size={19} />
              </div>

              <div>
                <h2>Personal Information</h2>
                <p>
                  Update the information associated with
                  your Campusly account.
                </p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handleProfileSubmit}
            >
              <div className="profile-form-group">
                <label htmlFor="name">Full Name</label>

                <div className="profile-input-wrapper">
                  <User size={17} />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Enter your name"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label htmlFor="email">Email Address</label>

                <div className="profile-input-wrapper">
                  <Mail size={17} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <>
                      <span className="button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <KeyRound size={19} />
              </div>

              <div>
                <h2>Change Password</h2>
                <p>
                  Keep your account secure with a strong
                  password.
                </p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={handlePasswordSubmit}
            >
              <div className="profile-form-group">
                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="newPassword">
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat new password"
                  minLength={6}
                  required
                />
              </div>

              <div className="profile-password-note">
                <Check size={15} />
                Password must contain at least 6 characters.
              </div>

              <div className="profile-form-actions">
                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={changingPassword}
                >
                  {changingPassword ? (
                    <>
                      <span className="button-spinner" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyRound size={17} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;