"use client";
import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { getAuth, updateProfile, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import FormInput from "../components/FormInput/FormInput.jsx";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
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
            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                setErrorMessage("This username is already taken. Please choose a different one.");
                return;
            }
            const res = await createUserWithEmailAndPassword(email, password);
            if (res && res.user) {
                await sendEmailVerification(res.user);
                await updateProfile(getAuth().currentUser, {
                    displayName: `${name}`,
                });
                let userDocRef = doc(db, "users", res.user.uid);
                await setDoc(userDocRef, {
                    userId: res.user.uid,
                    email: email,
                    username: username,
                    firstName: name,
                    lastName: surName,
                    profileImage: null,
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
            console.error(e);
        }
    };

    const checkUsernameExists = async (username) => {
        try {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error("Error checking username:", error);
            return true;
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Sign Up</h1>
                <FormInput type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <FormInput type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <FormInput type="text" placeholder="Last Name" value={surName} onChange={(e) => setSurName(e.target.value)} />
                <FormInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="input-container">
                    <FormInput type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <span className="toggle-password" onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <div className="flex justify-between">
                    <CustomButton onClick={handleRegister} disabled={!username || !name || !surName || !email || !password} className="customButton">
                        {" "}
                        Register
                    </CustomButton>
                    <CustomButton onClick={() => router.push("/signin")} className="customButton">
                        Login here
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default Register;
