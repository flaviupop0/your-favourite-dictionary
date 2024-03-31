"use client";
import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { auth, db } from "../../firebase/config";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import FormInput from "../FormInput/FormInput.jsx";

const EditPersonalInfoModal = ({ isOpen, onClose, user, userProfile, onUpdateProfile }) => {
    const [newUsername, setNewUsername] = useState("");
    const [actualPassword, setActualPassword] = useState("");
    const [newName, setNewName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userProfile && user) {
            setNewUsername(userProfile.username || "");
            setNewName(user.displayName || "");
            setNewLastName(userProfile.lastName || "");
        }
    }, [userProfile, user]);

    const handleSaveChanges = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, user.email, actualPassword);
            if (userCredential) {
                const currentUser = userCredential.user;
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateProfile(currentUser, {
                    displayName: newName,
                });
                await updateDoc(userDocRef, {
                    lastName: newLastName,
                    username: newUsername,
                    firstName: newName,
                    displayName: newName,
                });
                onUpdateProfile({ username: newUsername, lastName: newLastName, firstName: newName });
                onClose();
                setActualPassword("");
                setError("");
            } else {
                setError("An error occurred while updating user information");
            }
        } catch (error) {
            if (error.code === "auth/invalid-credential") {
                setError("Incorrect password. Please try again.");
            } else {
                setError("An error occurred while updating user information");
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Edit Personal Information</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="text-black">
                <p>New Username:</p>
                <FormInput type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                <p>Change your name:</p>
                <FormInput type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <p>Change your last name:</p>
                <FormInput type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                <p>Confirm changes with password</p>
                <FormInput type="password" value={actualPassword} onChange={(e) => setActualPassword(e.target.value)} />
            </div>
            <div>
                <CustomButton onClick={handleSaveChanges} disabled={!actualPassword} className="customButton">
                    Save Changes
                </CustomButton>
            </div>
        </Modal>
    );
};

export default EditPersonalInfoModal;
