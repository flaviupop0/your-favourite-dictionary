"use client";
import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";

const EditPersonalInfoModal = ({ isOpen, onClose, user, userProfile }) => {
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (user) {
            setNewUsername(userProfile.username || "");
            setNewEmail(user.email || "");
        }
    }, [user]);

    const handleSaveChanges = () => {
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Edit Personal Information</h2>
            <div className="text-black">
                <p>New Username:</p>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <p>New Email:</p>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                <p>New Password:</p>
                <input className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div>
                <CustomButton onClick={handleSaveChanges} className="customButton">
                    Save Changes
                </CustomButton>
            </div>
        </Modal>
    );
};

export default EditPersonalInfoModal;
