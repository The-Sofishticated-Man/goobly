// components/Navbar.jsx
"use client"; 
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import LoginButton from "./LoginButton";
import LoginModal from "./LoginModal";
import SignupModal from "./SingupModal"; 

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleCloseLogin = () => setIsLoginOpen(false);
  const handleCloseSignup = () => setIsSignupOpen(false);

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false); // Close Login
    setIsSignupOpen(true); // Open Signup
  };

  return (
    <>
      <nav className="glass sticky top-0 z-50 w-full flex flex-col sm:flex-row items-center sm:justify-between py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 gap-3 sm:gap-4 md:gap-6">
        <Image src="/GooblyHeader.png" alt="Logo" width={100} height={200} className="h-8 sm:h-12 md:h-14 w-auto shrink-0" />

        <div className="relative w-full sm:flex-1 max-w-2xl flex justify-center bg-[rgb(var(--color-background-rgb))] rounded-full">
          <div className="flex items-center justify-between w-full h-10 sm:h-12 px-4 sm:px-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-full shadow-[inset_0_1px_1px_rgba(var(--color-text-rgb),0.1)] ring-1 ring-black/50">
            <span className="text-(--color-text-muted) font-mono text-xs sm:text-sm tracking-wide truncate">
              Search Course/Simulation
            </span>
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-(--color-text-soft) shrink-0 ml-2" />
          </div>
        </div>

        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          <LoginButton onClick={handleOpenLogin} disabled={false}>
            Login
          </LoginButton>
        </div>
      </nav>

      {/* Render Login Modal */}
      {isLoginOpen && (
        <LoginModal 
          onClose={handleCloseLogin} 
          onSwitchToSignup={handleSwitchToSignup} 
        />
      )}

      {/* Render Signup Modal */}
      {isSignupOpen && (
        <SignupModal onClose={handleCloseSignup} />
      )}
    </>
  );
}