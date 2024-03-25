"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import MenuButton from "../components/MenuButton/MenuButton";
import SlidingMenu from "../components/SlidingMenu/SlidingMenu";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
import NavBar from "../components/NavBar/navbar.jsx";
import ChangeProfilePictureModal from "../components/ChangeProfilePictureModal/ChangeProfilePictureModal.jsx";
import EditPersonalInfoModal from "../components/EditPersonalInfoModal/EditPersonalInfoModal.jsx";
import "./styles.css";

const ProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserProfile(userData);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setError("Failed to fetch user profile");
                }
            } else {
                router.push("/signin");
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [router]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/signin");
        } catch (error) {
            console.error("Error signing out:", error);
            setError("Failed to sign out");
        }
    };

    const handleEditProfile = () => {
        setIsOpenEditModal(true);
    };

    const handleUpdateProfile = (updatedProfile) => {
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            ...updatedProfile,
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavBar>
                <>
                    <MenuButton onClick={(event) => setAnchorEl(event.currentTarget)} />
                    <SlidingMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} firstHref="/" firstText="Your dictionaries" />
                </>
                <h1 className="text-white text-lg ml-4">This is your profile page, {user ? userProfile.firstName : ""}</h1>
                <ul className="flex space-x-4">
                    <CustomButton onClick={handleLogout} className="signOutButton">
                        Sign out
                    </CustomButton>
                </ul>
            </NavBar>
            <div className="container mx-auto p-4 flex-grow">
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex">
                    <div className="p-4 flex-shrink-0">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Image</h2>
                        {userProfile && userProfile.profileImage && (
                            <>
                                <img src={userProfile.profileImage} alt="Profile" className="max-w-xs mx-auto" />
                            </>
                        )}
                    </div>
                    <div className="p-4 flex-grow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Information</h2>
                        {userProfile && user && (
                            <div>
                                <p className="text-lg text-gray-600">
                                    <strong>Name:</strong> {userProfile.firstName}
                                </p>
                                <p className="text-lg text-gray-600">
                                    <strong>Last Name:</strong> {userProfile.lastName}
                                </p>
                                <p className="text-lg text-gray-600">
                                    <strong>Username:</strong> {userProfile.username}
                                </p>
                                <p className="text-lg text-gray-600">
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <CustomButton onClick={() => setIsOpenModal(true)} className="customButton mb-3 customButtonSmall mt-2">
                                    Change profile picture
                                </CustomButton>
                                <CustomButton onClick={() => setIsOpenModal(true)} className="customButton customButtonSmall mb-3 ml-3">
                                    Change Password
                                </CustomButton>
                            </div>
                        )}
                        <CustomButton onClick={handleEditProfile} className="customButton customButtonSmall">
                            Edit Personal Informations
                        </CustomButton>
                        <CustomButton onClick={() => setIsOpenModal(true)} className="customButton customButtonSmall mb-3 ml-3">
                            Change E-mail
                        </CustomButton>
                    </div>
                </div>
            </div>
            <ChangeProfilePictureModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} user={user} userProfile={userProfile} setUserProfile={setUserProfile} />
            <EditPersonalInfoModal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} user={user} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
        </div>
    );
};

export default ProfilePage;
