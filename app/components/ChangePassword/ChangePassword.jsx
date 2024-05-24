"use client";
import { useState } from "react";
import Modal from "../Modal/Modal";
import CustomButton from "../CustomButton/CustomButton";
import FormInput from "../FormInput/FormInput";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const ChangePasswordModal = props => {
  const { isOpen, onClose, user } = props;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrorMessage("");
      alert("Password updated successfully!");
      onClose();
    } catch (error) {
      setErrorMessage("Failed to update password. Please try again.");
      console.error("Error changing password:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Change Password
      </h2>
      <FormInput
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
      />
      <div></div>
      <FormInput
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      <FormInput
        type="password"
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={e => setConfirmNewPassword(e.target.value)}
      />
      <p className="error-message">{errorMessage}</p>
      <CustomButton onClick={handleChangePassword} className="customButton">
        Change Password
      </CustomButton>
    </Modal>
  );
};

export default ChangePasswordModal;
