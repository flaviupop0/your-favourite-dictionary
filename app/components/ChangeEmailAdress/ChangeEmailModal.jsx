import React, { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { updateEmail } from "firebase/auth";

const ChangeEmailModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [newEmail, setNewEmail] = useState("");
    const [actualPassword, setActualPassword] = useState("");
    const [error, setError] = useState(null);

    const handleChangeEmail = async () => {
        try {
            await updateEmail(user, newEmail);
            onSuccess(newEmail);
            onClose();
            setActualPassword("");
            setError(null);
        } catch (error) {
            setError("An user already has this e-mail adress");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Email</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-black">
                <p>New Email:</p>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <p>Confirm changes with password</p>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" type="password" value={actualPassword} onChange={(e) => setActualPassword(e.target.value)} />
            </div>
            <div>
                <CustomButton onClick={handleChangeEmail} disabled={!actualPassword} className="customButton">
                    Change Email
                </CustomButton>
            </div>
        </Modal>
    );
};

export default ChangeEmailModal;
