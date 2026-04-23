"use client";

import { useState } from "react";
import Link from "next/link";
import Math from "@/components/Math";
import { PALETTE } from "@/lib/colors";

const QUESTIONS = [
    {
        id: 1,
        question: "If light hits a mirror at an incident angle of 40°, what is the reflected angle?",
        options: [
            { key: "A", label: "20°" },
            { key: "B", label: "40°" },
            { key: "C", label: "80°" },
        ],
        correctKey: "B",
    },
    {
        id: 2,
        question: "The first law of Snell-Descartes implies that the incident ray and reflected ray are:",
        options: [
            { key: "A", label: "In different dimensions" },
            { key: "B", label: "Always parallel" },
            { key: "C", label: "In the same plane" },
        ],
        correctKey: "C",
    },
    {
        id: 3,
        question: "In the vector equation below, what does the zero represent?",
        math: String.raw`\vec{n} \cdot (\vec{i} \times \vec{r}) = 0`,
        options: [
            { key: "A", label: "The vectors are coplanar" },
            { key: "B", label: "The light has stopped" },
            { key: "C", label: "The surface is rough" },
        ],
        correctKey: "A",
    },
    {
        id: 4,
        question: "Which line is perpendicular to the reflective surface at the point of incidence?",
        options: [
            { key: "A", label: "The Tangent" },
            { key: "B", label: "The Normal" },
            { key: "C", label: "The Horizon" },
        ],
        correctKey: "B",
    },
    {
        id: 5,
        question: "Why do flat mirrors produce clear, predictable images?",
        options: [
            { key: "A", label: "Because they favor the left side" },
            { key: "B", label: "Because of perfectly symmetric reflection" },
            { key: "C", label: "Because they absorb all light" },
        ],
        correctKey: "B",
    },
];

export default function MCQPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentQ = QUESTIONS[currentIndex];
    const isCorrect = selected === currentQ.correctKey;

    const handleContinue = () => {
        if (!isChecked) {
            setIsChecked(true);
        } else {
            if (currentIndex < QUESTIONS.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setSelected(null);
                setIsChecked(false);
            } else {
                setIsFinished(true);
            }
        }
    };

    if (isFinished) {
        return (
            <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
                <h1 className="text-4xl font-bold mb-4">Lesson Complete! 🏆</h1>
                <p className="text-xl text-gray-400 mb-8">You've mastered the basics of Light Reflection.</p>
                <Link href="/lessons/reflection-of-light" className="text-[#FFD700] underline">Back to Lesson</Link>
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto min-h-screen flex flex-col p-6 sm:p-10">
            {/* Progress Bar */}
            <div className="w-full bg-gray-800 h-3 rounded-full mb-12">
                <div
                    className="bg-[#FFD700] h-full rounded-full transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">{currentQ.question}</h2>
                {currentQ.math && (
                    <div className="py-6 flex justify-center text-3xl">
                        <Math math={currentQ.math} />
                    </div>
                )}

                <div className="space-y-4 mt-8">
                    {currentQ.options.map((opt) => (
                        <button
                            key={opt.key}
                            disabled={isChecked}
                            onClick={() => setSelected(opt.key)}
                            className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4
                ${selected === opt.key ? "border-[#FFD700] bg-[#FFD700]/5" : "border-gray-700 hover:bg-gray-800"}
                ${isChecked && opt.key === currentQ.correctKey ? "border-green-500 bg-green-500/10" : ""}
                ${isChecked && selected === opt.key && !isCorrect ? "border-red-500 bg-red-500/10" : ""}
              `}
                        >
                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold
                ${selected === opt.key ? "border-[#FFD700] text-[#FFD700]" : "border-gray-600 text-gray-500"}
              `}>
                                {opt.key}
                            </span>
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Duolingo Footer */}
            <footer className={`fixed bottom-0 left-0 w-full p-6 border-t border-gray-800 transition-colors
        ${isChecked ? (isCorrect ? "bg-green-900/20" : "bg-red-900/20") : "bg-[#0a0a0a]"}
      `}>
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div>
                        {isChecked && (
                            <p className={`text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                                {isCorrect ? "✔ Correct!" : `✖ Oops! The answer was ${currentQ.correctKey}`}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleContinue}
                        disabled={!selected}
                        className={`px-12 py-4 rounded-xl font-bold uppercase tracking-widest transition-all
              ${selected
                                ? "bg-[#FFD700] text-black shadow-[0_4px_0_#b89b00] hover:brightness-110 active:shadow-none active:translate-y-1"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"}
            `}
                    >
                        {isChecked ? "Continue" : "Check"}
                    </button>
                </div>
            </footer>
        </main>
    );
}