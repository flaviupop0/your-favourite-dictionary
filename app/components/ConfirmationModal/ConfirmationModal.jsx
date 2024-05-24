import React from "react";
import "./styles.css";

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`modal-container fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? "" : "hidden"}`}
      onClick={onCancel}
    >
      <div className="bg-white p-4 rounded-lg shadow-md text-black">
        <p>Are you sure you want to delete this dictionary?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
