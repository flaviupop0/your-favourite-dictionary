"use client";
import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import FormInput from "../components/FormInput/FormInput.jsx";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
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

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSignIn();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign In</h1>
                <FormInput onKeyPress={handleKeyPress} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="input-container">
                    <FormInput onKeyPress={handleKeyPress} type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <div className="flex justify-between">
                    <CustomButton onClick={handleSignIn} disabled={!email || !password} className="customButton">
                        Sign in
                    </CustomButton>
                    <CustomButton onClick={() => router.push("/forgot-password")} className="customButton">
                        Forgot password?
                    </CustomButton>
                </div>
                <div style={{ paddingTop: "10px" }}>
                    <CustomButton onClick={handleGoogleSignIn} className="googleButton">
                        <img src="/google.svg" alt="Google Logo" className="w-6 h-6 mr-2" />
                        Sign In with Google
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
