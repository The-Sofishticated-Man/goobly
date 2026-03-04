import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-3xl text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-400 mb-8">
          Welcome to the Reflection of Light Experiment
        </h1>
        <div className="relative w-full aspect-video max-w-2xl mx-auto">
          <Image
            src="/reflection-of-light.png"
            alt="Reflection of Light Experiment"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
            priority
          />
        </div>
      </div>
    </main>
  );
}
