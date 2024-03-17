"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CustomButton from "./components/CustomButton/CustomButton.jsx";
import "./home.css";

const Home = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        {user && (
                            <button onClick={() => router.push("/profile")} className="bg-transparent hover:bg-gray-600 font-semibold py-1 px-1 border border-white rounded-full flex items-center">
                                <FaRegUserCircle size="30px" />
                            </button>
                        )}
                        <h1 className="text-white text-lg ml-4">{user ? `Welcome ${user.displayName}` : "Your Awesome Dictionary"}</h1>
                    </div>
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
                </div>
            </nav>
            <div className="flex-grow">{}</div>
        </div>
    );
};

export default Home;
