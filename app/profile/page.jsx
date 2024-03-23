"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, storage, uploadBytes } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import MenuButton from "../components/MenuButton/MenuButton";
import SlidingMenu from "../components/SlidingMenu/SlidingMenu";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
import NavBar from "../components/NavBar/navbar.jsx";
import ChangeProfilePictureModal from "../components/ChangeProfilePictureModal/ChangeProfilePictureModal.jsx";
import "./styles.css";

const ProfilePage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewURL, setPreviewURL] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const user = auth.currentUser;

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
                } catch {}
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
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewURL(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewURL(null);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            return;
        }

        setUploading(true);
        try {
            const storageRef = ref(storage, `profileImages/${user.uid}/${image.name}`);
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { ...userProfile, profileImage: imageUrl }, { merge: true });
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                setUserProfile(userData);
            }
        } catch (error) {}
        setUploading(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavBar>
                <>
                    <MenuButton onClick={() => setIsOpenMenu(!isOpenMenu)} />
                    <SlidingMenu anchorEl={isOpenMenu} open={isOpenMenu} onClose={() => setIsOpenMenu(false)} firstHref="/" firstText="Home" />
                </>
                <h1 className="text-white text-lg ml-4">This is your profile page, {user ? user.displayName : ""}</h1>
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
                                <div className="mt-4">
                                    <CustomButton onClick={() => setIsOpenModal(true)} className="customButton">
                                        Change profile picture
                                    </CustomButton>
                                </div>
                            </>
                        )}
                        <ChangeProfilePictureModal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)} handleImageChange={handleImageChange} handleUpload={handleUpload} image={image} uploading={uploading} previewURL={previewURL} />
                    </div>
                    <div className="p-4 flex-grow">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Information</h2>
                        {userProfile && user && (
                            <div>
                                <p className="text-sm text-gray-600">
                                    <strong>Name:</strong> {user.displayName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Last Name:</strong> {userProfile.lastName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Username:</strong> {userProfile.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Email:</strong> {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
