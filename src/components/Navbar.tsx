"use client"; 

import { useState, useEffect } from "react";
import { Search, LogOut, User as UserIcon } from "lucide-react"; // Added icons
import Image from "next/image";
import Link from "next/link"; 
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth"; // Auth imports
import { db, auth } from "../firebaseConfig";
import LoginButton from "./LoginButton";
import LoginModal from "./LoginModal";
import SignupModal from "./SingupModal"; 
import SignOutModal from "./SignOutModal"; // Import your new modal

export default function Navbar() {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const closeSidebar = () => setIsSidebarOpen(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 1. Listen for Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch lessons for search
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

  // 3. Search Logic
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

  // Modal Handlers
  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  return (
    <>
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="glass sticky top-0 z-50 w-full flex flex-col sm:flex-row items-center sm:justify-between py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 gap-3 sm:gap-4 md:gap-6">
        
        {/* Left Side: Hamburger Menu + Logo */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto w-full sm:w-auto">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-(--color-text-soft) hover:text-(--color-text) transition-colors rounded-md hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          
          <Link href="/">
            <Image src="/GooblyHeader.png" alt="Logo" width={100} height={200} className="h-8 sm:h-12 md:h-14 w-auto" />
          </Link>
        </div>

        {/* Middle: Search Bar */}
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

          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-xl shadow-xl overflow-hidden z-[60]">
              {filteredResults.map((lesson) => (
                <Link 
                  key={lesson.id} 
                  href={lesson.path}
                  className="block p-4 hover:bg-white/5 transition-colors"
                  onClick={() => { setShowResults(false); setSearchQuery(""); }}
                >
                  <p className="font-bold text-sm text-[var(--color-accent-3)]">{lesson.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{lesson.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Auth Button (Desktop) */}
        <div className="shrink-0 hidden sm:flex justify-end min-w-[120px]">
          {user ? (
            <LoginButton 
              onClick={() => setIsSignOutOpen(true)} 
              disabled={false} 
              className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
            </LoginButton>
          ) : (
            <LoginButton onClick={() => setIsLoginOpen(true)} disabled={false}>
              Login
            </LoginButton>
          )}
        </div>
      </nav>

      {/* --- SIDEBAR --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" onClick={closeSidebar} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-[rgb(var(--color-background-rgb))] border-r border-(--color-border-subtle) z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-(--color-border-subtle)">
          <span className="text-lg font-bold text-[var(--color-accent-3)]">Menu</span>
          <button onClick={closeSidebar} className="p-2 text-(--color-text-soft) hover:text-(--color-text) hover:bg-white/5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-col flex flex-grow p-4 gap-2">
          {user && (
            <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-3)] flex items-center justify-center text-black">
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold truncate">{user.displayName || "User"}</span>
            </div>
          )}
          <Link href="/" onClick={closeSidebar} className="p-3 rounded-lg hover:bg-white/5 transition-colors font-medium">🏠 Home</Link>
          <Link href="/dashboard" onClick={closeSidebar} className="p-3 rounded-lg hover:bg-white/5 transition-colors font-medium">📊 Dashboard</Link>
          <Link href="/lessons/reflection-of-light" onClick={closeSidebar} className="p-3 rounded-lg hover:bg-white/5 transition-colors font-medium">💡 Lessons</Link>
        </div>

        {/* Sidebar Footer (Mobile Auth) */}
        <div className="p-4 border-t border-(--color-border-subtle) sm:hidden">
            {user ? (
              <button 
                onClick={() => { closeSidebar(); setIsSignOutOpen(true); }}
                className="w-full py-3 bg-red-500/20 text-red-500 border border-red-500/40 rounded-lg text-sm font-bold transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => { closeSidebar(); setIsLoginOpen(true); }}
                className="w-full py-3 bg-[var(--color-accent-3)] text-black rounded-lg text-sm font-bold transition-colors"
              >
                Login
              </button>
            )}
        </div>
      </aside>

      {/* --- MODALS --- */}
      {isLoginOpen && (
        <LoginModal 
          onClose={() => setIsLoginOpen(false)} 
          onSwitchToSignup={handleSwitchToSignup} 
        />
      )}
      {isSignupOpen && (
        <SignupModal 
          onClose={() => setIsSignupOpen(false)} 
        />
      )}
      {isSignOutOpen && (
        <SignOutModal 
          onClose={() => setIsSignOutOpen(false)} 
        />
      )}
    </>
  );
}