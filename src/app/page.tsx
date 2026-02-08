import Image from "next/image";

export default function Home() {
  return (
    
    <main>
      <h1>Welcome to the Reflection of Light Experiment</h1>
      <Image
        src="/reflection-of-light.png"
        alt="Reflection of Light Experiment"
        width={600}
        height={400}
      />
    </main>
  );
}
