"use client";

import Playground from "@/components/Playground";
import Math from "@/components/Math";
// Removed unused imports to keep it clean, add them back if you plan to use them!

export default function ReflectionLesson() {
  return (
    <main className="mx-auto space-y-12 p-8 max-w-5xl">
      <div className="lesson-container mx-auto">
        <h1 className="text-3xl font-bold uppercase mb-2">Light Reflection</h1>
        <h2 className="text-xl capitalize mb-4">Reflection on a Plane Mirror</h2>
        <p>
          Light reflection is a basic yet fascinating concept in Geometrical
          Optics. It shows how light bounces off surfaces like mirrors or
          metals, following simple laws we can see in everyday life. Despite its
          simplicity, reflection helps us understand how light interacts with
          its surroundings and how images are formed. From a calm lake to a laser
          hitting a mirror, it's all governed by the same rules.
          <br />
          <br />
          Even with modern advances like lasers, fiber optics, and holography,
          reflection remains central. It's used in telescopes, cameras, and many
          optical instruments. Understanding it isn't just about formulas, it's
          about predicting and controlling light, showing how elegantly simple
          physics can be.
        </p>
      </div>

      <div className="lesson-container mx-auto">
        <h3 className="text-yellow-400 text-xl font-semibold mb-2">Let's explore the details</h3>
        <p>
          When light strikes a reflective surface, its behavior is described by
          the Two Laws of Reflection, also known as the first and second laws of
          Snell-Descartes.
        </p>
      </div>

      {/* Added responsive Flexbox: columns on mobile, rows on medium screens+ */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mx-auto">

        {/* Text takes up half the width on desktop */}
        <div className="w-full md:w-1/2 space-y-4">
          <h3 className="text-yellow-400 text-xl font-semibold">First Law of Reflection</h3>
          <p>
            The incident ray, the <strong>reflected</strong> ray, and the normal to the surface
            at the point of incidence all lie in the same plane, named the
            Plane of Incidence, presented such as:
          </p>

          <div className="text-2xl flex justify-center py-4">
            <Math
              math={String.raw`\textcolor{#ff6b6b}{\vec{n}} \cdot (\textcolor{#feca57}{\vec{i}} \times \textcolor{#feca57}{\vec{r}}) = 0`}
            />
          </div>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <Math math={String.raw`\textcolor{#ff6b6b}{\vec{n}}`} /> Normal vector
            </li>
            <li>
              <Math math={String.raw`\textcolor{#feca57}{\vec{i}}`} /> Incident ray
            </li>
            <li>
              <Math math={String.raw`\textcolor{#feca57}{\vec{r}}`} /> Reflected ray
            </li>
          </ul>
        </div>

        {/* Video takes up the other half */}
        <div className="w-full md:w-1/2 overflow-hidden rounded-lg bg-black -mt-12 md:mt-0">
          <video
            src="/Farmadark mode.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>

      </div>

      <div className="flex justify-between gap-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Light Reflection</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor: </p>

          <div className="text-2xl justify-center flex py-4">
            <Math math={String.raw`\textcolor{#6bcf7f}{\theta_i} = \textcolor{#b78bf8}{\theta_{re}}`} />
          </div>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <Math math={String.raw`\textcolor{#6bcf7f}{\theta_i}`} />: Incident Angle
            </li>
            <li>
              <Math math={String.raw`\textcolor{#b78bf8}{\theta_{re}}`} />: Reflected Angle
            </li>
          </ul>
          <p>
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerc itation ullamco laboris nisi ut aliquip ex ea commodo consequat.ad minim veniam, quis nostrud exerc itation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <Playground width={500} height={400} module="ahhh" />
      </div>
    </main>
  );
}