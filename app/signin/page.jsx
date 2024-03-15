"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./page.css";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const res = await signInWithEmailAndPassword(email, password);
            setEmail("");
            setPassword("");
            if (res.user) {
                router.push("/");
            } else {
                setErrorMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            setErrorMessage("E-mail or password incorrect! Please try again or reset your pasword!");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            router.push("/");
        } catch (error) {
            setErrorMessage("Error signing in with Google");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" />
                <div className="input-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3  bg-gray-700 rounded outline-none text-white placeholder-gray-500 input-field" />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <div className="flex justify-between">
                    <button onClick={handleSignIn} disabled={!email || !password} className="disabled:opacity-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Sign In
                    </button>
                    <button onClick={() => router.push("/forgot-password")} className="opacity-40 bg-blue-500 hover:opacity-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Forgot Password?
                    </button>
                </div>
                <div style={{ paddingTop: "10px" }}>
                    <button onClick={handleGoogleSignIn} className="flex w-full justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                        <img src="/google.svg" alt="Google Logo" className="w-6 h-6 mr-2" />
                        Sign In with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
