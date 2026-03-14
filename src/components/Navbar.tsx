// components/Navbar.jsx
import { Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 w-full flex flex-col sm:flex-row items-center sm:justify-start py-3 sm:py-6 px-3 sm:px-4 md:px-6 lg:px-8 gap-3 sm:gap-4 md:gap-6">
      {/* Logo */}
      <Image
        src="/GooblyHeader.png"
        alt="Logo"
        width={100}
        height={200}
        className="h-8 sm:h-12 md:h-14 w-auto shrink-0"
      />

      <div className="relative w-full flex justify-center bg-[rgb(var(--color-background-rgb))] rounded-full">
        {/* The Search Bar Container */}
        <div className="flex items-center justify-between w-full h-10 sm:h-12 px-4 sm:px-6 bg-[rgb(var(--color-background-rgb))] border border-(--color-border-subtle) rounded-full shadow-[inset_0_1px_1px_rgba(var(--color-text-rgb),0.1)] ring-1 ring-black/50">
          {/* Placeholder Text */}
          <span className="text-(--color-text-muted) font-mono text-xs sm:text-sm tracking-wide truncate">
            Search Course/Simulation
          </span>
          {/* Search Icon */}
          <Search className="w-4 sm:w-5 h-4 sm:h-5 text-(--color-text-soft) shrink-0 ml-2" />
        </div>
      </div>
    </nav>
  );
}
