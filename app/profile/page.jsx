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
import ChangeEmailModal from "../components/ChangeEmailAdress/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePassword/ChangePassword";
import "./styles.css";

const ProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);
    const [isOpenPasswordModal, setIsOpenPasswordModal] = useState(false);
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
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
            setError("Failed to sign out");
        }
    };

    const handleEditProfile = () => {
        setIsOpenEditModal(true);
    };

    const handleEditEmail = () => {
        setIsOpenEmailModal(true);
    };

    const handleEditPassword = () => {
        setIsOpenPasswordModal(true);
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

    const handleDictionaryCreated = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavBar>
                <>
                    <MenuButton onClick={(event) => setAnchorEl(event.currentTarget)} />
                    <SlidingMenu userId={user.uid} onDictionaryCreated={handleDictionaryCreated} anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} firstHref="/" firstText="Your dictionaries" />
                </>
                <h1 className="text-center text-white text-2xl font-bold">Your profile page</h1>
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
                        {userProfile && userProfile.profileImage && <img src={userProfile.profileImage} alt="Profile" className="max-w-xs mx-auto" />}
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
                                <CustomButton onClick={handleEditProfile} className="customButton customButtonSmall mb-3 mr-3">
                                    Edit Personal Info
                                </CustomButton>
                                <CustomButton onClick={() => setIsOpenModal(true)} className="customButton mb-3 customButtonSmall mt-2">
                                    Change Profile Picture
                                </CustomButton>
                            </div>
                        )}
                        <div className="flex">
                            <CustomButton onClick={handleEditEmail} className="customButton customButtonSmall mr-3">
                                Change Email
                            </CustomButton>
                            <CustomButton onClick={handleEditPassword} className="customButton customButtonSmall">
                                Change Password
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePasswordModal isOpen={isOpenPasswordModal} onClose={() => setIsOpenPasswordModal(false)} user={user} />
            <ChangeProfilePictureModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} user={user} userProfile={userProfile} setUserProfile={setUserProfile} />
            <ChangeEmailModal isOpen={isOpenEmailModal} onClose={() => setIsOpenEmailModal(false)} user={user} />
            <EditPersonalInfoModal isOpen={isOpenEditModal} onClose={() => setIsOpenEditModal(false)} user={user} userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
        </div>
    );
};

export default ProfilePage;
