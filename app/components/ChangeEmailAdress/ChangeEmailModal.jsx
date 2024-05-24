import React, { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import FormInput from "../FormInput/FormInput.jsx";

const ChangeEmailModal = ({ isOpen, onClose, user }) => {
  const [newEmail, setNewEmail] = useState("");
  const [actualPassword, setActualPassword] = useState("");
  const [error, setError] = useState(null);

  const handleChangeEmail = async () => {
    try {
      const credentials = EmailAuthProvider.credential(
        user.email,
        actualPassword,
      );
      await reauthenticateWithCredential(user, credentials);
      await updateEmail(user, newEmail);
      onClose();
      setActualPassword("");
      setError(null);
      setNewEmail("");
    } catch (error) {
      setError("An user already has this e-mail adress");
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Email</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="text-black">
        <p>New Email:</p>
        <FormInput
          type="email"
          placeholder="example@example.com"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
        />
        <p>Confirm changes with password</p>
        <FormInput
          type="password"
          value={actualPassword}
          onChange={e => setActualPassword(e.target.value)}
        />
      </div>
      <div>
        <CustomButton
          onClick={handleChangeEmail}
          disabled={!actualPassword}
          className="customButton"
        >
          Change Email
        </CustomButton>
      </div>
    </Modal>
  );
};

export default ChangeEmailModal;
