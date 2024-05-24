import React, { useState } from "react";
import { auth } from "../../firebase/config";

const UserProfileForm = ({ user, userProfile }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleUpdateProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (newUsername) {
        await currentUser.updateProfile({ displayName: newUsername });
      }
      if (newEmail) {
        await currentUser.updateEmail(newEmail);
      }
      if (newPassword) {
        await currentUser.updatePassword(newPassword);
      }
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form>
        <label>
          New Username:
          <input
            type="text"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />
        </label>
        <label>
          New Email:
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleUpdateProfile}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;
