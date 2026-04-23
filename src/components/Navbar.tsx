// components/Navbar.tsx
"use client"; 
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // For navigation
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import LoginButton from "./LoginButton";
import LoginModal from "./LoginModal";
import SignupModal from "./SingupModal"; 

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 1. Fetch all lessons from Firebase once when the Navbar loads
  useEffect(() => {
    const fetchLessons = async () => {
      const querySnapshot = await getDocs(collection(db, "lessons"));
      const lessonsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLessons(lessonsData);
    };
    fetchLessons();
  }, []);

  // 2. Handle the searching logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      setShowResults(false);
      return;
    }

    const results = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    setFilteredResults(results);
    setShowResults(true);
  }, [searchQuery, lessons]);

  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleCloseLogin = () => setIsLoginOpen(false);
  const handleCloseSignup = () => setIsSignupOpen(false);

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  return (
    <>
      <nav className="glass sticky top-0 z-50 w-full flex flex-col sm:flex-row items-center sm:justify-between py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 gap-3 sm:gap-4 md:gap-6">
        <Image src="/GooblyHeader.png" alt="Logo" width={100} height={200} className="h-8 sm:h-12 md:h-14 w-auto shrink-0" />

        {/* Updated Search Bar Container */}
        <div className="relative w-full sm:flex-1 max-w-2xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full h-10 sm:h-12 px-4 sm:px-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-full shadow-[inset_0_1px_1px_rgba(var(--color-text-rgb),0.1)] ring-1 ring-black/50">
            <input 
              type="text"
              placeholder="Search Course/Simulation..."
              className="bg-transparent border-none outline-none w-full text-xs sm:text-sm font-mono tracking-wide text-(--color-text-rgb)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
            />
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-(--color-text-soft) shrink-0 ml-2" />
          </div>

          {/* Search Results Dropdown */}
          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-xl overflow-hidden z-[60]">
              {filteredResults.map((lesson) => (
                <Link 
                  key={lesson.id} 
                  href={lesson.path}
                  className="block p-4 hover:bg-white/5 transition-colors"
                  onClick={() => {
                    setShowResults(false);
                    setSearchQuery("");
                  }}
                >
                  <p className="font-bold text-sm text-[var(--color-accent-3)]">{lesson.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{lesson.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 w-full sm:w-auto flex justify-end">
          <LoginButton onClick={handleOpenLogin} disabled={false}>
            Login
          </LoginButton>
        </div>
      </nav>

      {/* Modals */}
      {isLoginOpen && <LoginModal onClose={handleCloseLogin} onSwitchToSignup={handleSwitchToSignup} />}
      {isSignupOpen && <SignupModal onClose={handleCloseSignup} />}
    </>
  );
}