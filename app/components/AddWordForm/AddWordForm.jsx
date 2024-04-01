import React, { useState } from "react";
import { FaSearch, FaPlusCircle } from "react-icons/fa";

const AddWordForm = ({ onAddWord, onSearchWord }) => {
    const [word, setWord] = useState("");
    const [definition, setDefinition] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!word.trim()) {
            toggleErrorModal("errorModal");
            return;
        }
        onAddWord(word, definition);
        setWord("");
        setDefinition("");
    };

    const handleSearch = () => {
        onSearchWord(word);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4 flex">
                <input type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" placeholder="Enter Word" value={word} onChange={(e) => setWord(e.target.value)} />
            </div>
            <div className="mb-4 flex">
                <textarea placeholder="Enter the definition of the word" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" value={definition} onChange={(e) => setDefinition(e.target.value)} />
            </div>
            <div className="flex flex-row">
                <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded flex items-center" onClick={handleSearch}>
                    <FaSearch className="mr-2" /> Search for a word
                </button>
                <button type="submit" className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center">
                    <FaPlusCircle className="mr-2" /> Add this word to the list
                </button>
            </div>
        </form>
    );
};

export default AddWordForm;
