"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { getAuth, updateProfile } from "firebase/auth";
import "./page.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleRegister = async () => {
        try {
            const res = await createUserWithEmailAndPassword(email, password);
            setEmail("");
            setPassword("");
            setName("");
            setSurName("");
            if (res && res.user) {
                router.push("/signin");
                await updateProfile(getAuth().currentUser, {
                    displayName: `${name} ${surName}`,
                });
            } else {
                setErrorMessage("The Email you entered is invalid or this account already exists.");
            }
        } catch (e) {
            setErrorMessage("The Email you entered is invalid or this account already exists.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" />
                <input type="email" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" />
                <input type="email" placeholder="Last Name" value={surName} onChange={(e) => setSurName(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" />
                <div className="input-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3  bg-gray-700 rounded outline-none text-white placeholder-gray-500 input-field" />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <div className="flex justify-between">
                    <button onClick={handleRegister} disabled={!name || !surName || !email || !password} className="disabled:opacity-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Register
                    </button>
                    <button onClick={() => router.push("/signin")} className="opacity-40 bg-blue-500 hover:opacity-100 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Login here!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
