// components/Navbar.jsx
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full flex items-center py-6 px-4">
      {/* Logo */}
      <Image 
        src="/GooblyHeader.png" 
        alt="Logo" 
        width={100} 
        height={200} 
        className="h-12 w-auto"
      />
      <div className="relative w-full max-w-2xl px-4 flex justify-center mx-auto">
        {/* The Search Bar Container */}
        <div className="flex items-center justify-between w-full h-12 px-6 
                        bg-[#1a1a1a] border border-white/10 rounded-full 
                        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] 
                        ring-1 ring-black/50">
            
          {/* Placeholder Text */}
          <span className="text-gray-400 font-mono text-sm tracking-wide">
            Search Course/Simulation
          </span>
          {/* Search Icon */}
          <Search className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </nav>
  );
}