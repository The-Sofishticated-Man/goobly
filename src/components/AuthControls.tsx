// components/AuthControls.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebaseConfig";
import LoginButton from './LoginButton';
import LoginModal from './LoginModal';
import SignupModal from './SingupModal';
import SignOutModal from './SignOutModal';

export default function AuthControls() {
    const [user, setUser] = useState<User | null>(null);
    const [activeModal, setActiveModal] = useState<'login' | 'signup' | 'signout' | null>(null);

    // Listen for Auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const closeModal = () => setActiveModal(null);

    return (
        <div className="flex items-center gap-4">
            {user ? (
                // If logged in, show Sign Out
                <LoginButton 
                    onClick={() => setActiveModal('signout')} 
                    disabled={false}
                    className="bg-red-100 hover:bg-red-200" // Custom style for signout
                >
                    Sign Out ({user.displayName || 'User'})
                </LoginButton>
            ) : (
                // If logged out, show Login
                <LoginButton 
                    onClick={() => setActiveModal('login')} 
                    disabled={false}
                >
                    Login
                </LoginButton>
            )}

            {/* Modal Rendering Logic */}
            {activeModal === 'login' && (
                <LoginModal 
                    onClose={closeModal} 
                    onSwitchToSignup={() => setActiveModal('signup')} 
                />
            )}
            
            {activeModal === 'signup' && (
                <SignupModal onClose={closeModal} />
            )}

            {activeModal === 'signout' && (
                <SignOutModal onClose={closeModal} />
            )}
        </div>
    );
}