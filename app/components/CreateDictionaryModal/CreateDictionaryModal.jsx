import React, { useEffect, useRef } from "react";
import CreateDictionaryForm from "../CreateDictionaryForm/CreateDictionaryForm";
import "../CreateDictionaryModal/styles.css";

const CreateDictionaryModal = ({ userId, onClose, onDictionaryCreated }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (!modalRef.current?.contains(event.target)) {
        onClose();
        console.log("probe");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="flex-grow max-w-screen-lg mx-auto mt-4 font-serif">
      <div className="modal-container max-w-full mx-auto font-serif">
        <div className="modal-content" ref={modalRef}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <h2 className="modal-title">Create Dictionary</h2>
          <CreateDictionaryForm
            userId={userId}
            onClose={onClose}
            onDictionaryCreated={onDictionaryCreated}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDictionaryModal;
