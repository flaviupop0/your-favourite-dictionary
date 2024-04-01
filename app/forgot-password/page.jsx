"use client";
import { useState } from "react";
import { auth } from "@/app/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import FormInput from "../components/FormInput/FormInput.jsx";
import CustomButton from "../components/CustomButton/CustomButton.jsx";
import "./page.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const resetEmail = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            setEmailSent(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
                <h1 className="text-white text-2xl mb-5">Forgot Password</h1>
                {emailSent ? (
                    <p className="text-white mb-4">A password reset link has been sent to the email you provided, if the account exists.</p>
                ) : (
                    <div className="input-container">
                        <div>
                            <FormInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <CustomButton onClick={resetEmail} disabled={!email} className="customButton">
                            Send Reset Password Email
                        </CustomButton>
                    </div>
                )}
            </div>
        </div>
    );
}
