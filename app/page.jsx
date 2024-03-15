"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import "./home.css";

const Home = () => {
    const [user] = useAuthState(auth);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-white text-lg">{user ? `Welcome ${user.displayName}` : "Your Awesome Dictionary"}</h1>
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
