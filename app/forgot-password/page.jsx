"use client";
import { useState } from "react";
import { auth } from "@/app/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
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
            //still in work
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
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500" />
                        </div>
                        <button onClick={resetEmail} disabled={!email} className="disabled:opacity-40 bg-blue-500 hover:bg-blue-700 rounded-full px-3 py-1.5 text-white font-bold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                            Send Reset Password Email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
