import React, { useState, useEffect, useRef } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import Link from "next/link";
import { FaEllipsisV } from "react-icons/fa";
import { db } from "../../firebase/config";
import { doc, updateDoc } from "firebase/firestore";

function DictionaryItem({ dictionary }) {
    const [color, setColor] = useState("#f0f0f0");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef(null);

    useEffect(() => {
        if (dictionary.color) {
            setColor(dictionary.color);
        }
    }, [dictionary.color]);

    const handleChangeColor = (newColor) => {
        setColor(newColor);
        updateColor(newColor);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const updateColor = async (color) => {
        try {
            await updateDoc(doc(db, "dictionaries", dictionary.id), {
                color: color,
            });
        } catch (error) {
            console.error("Error updating color:", error);
        }
    };

    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    return (
        <div className="relative inline-block m-2">
            <div className="p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer block" style={{ width: "200px", height: "150px", verticalAlign: "top", backgroundImage: `linear-gradient(to top, #f0f0f0, ${color})` }}>
                <Link href={`/dictionaries/${dictionary.id}`} passHref>
                    <div className="no-underline">
                        <h3 className="text-lg font-semibold mb-2 text-black">{dictionary.name}</h3>
                        <p className="text-gray-600">{dictionary.description}</p>
                    </div>
                </Link>
            </div>
            <div className="absolute top-0 right-0 p-2">
                <FaEllipsisV className="text-gray-400 hover:text-gray-600 cursor-pointer" onClick={toggleColorPicker} />
            </div>
            {showColorPicker && (
                <div ref={colorPickerRef} className="absolute top-full right-0">
                    <HexAlphaColorPicker color={color} onChange={handleChangeColor} />
                </div>
            )}
        </div>
    );
}

export default DictionaryItem;
