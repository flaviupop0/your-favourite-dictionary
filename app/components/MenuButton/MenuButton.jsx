import React from "react";
import { HiMenu } from "react-icons/hi";

const MenuButton = ({ onClick }) => (
    <button onClick={onClick} className="customIcons">
        <HiMenu size="30px" />
    </button>
);

export default MenuButton;
