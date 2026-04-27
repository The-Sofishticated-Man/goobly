"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Math from "@/components/Math";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../../firebaseConfig"; // ⚠️ Adjust this path to your firebaseConfig if needed

// --- 1. THE HARDCODED DATA (Used only for the Upload button) ---
const QUESTIONS = [
  {
    id: 1,
    question:
      "If light hits a mirror at an incident angle of 40°, what is the reflected angle?",
    options: [
      { key: "A", label: "20°" },
      { key: "B", label: "40°" },
      { key: "C", label: "80°" },
    ],
    correctKey: "B",
  },
  {
    id: 2,
    question:
      "The first law of Snell-Descartes implies that the incident ray and reflected ray are:",
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
    question:
      "Which line is perpendicular to the reflective surface at the point of incidence?",
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

// --- 2. TYPES ---
interface Option {
  key: string;
  label: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  correctKey: string;
  math?: string;
}

// --- 3. MAIN COMPONENT ---
export default function MCQPage() {
  // Database and Score States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  // Quiz States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Fetch from Firebase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const docRef = doc(db, "questions", "reflection-of-light");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.items) {
            setQuestions(data.items);
          }
        } else {
          console.error("No questions document found in Firebase!");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // --- SAVE PROGRESS TO FIREBASE ---
  useEffect(() => {
    const saveProgress = async () => {
      if (isFinished) {
        // Get the currently logged-in user
        const user = auth.currentUser;

        if (user) {
          const isPass = score > questions.length / 2;

          try {
            // Path: users -> [userId] -> lessonResults -> reflection-of-light
            const resultRef = doc(
              db,
              "users",
              user.uid,
              "lessonResults",
              "reflection-of-light",
            );

            await setDoc(
              resultRef,
              {
                lessonId: "reflection-of-light",
                lessonName: "Reflection of Light",
                score: score,
                totalQuestions: questions.length,
                status: isPass ? "PASS" : "FAIL",
                completedAt: serverTimestamp(), // Saves the exact date/time
              },
              { merge: true },
            ); // merge: true overwrites the score if they retake it

            console.log("✅ Progress successfully saved to dashboard!");
          } catch (error) {
            console.error("❌ Error saving progress:", error);
          }
        } else {
          console.log("⚠️ No user is logged in. Progress will not be saved.");
        }
      }
    };

    saveProgress();
  }, [isFinished, score, questions.length]);

  // Upload to Firebase Function
  // const handleUploadData = async () => {
  //     try {
  //         await setDoc(doc(db, "questions", "reflection-of-light"), {
  //             items: QUESTIONS
  //         });
  //         alert("✅ Database successfully created and populated!");
  //         window.location.reload(); // Refresh the page to load the new data
  //     } catch (error) {
  //         console.error("Error uploading data:", error);
  //         alert("❌ Error uploading data. Check console.");
  //     }
  // };

  // --- RENDER LOADING OR EMPTY STATE ---
  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen text-xl font-bold">
        Loading lesson...
      </main>
    );
  }

  // if (questions.length === 0) {
  //     return (
  //         <main className="flex flex-col items-center justify-center min-h-screen text-xl font-bold gap-6">
  //             <p className="text-red-500">No questions found in Firebase.</p>
  //             {/* Temporary button to push data to Firebase */}
  //             <button
  //                 onClick={handleUploadData}
  //                 className="p-4 bg-blue-500 text-white font-bold rounded-xl"
  //             >
  //                 Push Data to Firebase
  //             </button>
  //         </main>
  //     );
  // }

  // --- QUIZ LOGIC ---
  const currentQ = questions[currentIndex];
  const isCorrect = selected === currentQ.correctKey;

  const handleContinue = () => {
    if (!isChecked) {
      setIsChecked(true);
      if (isCorrect) {
        setScore((prev) => prev + 1); // Increase score if correct
      }
    } else {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
        setIsChecked(false);
      } else {
        setIsFinished(true); // End of quiz
      }
    }
  };

  // --- RENDER FINISHED STATE (PASS/FAIL) ---
  if (isFinished) {
    const isPass = score > questions.length / 2;

    return (
      <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h1 className="text-4xl font-bold mb-4">
          {isPass ? "Lesson Passed! 🏆" : "Keep Practicing! 💡"}
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          You scored {score} out of {questions.length}.
        </p>
        <p
          className={`text-lg font-bold mb-8 ${isPass ? "text-green-500" : "text-red-500"}`}
        >
          Status: {isPass ? "PASS" : "FAIL"}
        </p>
        <Link
          href="/lessons/reflection-of-light"
          className="text-[#FFD700] underline hover:brightness-110"
        >
          Back to Lesson
        </Link>
      </main>
    );
  }

  // --- RENDER ACTIVE QUIZ ---
  return (
    <main className="max-w-3xl mx-auto min-h-screen flex flex-col p-6 sm:p-10">
      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-3 rounded-full mb-12">
        <div
          className="bg-[#FFD700] h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
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
          {/* The ?.map fixes the "Cannot read properties of undefined" error */}
          {currentQ.options?.map((opt) => (
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
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold
                ${selected === opt.key ? "border-[#FFD700] text-[#FFD700]" : "border-gray-600 text-gray-500"}
              `}
              >
                {opt.key}
              </span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`fixed bottom-0 left-0 w-full p-6 border-t border-gray-800 transition-colors
        ${isChecked ? (isCorrect ? "bg-green-900/20" : "bg-red-900/20") : "bg-[#0a0a0a]"}
      `}
      >
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div>
            {isChecked && (
              <p
                className={`text-xl font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}
              >
                {isCorrect
                  ? "✔ Correct!"
                  : `✖ Oops! The answer was ${currentQ.correctKey}`}
              </p>
            )}
          </div>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-12 py-4 rounded-xl font-bold uppercase tracking-widest transition-all
              ${
                selected
                  ? "bg-[#FFD700] text-black shadow-[0_4px_0_#b89b00] hover:brightness-110 active:shadow-none active:translate-y-1"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isChecked ? "Continue" : "Check"}
          </button>
        </div>
      </footer>
    </main>
  );
}
