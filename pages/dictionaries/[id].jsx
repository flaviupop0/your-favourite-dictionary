import React, { useState, useEffect } from "react";
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
    const [ownerData, setOwnerData] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    const [userId, setUserId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dictionary, setDictionary] = useState(null);
    const [searchedIndex] = useState(-1);
    const [date, setDate] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editWordIndex, setEditWordIndex] = useState(null);
    const [editedWord, setEditedWord] = useState({ name: "", definition: "" });
    const isOpen = Boolean(anchorEl);

    useEffect(() => {
        const { userId } = router.query;
        if (userId) {
            setUserId(userId);
        }
    }, [router.query]);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                const docRef = doc(db, "dictionaries", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setDictionary(data);
                    const createdAtDate = data.createdAt.toDate();
                    const formattedCreatedAt = createdAtDate.toLocaleString();
                    setDate(formattedCreatedAt);
                    const ownerDocRef = doc(db, "users", data.ownerId);
                    const ownerDocSnap = await getDoc(ownerDocRef);
                    if (ownerDocSnap.exists()) {
                        const ownerData = ownerDocSnap.data();
                        setOwnerData(ownerData);
                    }
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
                setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }, 100);
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
                const regex = new RegExp(`\\b${searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
                wordElement.scrollIntoView({ behavior: "smooth", block: "center" });
                wordElement.innerHTML = wordElement.innerHTML.replace(regex, `<span class="highlight">$&</span>`);
                setTimeout(() => {
                    const highlightedWords = document.querySelectorAll(".highlight");
                    highlightedWords.forEach((highlightedWord) => {
                        highlightedWord.replaceWith(highlightedWord.textContent);
                    });
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

    const handleDictionaryCreated = () => {
        router.push("/");
    };

    if (!dictionary) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <Navbar>
                <>
                    <MenuButton onClick={handleClick} className="customIcons text-white" />
                    <SlidingMenu userId={userId} onDictionaryCreated={handleDictionaryCreated} anchorEl={anchorEl} open={isOpen} onClose={handleClose} firstHref="../" firstText="Home" secondHref="../profile" secondText="Profile" />
                </>
                <h1 className="text-center text-white text-2xl font-bold">{dictionary.name}</h1>
                <ul className="flex space-x-4">
                    <CustomButton onClick={handleLogout} className="signOutButton">
                        Sign out
                    </CustomButton>{" "}
                </ul>
            </Navbar>
            <div className="font-serif">
                {ownerData && (
                    <div className="flex items-center justify-center bg-gray-200 p-5 rounded-lg shadow-md">
                        {ownerData.profileImage && <img src={ownerData.profileImage} alt="Owner's Profile" className="w-20 h-20 rounded-full object-cover shadow-lg" />}
                        <div className="ml-4">
                            <h1 className="text-xl font-semibold text-gray-800">User: {ownerData.username}</h1>
                            <h1 className="text-xl font-semibold text-gray-800">Date of Creation: {date}</h1>
                        </div>
                    </div>
                )}
                <div className="container mx-auto p-5">
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Description</h2>
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <p className="text-lg leading-relaxed text-gray-800">{dictionary.description}</p>
                        </div>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add Word</h2>
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <AddWordForm onAddWord={handleAddWord} onSearchWord={handleSearchWord} />
                        </div>
                    </div>
                    {dictionary.words && (
                        <div>
                            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Words</h2>
                            <div className="bg-white rounded-lg shadow-md p-5 relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-white opacity-50 rounded-lg"></div>
                                <div className="z-10 relative">
                                    {dictionary.words.map((word, index) => (
                                        <div key={index} className={`border-b border-gray-200 p-4 ${index === searchedIndex ? "highlighted" : ""}`}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-xl word">{word.name}</p>
                                                    <p className="text-lg text-gray-700">{word.definition}</p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <button className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded flex items-center" onClick={() => handleEditWord(index, word)}>
                                                        <FaRegEdit size={20} className="mr-1" />
                                                        Edit
                                                    </button>
                                                    <button className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-2 rounded flex items-center" onClick={() => handleDeleteWord(index)}>
                                                        <FaDeleteLeft size={20} className="mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <EditWordModal isOpen={editModalVisible} onClose={() => setEditModalVisible(false)} dictionary={dictionary} editWordIndex={editWordIndex} editedWord={editedWord} setEditedWord={setEditedWord} id={id} updateDictionary={updateDictionary} />
            </div>
        </div>
    );
}

export default DictionaryPage;
