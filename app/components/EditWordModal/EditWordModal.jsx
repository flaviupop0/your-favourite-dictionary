import React from "react";
import Modal from "../Modal/Modal.jsx";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config.js";

const EditWordModal = ({
  isOpen,
  onClose,
  dictionary,
  editWordIndex,
  editedWord,
  setEditedWord,
  id,
  updateDictionary,
}) => {
  const handleSaveEdit = async () => {
    try {
      const dictionaryRef = doc(db, "dictionaries", id);
      const updatedWords = [...dictionary.words];
      updatedWords[editWordIndex] = editedWord;
      await updateDoc(dictionaryRef, { words: updatedWords });
      const updatedDocSnap = await getDoc(dictionaryRef);
      if (updatedDocSnap.exists()) {
        const updatedDictionary = updatedDocSnap.data();
        updateDictionary(updatedDictionary);
      }
      onClose();
    } catch (error) {
      console.error("Error editing word:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-content bg-white p-6 rounded-lg shadow-md w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Edit Word</h2>
        </div>
        <div>
          <label className="block mb-2">Word Name</label>
          <input
            type="text"
            className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
            value={editedWord.name}
            onChange={e =>
              setEditedWord({ ...editedWord, name: e.target.value })
            }
          />
          <label className="block mb-2">Definition</label>
          <textarea
            className="border border-gray-300 rounded px-4 py-2 w-full h-32 mb-4"
            value={editedWord.definition}
            onChange={e =>
              setEditedWord({ ...editedWord, definition: e.target.value })
            }
          ></textarea>
          <div className="flex justify-end">
            <CustomButton
              onClick={handleSaveEdit}
              disabled={!editedWord.name || !editedWord.definition}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save
            </CustomButton>
            <CustomButton
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </CustomButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditWordModal;
