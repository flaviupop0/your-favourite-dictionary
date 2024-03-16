"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { FaRegUserCircle } from "react-icons/fa";
import Link from "next/link";
import "./home.css";

const Home = () => {
    const [user] = useAuthState(auth);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        {user && (
                            <Link href="/profile">
                                <button className="bg-transparent hover:bg-gray-600 font-semibold py-1 px-1 border border-white rounded-full flex items-center">
                                    <FaRegUserCircle size="30px" />
                                </button>
                            </Link>
                        )}
                        <h1 className="text-white text-lg ml-4">{user ? `Welcome ${user.displayName}` : "Your Awesome Dictionary"}</h1>
                    </div>
                    <ul className="flex space-x-4">
                        {user ? (
                            <li>
                                <button onClick={() => auth.signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link href="/signup">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Register</button>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/signin">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Login</button>
                                    </Link>
                                </li>
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
