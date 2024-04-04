import React from "react";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Navbar = ({ user, router, children }) => {
    const routers = useRouter();

    const handleHomeClick = () => {
        routers.push("../");
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex justify-between items-center bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <button onClick={handleHomeClick} className="customIcons">
                            <FaHome size="30px" />
                        </button>
                        {children.slice(0, -2)}
                    </div>
                    <div className="flex-grow text-center">{children[children.length - 2]}</div>
                    <div>{children.slice(-1)}</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
