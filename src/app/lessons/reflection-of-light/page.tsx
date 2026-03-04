"use client";

import Playground from "@/components/Playground";
import Math from "@/components/Math";
import Divider from '@/components/Divider/Divider';
// Removed unused imports to keep it clean, add them back if you plan to use them!

export default function ReflectionLesson() {
  return (
    <main className="mx-auto space-y-8 sm:space-y-12 p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90%]">
      <div className="lesson-container mx-auto w-full">
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

      <div className="lesson-container mx-auto w-full">
        <h3 className="text-yellow-400 text-xl font-semibold mb-2">Let's explore the details</h3>
        <p>
          When light strikes a reflective surface, its behavior is described by
          the Two Laws of Reflection, also known as the first and second laws of
          Snell-Descartes.
        </p>
      </div>

      {/* Added responsive Flexbox: columns on mobile, rows on medium screens+ */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 mx-auto w-full">

        {/* Text takes up half the width on desktop */}
        <div className="w-full lg:w-1/2 space-y-4 px-2 sm:px-4">
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
        <div className="w-full lg:w-1/2 overflow-hidden rounded-lg px-2 sm:px-4">
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
      <Divider />
      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 mx-auto w-full">
        <div className="w-full lg:w-1/2 flex flex-col space-y-4 px-2 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Light Reflection</h2>
          <p>When a ray of light strikes a smooth surface, such as a mirror, it is reflected back into the same medium. This behavior follows a simple geometric rule known as the law of reflection, denoted as following: </p>

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
            This law tells us that light reflects in a perfectly symmetric way with respect to the normal line “N” (the line perpendicular to the surface at the point of contact).<br />

            In other words, the surface does not “favor” any direction.<br />
            Light arrives, interacts with the surface, and leaves at the same angle it came in, but on the opposite side of the normal.<br />

            This symmetry is why mirrors produce predictable images and why a laser beam reflects so cleanly from a flat surface          </p>
        </div>
        <div className="w-full lg:w-1/2 min-h-96 sm:min-h-[500px] flex items-center justify-center px-2 sm:px-4">
          <Playground width={500} height={800} module="ahhh" />
        </div>
      </div>
      <Divider />
      <div className="w-full px-2 sm:px-4 mx-auto">
        <p className="max-w-full text-center">Together, the two laws of reflection fully describe how light behaves when it encounters a smooth surface. With only these simple rules, we can accurately predict the direction of reflected rays and construct precise optical models.
          In this Goobly Article, these laws are applied in real time to trace light rays as they interact with reflective surfaces, allowing users to visualize how geometry alone governs reflection. This shows that even the most advanced optical systems are built upon remarkably simple physical principles.</p>
      </div>
    </main>
  );
}