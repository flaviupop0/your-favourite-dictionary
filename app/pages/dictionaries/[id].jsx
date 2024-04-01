import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/app/firebase/config";

const DynamicPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (id) => {
        try {
            const docRef = db.collection("yourCollection").doc(id);
            const docSnapshot = await docRef.get();
            if (docSnapshot.exists()) {
                setData(docSnapshot.data());
            } else {
                console.log("Document not found");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    };

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dynamic Page</h1>
            <p>ID: {id}</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DynamicPage;
