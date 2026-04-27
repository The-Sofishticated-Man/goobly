// components/SignOutModal.tsx
"use client";

import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface SignOutModalProps {
    onClose: () => void;
}

export default function SignOutModal({ onClose }: SignOutModalProps) {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            onClose();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-sm p-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-2xl text-center">
                <h2 className="text-2xl font-bold mb-4">Sign Out</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>

                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-200 text-black font-semibold rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSignOut}
                        className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}