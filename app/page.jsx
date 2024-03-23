"use client";
import { React, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { HiLibrary } from "react-icons/hi";
import CustomButton from "./components/CustomButton/CustomButton.jsx";
import NavBar from "./components/NavBar/navbar.jsx";
import SlidingMenu from "./components/SlidingMenu/SlidingMenu.jsx";
import MenuButton from "./components/MenuButton/MenuButton.jsx";
import "./home.css";

const Home = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <NavBar user={user} router={router}>
                {!user && <HiLibrary size="40px" className="customIcons" />}
                {user && (
                    <>
                        <MenuButton onClick={handleClick} />
                        <SlidingMenu anchorEl={anchorEl} open={isOpen} onClose={handleClose} firstHref="./profile" firstText="Profile" />
                    </>
                )}
                <h1 className="text-white text-lg ml-4">{user ? `Welcome ${user.displayName}` : "Your Awesome Dictionary"}</h1>
                <ul className="flex space-x-4">
                    {user ? (
                        <CustomButton onClick={() => auth.signOut()} className="signOutButton">
                            Sign out
                        </CustomButton>
                    ) : (
                        <>
                            <CustomButton onClick={() => router.push("/signup")} className="customButton">
                                Register
                            </CustomButton>
                            <CustomButton onClick={() => router.push("/signin")} className="customButton">
                                Login
                            </CustomButton>
                        </>
                    )}
                </ul>
            </NavBar>
            <div className="flex-grow">{/* Other content */}</div>
        </div>
    );
};

export default Home;
