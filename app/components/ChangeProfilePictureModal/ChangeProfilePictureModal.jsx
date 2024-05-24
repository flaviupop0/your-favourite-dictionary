import React, { useState } from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { uploadBytes } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, storage, ref, getDownloadURL } from "../../firebase/config";

const ChangeProfilePictureModal = ({
  isOpen,
  onClose,
  user,
  userProfile,
  setUserProfile,
}) => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const handleImageChange = event => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const storageRef = ref(
        storage,
        `profileImages/${user.uid}/${image.name}`,
      );
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...userProfile, profileImage: imageUrl },
        { merge: true },
      );
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserProfile(userData);
      }
      onClose();
      setUploading(false);
      setImage(null);
      setPreviewURL(null);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Change Profile Picture
      </h2>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <CustomButton
          onClick={() => document.querySelector('input[type="file"]').click()}
          className="customButton mr-2"
        >
          Choose Image
        </CustomButton>
        <CustomButton
          onClick={handleUpload}
          disabled={!image}
          className="customButton"
        >
          Upload Image
        </CustomButton>
        {uploading && (
          <span className="text-sm text-gray-600">Uploading...</span>
        )}
      </div>
      {previewURL && (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview</h3>
          <img src={previewURL} alt="Preview" className="max-w-xs mx-auto" />
        </>
      )}
    </Modal>
  );
};

export default ChangeProfilePictureModal;
