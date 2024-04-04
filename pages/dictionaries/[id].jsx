import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../app/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import AddWordForm from "../../app/components/AddWordForm/AddWordForm.jsx";
import Navbar from "../../app/components/NavBar/navbar.jsx";
import MenuButton from "@/app/components/MenuButton/MenuButton";
import EditWordModal from "@/app/components/EditWordModal/EditWordModal";
import SlidingMenu from "@/app/components/SlidingMenu/SlidingMenu";
import CustomButton from "@/app/components/CustomButton/CustomButton.jsx";
import "tailwindcss/tailwind.css";
import "../../app/globals.css";

function DictionaryPage() {
    const router = useRouter();
    const { id } = router.query;
    const [anchorEl, setAnchorEl] = useState(null);
    const [dictionary, setDictionary] = useState(null);
    const [searchedIndex, setSearchedIndex] = useState(-1);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editWordIndex, setEditWordIndex] = useState(null);
    const [editedWord, setEditedWord] = useState({ name: "", definition: "" });
    const isOpen = Boolean(anchorEl);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                const docRef = doc(db, "dictionaries", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDictionary(data);
                } else {
                    console.log("No such dictionary found!");
                }
            } catch (error) {
                console.error("Error fetching dictionary:", error);
            }
        };
        if (id) {
            fetchDictionary();
        }
    }, [id]);

    const handleAddWord = async (word, definition) => {
        try {
            const dictionaryRef = doc(db, "dictionaries", id);
            await updateDoc(dictionaryRef, {
                words: arrayUnion({ name: word, definition: definition }),
            });
            const updatedDocSnap = await getDoc(dictionaryRef);
            if (updatedDocSnap.exists()) {
                setDictionary(updatedDocSnap.data());
            }
        } catch (error) {
            console.error("Error adding word:", error);
        }
    };

    const handleSearchWord = (searchValue) => {
        const wordElements = document.querySelectorAll(".word");
        wordElements.forEach((wordElement) => {
            const word = wordElement.textContent.toLowerCase();
            if (word === searchValue.toLowerCase()) {
                wordElement.scrollIntoView({ behavior: "smooth", block: "center" });
                wordElement.classList.add("bg-yellow-200", "transition", "duration-1000");
                setTimeout(() => {
                    wordElement.classList.remove("bg-yellow-200");
                    setTimeout(() => {
                        wordElement.classList.remove("transition", "duration-1000");
                    }, 1000);
                }, 2000);
            }
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditWord = (index, word) => {
        setEditWordIndex(index);
        setEditedWord({ ...word });
        setEditModalVisible(true);
    };

    const handleDeleteWord = async (index) => {
        try {
            const dictionaryRef = doc(db, "dictionaries", id);
            const updatedWords = [...dictionary.words];
            updatedWords.splice(index, 1);
            await updateDoc(dictionaryRef, { words: updatedWords });
            const updatedDocSnap = await getDoc(dictionaryRef);
            if (updatedDocSnap.exists()) {
                setDictionary(updatedDocSnap.data());
            }
        } catch (error) {
            console.error("Error deleting word:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("../");
        } catch (error) {
            console.error("Error signing out:", error);
            setError("Failed to sign out");
        }
    };

    const updateDictionary = async (newDictionary) => {
        setDictionary(newDictionary);
    };

    if (!dictionary) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Navbar>
                <>
                    <MenuButton onClick={handleClick} className="customIcons text-white" />
                    <SlidingMenu anchorEl={anchorEl} open={isOpen} onClose={handleClose} firstHref="../" firstText="Home" secondHref="../profile" secondText="Profile" />
                </>
                <h1 className="text-center text-white text-2xl font-bold">{dictionary.name}</h1>
                <ul className="flex space-x-4">
                    {" "}
                    <CustomButton onClick={handleLogout} className="signOutButton">
                        Sign out
                    </CustomButton>{" "}
                </ul>
            </Navbar>
            <div className="container mx-auto p-5">
                <p className="mb-4 text-xl">{dictionary.description}</p>
                <h2 className="text-2xl font-semibold mb-4">Add Word</h2>
                <AddWordForm onAddWord={handleAddWord} onSearchWord={handleSearchWord} />
                {dictionary.words && (
                    <div className="mt-6" ref={contentRef}>
                        <h2 className="text-xl font-semibold mb-4">Words</h2>
                        <div className="bg-white rounded-lg shadow-md">
                            {dictionary.words.map((word, index) => (
                                <div key={index} className={`border-b border-gray-200 p-4 ${index === searchedIndex ? "highlighted" : ""}`} style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <p className="font-semibold word">{word.name}</p>
                                        <p className="text-gray-600">{word.definition}</p>
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded flex items-center" onClick={() => handleEditWord(index, word)}>
                                                <FaRegEdit size={20} className="mr-2" />
                                                Edit
                                            </button>
                                            <button className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded flex items-center" onClick={() => handleDeleteWord(index)}>
                                                <FaDeleteLeft size={20} className="mr-2" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <EditWordModal isOpen={editModalVisible} onClose={() => setEditModalVisible(false)} dictionary={dictionary} editWordIndex={editWordIndex} editedWord={editedWord} setEditedWord={setEditedWord} id={id} updateDictionary={updateDictionary} />
        </div>
    );
}

export default DictionaryPage;
