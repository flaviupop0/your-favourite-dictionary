import React from "react";
import Link from "next/link";

const DictionaryItem = ({ dictionary }) => {
    const handleClick = () => {
        console.log(`Clicked on dictionary: ${dictionary.name}`);
    };

    return (
        <div className="inline-block m-2">
            <Link href={`../../../pages/dictionaries/${dictionary.id}`}>
                <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-yellow-100 cursor-pointer block" style={{ width: "200px", height: "150px", verticalAlign: "top" }} onClick={handleClick}>
                    <h3 className="text-lg font-semibold mb-2 text-black">{dictionary.name}</h3>
                    <p className="text-gray-600">{dictionary.description}</p>
                </div>
            </Link>
        </div>
    );
};

export default DictionaryItem;
