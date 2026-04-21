"use client";
import React from 'react';
interface LoginButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    className?: string;
}
export default function LoginButton({ children, onClick, disabled, className }: LoginButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md font-semibold text-black transition-colors 
            ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-accent-3)] hover:bg-[var(--color-accent-5)]'} ${className}`}
        >
            {children}
        </button>);
}