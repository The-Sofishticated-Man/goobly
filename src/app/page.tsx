import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* --- Subtle Background Glow --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <main className="flex flex-col items-center">
        {/* --- Hero Section --- */}
        <section className="w-full max-w-5xl pt-24 pb-20 px-6 text-center space-y-8">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-sm font-medium">
            ✨ Interactive Learning Reimagined
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            LEARN BY <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
              DOING.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ditch the lectures. Solve interactive puzzles that build
            a deep, intuitive understanding of the world.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/lessons/reflection-of-light" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Start Learning Now
            </Link>
            <Link href="/lessons" className="px-10 py-4 bg-slate-800/50 text-white rounded-2xl font-bold text-lg border border-slate-700 hover:bg-slate-800 transition-all">
              Browse Library
            </Link>
          </div>
        </section>

        {/* --- Featured Lesson Section --- */}
        <section className="w-full max-w-6xl px-6 py-16">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-500">First Module</h2>
            <div className="h-[1px] flex-grow bg-slate-800"></div>
          </div>

          {/* The Dark Glass Lesson Card */}
          <div className="group relative bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all duration-500 flex flex-col lg:flex-row p-4 lg:p-10 gap-10 items-center backdrop-blur-sm">

            {/* Image Side with Glow */}
            <div className="relative w-full lg:w-3/5 aspect-video bg-[#050505] rounded-3xl overflow-hidden border border-slate-800 group-hover:border-blue-500/30 transition-colors">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-transparent transition-colors z-10" />
              <Image
                src="/sample.png"
                alt="Reflection of Light Experiment"
                fill
                className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                priority
              />
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-2/5 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-md border border-blue-500/20 uppercase tracking-wider">
                  Physics
                </span>
                <span className="text-slate-500 text-sm italic">5-10 min</span>
              </div>
              <h3 className="text-4xl font-extrabold text-white leading-tight">
                Reflection of Light
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Why does light bounce off a mirror? Master the law of reflection
                by aiming lasers and measuring angles in a virtual lab.
              </p>

              <Link href="/lessons/reflection-of-light" className="group/btn relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 overflow-hidden">
                <span className="relative z-10">Launch Experiment</span>
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-12 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>© 2026 Goobly. Master the universe, one interaction at a time.</p>
      </footer>
    </div>
  );
}