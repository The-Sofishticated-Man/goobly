// components/LoginModal.tsx
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Adjust path if needed

interface LoginModalProps {
    onClose: () => void;
    onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onSwitchToSignup }: LoginModalProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError(""); 
            await signInWithEmailAndPassword(auth, email, password);
            alert("Logged in successfully!");
            onClose(); // Close the modal
        } catch (err: any) {
            setError("Invalid email or password."); 
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
                <p className="text-gray-600 mb-6">Please enter your details to log in.</p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full p-2 border rounded-md"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-2 border rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button 
                        onClick={handleLogin}
                        className="w-full py-2 bg-[var(--color-accent-3)] text-black font-semibold rounded-md hover:bg-[var(--color-accent-5)] transition-colors"
                    >
                        Log In
                    </button>
                    
                    <button 
                        onClick={onSwitchToSignup}
                        className="w-full py-2 bg-gray-200 text-black font-semibold rounded-md hover:bg-gray-300 transition-colors" 
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}