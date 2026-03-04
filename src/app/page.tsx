import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 py-8">
      <div className="w-full max-w-7xl text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-amber-400 mb-8">
          Welcome to the Reflection of Light Experiment
        </h1>
        <div className="relative w-full aspect-video max-w-4xl mx-auto">
          <Image
            src="/reflection-of-light.png"
            alt="Reflection of Light Experiment"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, (max-width: 1536px) 80vw, 70vw"
            priority
          />
        </div>
      </div>
    </main>
  );
}
