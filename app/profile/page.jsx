"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import MenuButton from "../components/MenuButton/MenuButton";
import SlidingMenu from "../components/SlidingMenu/SlidingMenu";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
import NavBar from "../components/NavBar/navbar.jsx";
import "./styles.css";

const ProfilePage = () => {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const user = auth.currentUser;
    const isOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserProfile(userData);
                    }
                } catch (error) {}
            } else {
                router.push("/signin");
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <NavBar>
                <>
                    <MenuButton onClick={() => auth.signOut()} />
                    <SlidingMenu anchorEl={anchorEl} open={isOpen} onClose={handleClose} firstHref="/" firstText="Home" />
                </>
                <h1 className="text-white text-lg ml-4">This is your profile page, {user.displayName}</h1>
                <ul className="flex space-x-4">
                    <CustomButton onClick={handleLogout} className="signOutButton">
                        Sign out
                    </CustomButton>
                </ul>
            </NavBar>
            <div className="content" style={{ border: "1px solid red", padding: "10px", color: "black" }}>
                <h2 className="subtitle">Account Information</h2>
                <p>
                    <strong>Name:</strong> {user.displayName}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Username:</strong> {userProfile.username}
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
