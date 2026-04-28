import Image from "next/image";
import Link from "next/link";

// 1. Define the structure for your lessons
const LESSONS = [
  {
    id: "reflection-of-light",
    title: "Reflection of Light",
    category: "Physics",
    duration: "5-10 min",
    description: "Master the law of reflection by aiming lasers and measuring angles in a virtual lab.",
    image: "/sample.png", // Replace with your actual image path
    color: "blue"
  },
  // You can easily add more lessons here later:
  /*
  {
    id: "refraction",
    title: "Refraction & Lenses",
    category: "Physics",
    duration: "12 min",
    description: "Bend light to your will. Learn how lenses focus energy.",
    image: "/refraction.png",
    color: "emerald"
  }
  */
];

export default function LessonsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans pb-20">
      {/* --- Header Section --- */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Practice <span className="text-blue-500">Library</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Interactive challenges to help you build a deep, intuitive understanding of physics and beyond.
        </p>
      </header>

      {/* --- Lessons Grid --- */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}

          {/* Placeholder for "Coming Soon" */}
          <div className="border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center p-10 text-slate-600">
            <div className="w-12 h-12 rounded-full bg-slate-900 mb-4 flex items-center justify-center text-xl">🚀</div>
            <p className="font-bold">More Lessons Soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// 2. The Vertical Card Component
function LessonCard({ lesson }: { lesson: typeof LESSONS[0] }) {
  return (
    <Link href={`/lessons/${lesson.id}`} className="group">
      <div className="h-full bg-slate-900/40 rounded-[2rem] border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-500 flex flex-col p-4 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]">
        
        {/* Image Top Area */}
        <div className="relative w-full aspect-[16/10] bg-[#050505] rounded-[1.5rem] overflow-hidden border border-slate-800 group-hover:border-blue-500/30 transition-colors">
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-colors z-10" />
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />
        </div>

        {/* Content Bottom Area */}
        <div className="flex flex-col flex-grow pt-5 px-2 pb-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20 uppercase tracking-widest">
              {lesson.category}
            </span>
            <span className="text-slate-500 text-xs font-medium italic">{lesson.duration}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
              {lesson.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mt-2 line-clamp-2">
              {lesson.description}
            </p>
          </div>

          <div className="pt-2 mt-auto">
            <div className="w-full py-3 bg-slate-800 group-hover:bg-blue-600 text-white rounded-xl font-bold text-sm text-center transition-all">
              Start Learning
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}