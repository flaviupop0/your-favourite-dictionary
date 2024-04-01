import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { db } from "../../app/firebase/config";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import AddWordForm from "../../app/components/AddWordForm/AddWordForm.jsx";
import Navbar from "../../app/components/NavBar/navbar.jsx";
import "tailwindcss/tailwind.css";

function DictionaryPage() {
    const router = useRouter();
    const { id } = router.query;
    const [dictionary, setDictionary] = useState(null);
    const [searchedWord, setSearchedWord] = useState("");
    const [searchedIndex, setSearchedIndex] = useState(-1);
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

    if (!dictionary) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto p-5">
                <h1 className="text-center text-3xl font-bold mb-6">{dictionary.name}</h1>
                <p className="mb-4">{dictionary.description}</p>
                <h2 className="text-xl font-semibold mb-4">Add Word</h2>
                <AddWordForm onAddWord={handleAddWord} onSearchWord={handleSearchWord} />
                {dictionary.words && (
                    <div className="mt-6" ref={contentRef}>
                        <h2 className="text-xl font-semibold mb-4">Words</h2>
                        <div className="bg-white rounded-lg shadow-md">
                            {dictionary.words.map((word, index) => (
                                <div key={index} className={`border-b border-gray-200 p-4 ${index === searchedIndex ? "highlighted" : ""}`}>
                                    <p className="font-semibold word">{word.name}</p>
                                    <p className="text-gray-600">{word.definition}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DictionaryPage;
