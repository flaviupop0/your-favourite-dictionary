import React from "react";
import CreateDictionaryForm from "../CreateDictionaryForm/CreateDictionaryForm";

const CreateDictionaryModal = ({ userId, onClose }) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <div className="bg-white p-6">
                        <button className="absolute top-0 right-0 m-4 text-gray-600" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <CreateDictionaryForm userId={userId} onClose={onClose} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDictionaryModal;
