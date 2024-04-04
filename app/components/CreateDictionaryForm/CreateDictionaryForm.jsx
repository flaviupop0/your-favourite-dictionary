import React, { useState } from "react";
import { db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const CreateDictionaryForm = ({ userId, onClose }) => {
    const [dictionaryName, setDictionaryName] = useState("");
    const [dictionaryDescription, setDictionaryDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateDictionary = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dictionariesCollection = collection(db, "dictionaries");
            const dictionaryData = {
                name: dictionaryName,
                description: dictionaryDescription,
                ownerId: userId,
                createdAt: new Date(),
                color: "#e4de00",
            };
            await addDoc(dictionariesCollection, dictionaryData);
            setDictionaryName("");
            setDictionaryDescription("");
            setIsLoading(false);
            setError(null);
            onClose();
        } catch (error) {
            console.error(error);
            setError("Error creating dictionary. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreateDictionary} className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="mb-4">
                <label htmlFor="dictionaryName" className="block text-gray-700 font-bold">
                    Dictionary Name:
                </label>
                <input type="text" id="dictionaryName" value={dictionaryName} onChange={(e) => setDictionaryName(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 text-black" />
            </div>
            <div className="mb-4">
                <label htmlFor="dictionaryDescription" className="block text-gray-700 font-bold">
                    Description:
                </label>
                <textarea id="dictionaryDescription" value={dictionaryDescription} onChange={(e) => setDictionaryDescription(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-black" />
            </div>
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                {isLoading ? "Creating..." : "Confirm"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
    );
};

export default CreateDictionaryForm;
