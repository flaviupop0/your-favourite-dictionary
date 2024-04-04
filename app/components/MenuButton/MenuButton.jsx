import React from "react";
import { HiMenu } from "react-icons/hi";

const MenuButton = ({ onClick, className }) => (
    <button onClick={onClick} className={`customIcons ${className}`}>
        <HiMenu size="30px" />
    </button>
);

export default MenuButton;
