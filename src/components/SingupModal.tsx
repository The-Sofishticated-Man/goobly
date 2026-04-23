// components/SignupModal.tsx
"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; // Firestore tools
import { auth, db } from "../firebaseConfig"; // Import db here!

interface SignupModalProps {
    onClose: () => void;
}

export default function SignupModal({ onClose }: SignupModalProps) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added a loading state

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true); // Start loading
        try {
            setError("");
            
            // 1. Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Add their Username to their Auth Profile
            await updateProfile(user, { displayName: username });

            // 3. Create the User Document in Firestore
            // We use doc(db, "collectionName", documentID)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: username,
                email: email,
                createdAt: serverTimestamp(), // Uses Firebase's server clock for accuracy
            });

            alert("Account created and saved to database!");
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">✕</button>

                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Username" className="w-full p-2 border rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded-md" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    
                    <button 
                        onClick={handleSignup}
                        disabled={loading} // Disable button while loading
                        className={`w-full py-2 bg-[var(--color-accent-3)] text-black font-semibold rounded-md transition-colors ${loading ? 'opacity-50' : 'hover:bg-[var(--color-accent-5)]'}`}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}