import React, { useState, useEffect, useRef } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import Link from "next/link";
import { CiSettings } from "react-icons/ci";
import { IoTrashBinOutline } from "react-icons/io5";
import { db } from "../../firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

function DictionaryItem({ dictionary, onDelete }) {
    const [color, setColor] = useState("#f0f0f0");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
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

    const removeDictionary = async () => {
        setShowConfirmationModal(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteDoc(doc(db, "dictionaries", dictionary.id));
            onDelete(dictionary.id);
            setShowConfirmationModal(false);
        } catch (error) {
            console.error("Error deleting dictionary:", error);
        }
    };

    return (
        <div className="relative inline-block m-2">
            <div className="p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer block" style={{ width: "200px", height: "150px", verticalAlign: "top", backgroundImage: `linear-gradient(to top, #f0f0f0, ${color})` }}>
                <Link href={`/dictionaries/${dictionary.id}`} passHref>
                    <div className="no-underline" style={{ marginTop: "-10px" }}>
                        <h3 className="text-lg font-semibold mb-1 text-black" style={{ overflowWrap: "break-word", wordWrap: "break-word" }}>
                            {dictionary.name}
                        </h3>
                        <p className="text-m text-gray-600" style={{ overflowWrap: "break-word", wordWrap: "break-word" }}>
                            {dictionary.description}
                        </p>
                    </div>
                </Link>
            </div>
            <div className="absolute bottom-0 right-0 p-2">
                <IoTrashBinOutline className="text-black hover:text-red-600 cursor-pointer" size="25px" style={{ transition: "color 0.3s" }} onClick={removeDictionary} />
            </div>
            <div className="absolute bottom-0 right-6 p-2">
                <CiSettings className="text-black hover:text-gray-400 cursor-pointer" size="25px" style={{ transition: "color 0.3s" }} onClick={toggleColorPicker} />
            </div>
            {showColorPicker && (
                <div ref={colorPickerRef} className="absolute top-full right-0 z-20">
                    <HexAlphaColorPicker color={color} onChange={handleChangeColor} />
                </div>
            )}
            <ConfirmationModal isOpen={showConfirmationModal} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />
        </div>
    );
}
export default DictionaryItem;
