"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase/config";
import { FaHome } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import CustomButton from "../components/CustomButton/CustomButton.jsx";

const ProfilePage = () => {
    const router = useRouter();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserProfile(userData);
                    console.log(auth.currentUser.uid);
                } else {
                    console.error("User document not found");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            router.push("/signin");
        }
    }, [user, router]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/signin");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        {user && (
                            <button onClick={() => router.push("/")} className="bg-transparent hover:bg-gray-600 font-semibold py-1 px-1 border border-white rounded-full flex items-center">
                                <FaHome size="30px" />
                            </button>
                        )}
                        <h1 className="text-white text-lg ml-4">This is your profile page, {user.displayName}</h1>
                    </div>
                    <ul className="flex space-x-4">
                        <CustomButton onClick={handleLogout} className="signOutButton">
                            Sign out
                        </CustomButton>
                    </ul>
                </div>
            </nav>
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
