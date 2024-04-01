import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../app/firebase/config";
import { collection, doc, getDoc } from "firebase/firestore"; // Import necessary methods from firebase/firestore

function DictionaryPage() {
    const router = useRouter();
    const { id } = router.query;
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                const docRef = doc(db, "dictionaries", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDictionary(docSnap.data());
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

    if (!dictionary) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{dictionary.name}</h1>
            <p>{dictionary.description}</p>
        </div>
    );
}

export default DictionaryPage;
