"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import FormInput from "../components/FormInput/FormInput.jsx";
import "./page.css";

const Register = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surName, setSurName] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleRegister = async () => {
        try {
            const res = await createUserWithEmailAndPassword(email, password);
            let userDocRef = doc(db, "users", res.user.uid);
            if (res && res.user) {
                await updateProfile(getAuth().currentUser, {
                    displayName: `${name}`,
                });
                await setDoc(userDocRef, {
                    userId: res.user.uid,
                    email: email,
                    username: username,
                    firstName: name,
                    lastName: surName,
                });
                router.push("/signin");
            } else {
                setErrorMessage("The Email you entered is invalid or this account already exists.");
            }
            setEmail("");
            setPassword("");
            setName("");
            setSurName("");
            setUsername("");
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
                <FormInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.targe.value)} />
                <FormInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.targe.value)} />
                <FormInput type="text" placeholder="Last Name" value={surName} onChange={(e) => setSurName(e.targe.value)} />
                <FormInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.targe.value)} />
                <FormInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.targe.value)} />
                <div className="input-container">
                    <FormInput type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.targe.value)} />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <div className="flex justify-between">
                    <button onClick={handleRegister} disabled={!username || !name || !surName || !email || !password} className="disabled:opacity-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
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
