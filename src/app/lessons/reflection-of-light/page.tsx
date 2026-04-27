"use client";

import { useState } from "react";
import FlatMirrorReflectionPlayground from "@/components/FlatMirrorReflectionPlayground";
import Math from "@/components/Math";
import Divider from "@/components/Divider/Divider";
import { PALETTE } from "@/lib/colors";
import ConvexMirrorReflectionPlayground from "@/components/ConvexMirrorReflectionPlayground";
import Link from "next/link";
import ConcaveMirrorReflectionPlayground from "@/components/ConcaveMirrorReflectionPlayground";

export default function ReflectionLesson() {
  // State to control the wave from the main page
  const [showWave, setShowWave] = useState(false);

  return (
    <main className="mx-auto space-y-8 sm:space-y-12 p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90%]">
      <div className="lesson-container mx-auto w-full">
        <h1 className="text-3xl font-bold uppercase mb-2">Light Reflection</h1>
        <h2 className="text-xl capitalize mb-4">
          Reflection on a Plane Mirror
        </h2>
        <p className="flex justify-center text-center w-dvh mx-42">
          Light reflection is a basic yet fascinating concept in Geometrical
          Optics. It shows how light bounces off surfaces like mirrors or
          metals, following simple laws we can see in everyday life. Despite its
          simplicity, reflection helps us understand how light interacts with
          its surroundings and how images are formed. From a calm lake to a
          laser hitting a mirror, it&apos;s all governed by the same rules.
          <br />
          <br />
          Even with modern advances like lasers, fiber optics, and holography,
          reflection remains central. It&apos;s used in telescopes, cameras, and
          many optical instruments. Understanding it isn&apos;t just about
          formulas, it&apos;s about predicting and controlling light, showing
          how elegantly simple physics can be.
        </p>
      </div>

      <div className="lesson-container mx-auto w-full">
        <h3 className="text-(--color-accent-3) text-xl font-semibold mb-2">
          Let&apos;s explore the details
        </h3>
        <p>
          When light strikes a reflective surface, its behavior is described by
          the Two Laws of Reflection, also known as the first and second laws of
          Snell-Descartes.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 mx-auto w-full">
        <div className="w-full lg:w-1/2 space-y-4 px-2 sm:px-4">
          <h3 className="text-(--color-accent-3) text-xl font-semibold">
            First Law of Reflection
          </h3>
          <p>
            The incident ray, the <strong>reflected</strong> ray, and the normal
            to the surface at the point of incidence all lie in the same plane,
            named the Plane of Incidence, presented such as:
          </p>

          <div className="text-2xl flex justify-center py-4">
            <Math
              math={String.raw`\textcolor{${PALETTE.accent4}}{\vec{n}} \cdot (\textcolor{${PALETTE.accent3}}{\vec{i}} \times \textcolor{${PALETTE.accent3}}{\vec{r}}) = 0`}
            />
          </div>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent4}}{\vec{n}}`}
              />{" "}
              Normal vector
            </li>
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent3}}{\vec{i}}`}
              />{" "}
              Incident ray
            </li>
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent3}}{\vec{r}}`}
              />{" "}
              Reflected ray
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/2 overflow-hidden rounded-lg px-2 sm:px-4">
          <video
            src="/idklol.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover bg-background"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <Divider />

      {/* FLAT MIRROR SECTION */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 mx-auto w-full">
        <div className="w-full lg:w-[44%] flex flex-col space-y-4 px-2 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Light Reflection</h2>
          <p>
            When a ray of light strikes a smooth surface, such as a mirror, it
            is reflected back into the same medium. This behavior follows a
            simple geometric rule known as the law of reflection, denoted as
            following:{" "}
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math
              math={String.raw`\textcolor{${PALETTE.accent1}}{\theta_i} = \textcolor{${PALETTE.accent2}}{\theta_{re}}`}
            />
          </div>

          <ul className="list-disc list-inside space-y-2">
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent1}}{\theta_i}`}
              />
              : Incident Angle
            </li>
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent2}}{\theta_{re}}`}
              />
              : Reflected Angle
            </li>
          </ul>
          <p>
            This law tells us that light reflects in a perfectly symmetric way
            with respect to the normal line “N” (the line perpendicular to the
            surface at the point of contact).
            <br />
            In other words, the surface does not “favor” any direction.
            <br />
            Light arrives, interacts with the surface, and leaves at the same
            angle it came in, but on the opposite side of the normal.
            <br />
            This symmetry is why mirrors produce predictable images and why a
            laser beam reflects so cleanly from a flat surface.
          </p>
          <h3 className="text-(--color-accent-3) text-xl font-semibold mt-6">
            Computing Reflection (Vector Form)
          </h3>
          <p>
            In modern physics simulations and video games (just like the
            playground here), calculating angles can be slow. Instead, computers
            calculate reflection using the{" "}
            <strong>Vector Reflection Formula</strong>. If we know the incoming
            light vector and the mirror&apos;s normal vector, we can perfectly
            calculate the outgoing ray:
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math
              math={String.raw`\textcolor{${PALETTE.accent3}}{\vec{r}} = \textcolor{${PALETTE.accent3}}{\vec{i}} - 2(\textcolor{${PALETTE.accent3}}{\vec{i}} \cdot \textcolor{${PALETTE.accent4}}{\hat{n}})\textcolor{${PALETTE.accent4}}{\hat{n}}`}
            />
          </div>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent3}}{\vec{r}}`}
              />{" "}
              : Reflected direction vector
            </li>
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent3}}{\vec{i}}`}
              />{" "}
              : Incident direction vector
            </li>
            <li>
              <Math
                math={String.raw`\textcolor{${PALETTE.accent4}}{\hat{n}}`}
              />{" "}
              : Unit normal vector of the surface
            </li>
          </ul>

          <h3 className="text-(--color-accent-3) text-xl font-semibold mt-8">
            The Wave Model of Light
          </h3>
          <p>
            Notice the pulsing animation in the interactive playground? While we
            often draw light as straight geometrical &quot;rays&quot; to
            calculate angles easily, light actually travels as an oscillating
            electromagnetic wave. We can describe the displacement of this wave
            over time and distance using the standard wave equation:
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math math={String.raw`y(x, t) = A \sin(kx - \omega t)`} />
          </div>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <strong>A</strong> : Amplitude (height of the wave)
            </li>
            <li>
              <strong>k</strong> : Wavenumber (how tight the peaks are)
            </li>
            <li>
              <strong>ω</strong> : Angular frequency (how fast it pulses over
              time)
            </li>
          </ul>

          <p>
            When the wave hits the mirror, its continuous phase reflects
            perfectly. Because it stays in the same medium (like air), its
            frequency and speed remain completely unchanged!
          </p>

          {/* Toggle Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowWave(false)}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-xl shadow transition-all ${
                !showWave
                  ? "bg-[#FFD700] text-black shadow-[0_4px_0_#b89b00] translate-y-0"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300 shadow-[0_4px_0_#9ca3af]"
              }`}
            >
              Ray Model
            </button>
            <button
              onClick={() => setShowWave(true)}
              className={`px-6 py-2 text-sm font-bold uppercase tracking-wider rounded-xl shadow transition-all ${
                showWave
                  ? "bg-[#FFD700] text-black shadow-[0_4px_0_#b89b00] translate-y-0"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300 shadow-[0_4px_0_#9ca3af]"
              }`}
            >
              Wave Model
            </button>
          </div>
          <p className="text-sm text-gray-500 italic mt-2">
            Click the buttons above to toggle the view in the playground.
          </p>
        </div>
        <div className="w-full lg:w-[56%] min-h-96 sm:min-h-[500px] flex items-center justify-center px-2 sm:px-4">
          <FlatMirrorReflectionPlayground
            width={780}
            height={800}
            showWave={showWave}
          />
        </div>
      </div>

      <Divider />

      {/* --- NEW: CONVEX MIRROR SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 mx-auto w-full">
        {/* Text takes up half the width on desktop */}
        <div className="w-full lg:w-[44%] flex flex-col space-y-4 px-2 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Curved Reflection</h2>
          <h3 className="text-(--color-accent-3) text-xl font-semibold mt-2">
            The Convex Mirror
          </h3>
          <p>
            What happens when the mirror isn&apos;t flat? In a{" "}
            <strong>Convex Mirror</strong> (a surface that bulges outward
            towards the light source), the basic Law of Reflection still applies
            perfectly! However, the &quot;normal&quot; line is no longer
            pointing in just one uniform direction.
          </p>
          <p>
            For a spherical curved mirror, the normal vector{" "}
            <Math math={String.raw`\textcolor{${PALETTE.accent4}}{\hat{n}}`} />{" "}
            is found by drawing a straight line from the mirror&apos;s{" "}
            <strong>
              Center of Curvature (<Math math={String.raw`C`} />)
            </strong>{" "}
            to the exact point where the light hits the surface (
            <Math math={String.raw`P_{hit}`} />
            ).
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math
              math={String.raw`\textcolor{${PALETTE.accent4}}{\hat{n}} = \frac{P_{hit} - C}{||P_{hit} - C||}`}
            />
          </div>

          <p>
            Because the normal line angles outward depending on where the ray
            strikes, incoming rays that are parallel to each other will bounce
            outward in wildly different directions. They{" "}
            <strong>diverge</strong>.
            <br />
            <br />
            This divergence is exactly why convex mirrors make objects appear
            smaller than they really are, but give you a much wider field of
            view—making them perfect for security mirrors in stores and the
            passenger-side mirrors on cars!
          </p>

          <p className="text-sm text-gray-500 italic mt-2">
            Try moving the laser up and down to see how the curved normal
            changes the reflection!
          </p>
        </div>
        <div className="w-full lg:w-[56%] min-h-96 sm:min-h-[500px] flex items-center justify-center px-2 sm:px-4 ">
          <ConvexMirrorReflectionPlayground
            width={760}
            height={620}
            module={"ahhh"}
            showWave={false}
          />
        </div>
      </div>
      {/* ------------------------------------- */}
      <Divider />

      {/* --- CONCAVE MIRROR SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 mx-auto w-full">
        <div className="w-full lg:w-[44%] flex flex-col space-y-4 px-2 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Curved Reflection</h2>
          <h3 className="text-(--color-accent-3) text-xl font-semibold mt-2">
            The Concave Mirror
          </h3>
          <p>
            Now flip the curve. A <strong>Concave Mirror</strong> (a surface
            that curves <em>inward</em>, like the inside of a bowl) follows the
            exact same Law of Reflection — but because the normals now angle{" "}
            <em>inward</em>, something very different happens: instead of
            diverging, the reflected rays <strong>converge</strong>.
          </p>
          <p>
            Every ray that arrives parallel to the optical axis reflects and
            passes through a single point called the{" "}
            <strong>Focal Point (F)</strong>. The distance from the
            mirror&apos;s surface to this point is the{" "}
            <strong>focal length</strong>,{" "}
            <Math math={String.raw`\textcolor{${PALETTE.accent1}}{f}`} />, and
            it is directly tied to the mirror&apos;s radius of curvature{" "}
            <Math math={String.raw`\textcolor{${PALETTE.accent2}}{R}`} />:
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math
              math={String.raw`\textcolor{${PALETTE.accent1}}{f} = \frac{\textcolor{${PALETTE.accent2}}{R}}{2}`}
            />
          </div>

          <p>
            This convergence is what makes concave mirrors so powerful. They are
            used in <strong>telescopes</strong> to gather and focus starlight,
            in <strong>satellite dishes</strong> to focus incoming signals, and
            even in the <strong>makeup mirrors</strong> that magnify your face —
            because an object placed closer than the focal point produces a
            large, upright, virtual image.
          </p>

          <h3 className="text-(--color-accent-3) text-xl font-semibold mt-6">
            The Mirror Equation
          </h3>
          <p>
            Knowing that rays converge isn&apos;t enough — we also want to know{" "}
            <em>where</em> the image forms. The <strong>Mirror Equation</strong>{" "}
            relates the focal length to the distances of the object and the
            image from the mirror&apos;s surface:
          </p>

          <div className="text-2xl justify-center flex py-4">
            <Math
              math={String.raw`\frac{1}{\textcolor{${PALETTE.accent1}}{f}} = \frac{1}{\textcolor{${PALETTE.accent3}}{d_o}} + \frac{1}{\textcolor{${PALETTE.accent2}}{d_i}}`}
            />
          </div>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <Math math={String.raw`\textcolor{${PALETTE.accent1}}{f}`} /> :
              Focal length of the mirror
            </li>
            <li>
              <Math math={String.raw`\textcolor{${PALETTE.accent3}}{d_o}`} /> :
              Distance from the object to the mirror
            </li>
            <li>
              <Math math={String.raw`\textcolor{${PALETTE.accent2}}{d_i}`} /> :
              Distance from the image to the mirror
            </li>
          </ul>

          <p>
            When <Math math={String.raw`\textcolor{${PALETTE.accent2}}{d_i}`} />{" "}
            comes out positive, the image forms in front of the mirror —
            it&apos;s a <strong>real image</strong> you could project onto a
            screen. When it comes out negative, the image is behind the mirror —
            a <strong>virtual image</strong>, like the one you see in a flat
            mirror.
          </p>

          <p className="text-sm text-gray-500 italic mt-2">
            Move the laser toward and away from the focal point — watch what
            happens to where the reflected rays meet!
          </p>
        </div>

        <div className="w-full lg:w-[56%] min-h-96 sm:min-h-[500px] flex items-center justify-center px-2 sm:px-4">
          <ConcaveMirrorReflectionPlayground
            width={760}
            height={620}
            module={"concave"}
            showWave={false}
          />
        </div>
      </div>
      <Divider />
      <div className="w-full px-2 sm:px-4 mx-auto mt-12">
        <p className="max-w-full text-center">
          Together, the laws of reflection fully describe how light behaves when
          it encounters any smooth surface—whether perfectly flat or curved. As
          we have seen, whether we model light as a simple geometric ray or an
          oscillating wave, these fundamental rules allow us to accurately
          predict the direction of reflected light and construct precise optical
          models. In this Goobly Article, these physical laws and vector
          mathematics are applied in real time to trace light paths as they
          interact with different reflective surfaces, allowing users to
          visualize how geometry and wave mechanics govern reflection. This
          shows that even the most advanced optical systems are built upon
          remarkably simple physical principles.
        </p>
      </div>

      <div className="w-full flex justify-end pt-12 pb-8 px-2 sm:px-4">
        <Link
          href="/lessons/reflection-of-light/reflection-of-light-MCQ"
          className="bg-[#FFD700] text-black px-12 py-4 rounded-xl font-bold uppercase tracking-wider hover:brightness-110 shadow-[0_4px_0_#b89b00] transition-all"
        >
          Practice Reflection →
        </Link>
      </div>
    </main>
  );
}
