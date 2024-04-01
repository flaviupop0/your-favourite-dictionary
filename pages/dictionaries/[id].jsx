import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../app/firebase/config";

function DictionaryPage() {
    const router = useRouter();
    const { id } = router.query;
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        const fetchDictionary = async () => {
            try {
                console.log("proba");
                const docRef = await db.collection("dictionaries").doc(id).get();
                if (docRef.exists) {
                    setDictionary(docRef.data());
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
            {/* Render the dictionary data here */}
        </div>
    );
}

export default DictionaryPage;
