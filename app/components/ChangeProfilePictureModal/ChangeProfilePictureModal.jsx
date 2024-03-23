import React from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";

const ChangeProfilePictureModal = ({ isOpen, onClose, handleImageChange, handleUpload, image, uploading, previewURL }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Change Profile Picture</h2>
            <div className="mb-4">
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                <CustomButton onClick={() => document.querySelector('input[type="file"]').click()} className="customButton mr-2">
                    Choose Image
                </CustomButton>
                <CustomButton onClick={handleUpload} disabled={!image} className="customButton">
                    Upload Image
                </CustomButton>
                {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
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
