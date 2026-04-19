interface SignupModalProps {
    onClose: () => void;
}
import React from 'react';
import LoginModal from './LoginModal';
export default function SignupModal({ onClose }: SignupModalProps) {

    return (
        <>
        // 1. The Backdrop (Dark Overlay)
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                {/* 2. The Modal Container */}
                <div className="relative w-full  max-w-md p-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-2xl">

                    {/* Close Button (Top Right) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        ✕
                    </button>

                    {/* Modal Content */}
                    <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                    <p className="text-gray-600 mb-6">Please enter your details to sign up.</p>

                    {/* Placeholder for future form inputs */}
                    <div className="flex flex-col gap-4">
                        <input type="text" placeholder="Username" className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Email" className="w-full p-2 border rounded-md" />
                        <input type="password" placeholder="Password" className="w-full p-2 border rounded-md" />
                        <input type="password" placeholder="Confirm Password" className="w-full p-2 border rounded-md" />
                        <button className="w-full py-2 bg-[var(--color-accent-3)] text-black font-semibold rounded-md hover:bg-[var(--color-accent-5)] transition-colors ">
                            Sign Up
                        </button>
                    </div>

                </div>
            </div>

        </>
    );
}