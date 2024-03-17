import React from "react";

const Navbar = ({ user, router, children }) => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {React.Children.map(children, (child) => {
                    if (child) {
                        return React.cloneElement(child, { user, router });
                    }
                    return null;
                })}
            </div>
        </nav>
    );
};

export default Navbar;
