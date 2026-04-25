"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig"; // ⚠️ Adjust path if necessary

// Define the shape of our data
interface LessonResult {
    lessonId: string;
    lessonName: string;
    score: number;
    totalQuestions: number;
    status: string;
    date: string;
}

export default function DashboardPage() {
    const [results, setResults] = useState<LessonResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        // This listens for Firebase Auth to confirm the user is logged in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                try {
                    // Path: users -> [userId] -> lessonResults
                    const resultsRef = collection(db, "users", user.uid, "lessonResults");
                    const snapshot = await getDocs(resultsRef);

                    const fetchedResults: LessonResult[] = [];

                    snapshot.forEach((doc) => {
                        const data = doc.data();

                        // Convert Firebase Timestamp to a readable Date string
                        let formattedDate = "Unknown Date";
                        if (data.completedAt) {
                            const dateObj = data.completedAt.toDate(); // Firebase specific method
                            formattedDate = dateObj.toLocaleDateString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }); // e.g., "Oct 25, 2023"
                        }

                        fetchedResults.push({
                            lessonId: data.lessonId,
                            lessonName: data.lessonName,
                            score: data.score,
                            totalQuestions: data.totalQuestions,
                            status: data.status,
                            date: formattedDate,
                        });
                    });

                    setResults(fetchedResults);
                } catch (error) {
                    console.error("Error fetching dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // No user logged in
                setIsLoggedIn(false);
                setLoading(false);
            }
        });

        // Cleanup listener when component unmounts
        return () => unsubscribe();
    }, []);

    // --- RENDER STATES ---

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold text-gray-400 animate-pulse">Loading your dashboard...</p>
            </main>
        );
    }

    if (!isLoggedIn) {
        return (
            <main className="max-w-4xl mx-auto min-h-screen flex flex-col items-center justify-center text-center p-6">
                <h1 className="text-3xl font-bold mb-4">You are not logged in!</h1>
                <p className="text-gray-400 mb-8">Please log in to view your lesson progress and scores.</p>
                <Link href="/" className="px-6 py-3 bg-[#FFD700] text-black font-bold rounded-xl">
                    Go to Homepage
                </Link>
            </main>
        );
    }

    // --- MAIN DASHBOARD RENDER ---
    return (
        <main className="max-w-4xl mx-auto min-h-screen flex flex-col p-6 sm:p-10">
            <header className="mb-10 border-b border-gray-800 pb-6">
                <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                <p className="text-gray-400 text-lg">Track your progress and review your past lessons.</p>
            </header>

            <div className="flex-grow space-y-4">
                {/* We map over our real 'results' state now! */}
                {results.map((result) => {
                    const percentage = Math.round((result.score / result.totalQuestions) * 100);
                    const isPass = result.status === "PASS";

                    return (
                        <div
                            key={result.lessonId}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-700 transition-colors"
                        >
                            {/* 1. Lesson Info & Date */}
                            <div className="flex-1">
                                <h2 className="text-xl font-bold mb-1">{result.lessonName}</h2>
                                <p className="text-sm text-gray-500">Last completed: {result.date}</p>
                            </div>

                            {/* 2. Percentage & Progress Bar */}
                            <div className="flex-1 w-full md:max-w-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-300">Score: {result.score}/{result.totalQuestions}</span>
                                    <span className="text-sm font-bold text-white">{percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isPass ? "bg-green-500" : "bg-[#FFD700]"}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* 3. Status Badge & Action */}
                            <div className="flex items-center gap-4 md:w-48 justify-end">
                                <span className={`px-3 py-1 rounded-lg text-sm font-bold tracking-wider ${isPass ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                                    }`}>
                                    {result.status}
                                </span>

                                <Link
                                    href={`/lessons/${result.lessonId}`}
                                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 text-sm font-medium"
                                >
                                    {isPass ? "Review" : "Retake"}
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {results.length === 0 && (
                    <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
                        <p className="text-gray-400 text-lg mb-4">You haven't completed any lessons yet.</p>
                        <Link href="/lessons/reflection-of-light" className="text-[#FFD700] font-bold hover:underline">
                            Start Your First Lesson
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}