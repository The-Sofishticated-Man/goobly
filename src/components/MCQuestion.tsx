"use client";

import React, { useState } from "react";
import Math from "./Math"; // Assuming your existing Math component

interface Option {
  id: string;
  label: string;
  isMath?: boolean;
}

interface MCQuestionProps {
  question: string;
  options: Option[];
  onCorrect: () => void;
  correctOptionId: string;
}

export default function MCQuestion({ question, options, onCorrect, correctOptionId }: MCQuestionProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "checked">("idle");

  const isCorrect = selected === correctOptionId;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-6 text-white bg-[#121212]">
      {/* Question Header */}
      <h2 className="text-2xl font-bold mb-8">{question}</h2>

      {/* Options Stack */}
      <div className="space-y-4 flex-grow">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => status === "idle" && setSelected(option.id)}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 
              ${selected === option.id 
                ? "border-(--color-accent-3) bg-(--color-accent-3)/10" 
                : "border-gray-700 hover:bg-gray-800"
              } 
              ${status === "checked" && option.id === correctOptionId ? "border-green-500 bg-green-500/20" : ""}
              ${status === "checked" && selected === option.id && !isCorrect ? "border-red-500 bg-red-500/20" : ""}
            `}
          >
            <span className="flex items-center">
              <span className={`inline-flex items-center justify-center w-8 h-8 mr-4 border rounded-lg text-sm
                ${selected === option.id ? "border-(--color-accent-3) text-(--color-accent-3)" : "border-gray-600 text-gray-400"}
              `}>
                {option.id}
              </span>
              {option.isMath ? <Math math={option.label} /> : option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Duolingo-style Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 flex justify-between items-center">
        <div className="text-lg font-medium">
          {status === "checked" && (
            <span className={isCorrect ? "text-green-500" : "text-red-500"}>
              {isCorrect ? "✨ Amazing job!" : "❌ Not quite, try again!"}
            </span>
          )}
        </div>
        <button
          disabled={!selected}
          onClick={() => {
            if (status === "idle") setStatus("checked");
            else if (isCorrect) onCorrect();
          }}
          className={`px-10 py-3 rounded-xl font-bold uppercase tracking-wider transition-all
            ${selected 
              ? "bg-[#FFD700] text-black hover:brightness-110 shadow-[0_4px_0_#b89b00]" 
              : "bg-gray-700 text-gray-500 cursor-not-allowed"}
          `}
        >
          {status === "idle" ? "Check" : "Continue"}
        </button>
      </div>
    </div>
  );
}