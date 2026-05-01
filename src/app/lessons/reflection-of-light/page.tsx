"use client";

import { useState } from "react";
import FlatMirrorReflectionPlayground from "@/components/FlatMirrorReflectionPlayground";
import Math from "@/components/Math";
import Divider from "@/components/Divider";
import { PALETTE } from "@/lib/colors";
import ConvexMirrorReflectionPlayground from "@/components/ConvexMirrorReflectionPlayground";
import Link from "next/link";
import ConcaveMirrorReflectionPlayground from "@/components/ConcaveMirrorReflectionPlayground";

// ─── Colour constants ────────────────────────────────────────────────────────
// Each physical concept gets exactly ONE colour throughout the page.
// We only use the five accent colours that exist in PALETTE.
//
//  PALETTE.accent1  #a0e8a9  green   – incident ray î / incident angle θᵢ / amplitude A / P_hit
//  PALETTE.accent2  #be9ad2  purple  – reflected angle θᵣₑ / focal length f
//  PALETTE.accent3  #f5ce5c  yellow  – headings / object distance dₒ / wavenumber k
//  PALETTE.accent4  #f35f5f  red     – normal vector n̂
//  PALETTE.accent5  #7491ff  blue    – reflected ray r̂ / radius R / image distance dᵢ / Center C / ω
//
// NOTE: accent6 does NOT exist in PALETTE — we use accent5 for ω and C instead.


/** Inline coloured + semibold span */
const T = ({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) => (
  <span style={{ color }} className="font-semibold">
    {children}
  </span>
);

/** Colour-dot legend list shown beneath equations */
const Legend = ({
  items,
}: {
  items: { color: string; math: string; label: string }[];
}) => (
  <ul className="mt-5 space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
    {items.map(({ color, math, label }) => (
      <li key={label} className="flex items-center gap-2.5">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: color }}
        />
        <span>
          <Math math={`\\textcolor{${color}}{${math}}`} /> —{" "}
          <T color={color}>{label}</T>
        </span>
      </li>
    ))}
  </ul>
);

/** Frosted card wrapping an equation block */
const EqCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="rounded-2xl px-6 py-5"
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    {children}
  </div>
);

export default function ReflectionLesson() {
  const [showWave, setShowWave] = useState(false);

  return (
    <main
      className="mx-auto w-full max-w-full lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90%]"
      style={{ padding: "clamp(1.25rem, 4vw, 2.5rem)" }}
    >
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — fully centred
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="mb-20 sm:mb-28 ">
        <div className="text-center">
          <p
            className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: PALETTE.accent3 }}
          >
            Physics · Module 1
          </p>
          <h1 className="text-5xl sm:text-6xl font-black uppercase leading-none mb-3">
            Light Reflection
          </h1>
          <h2
            className="text-2xl sm:text-3xl font-light capitalize mb-12"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Reflection on a Plane Mirror
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-5">
          <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            Light reflection is a basic yet fascinating concept in Geometrical
            Optics. It shows how light bounces off surfaces like mirrors or
            metals, following simple laws we can see in everyday life. Despite
            its simplicity, reflection helps us understand how light interacts
            with its surroundings and how images are formed. From a calm lake to
            a laser hitting a mirror, it&apos;s all governed by the same rules.
          </p>
          <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            Even with modern advances like lasers, fiber optics, and holography,
            reflection remains central. It&apos;s used in telescopes, cameras,
            and many optical instruments. Understanding it isn&apos;t just about
            formulas — it&apos;s about predicting and controlling light, showing
            how elegantly simple physics can be.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FIRST LAW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="mb-20 sm:mb-28">
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: PALETTE.accent3 }}
        >
          Laws of Reflection
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold mb-10">
          Let&apos;s explore the details
        </h3>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text */}
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              When light strikes a reflective surface, its behaviour is described
              by the Two Laws of Reflection, also known as the first and second
              laws of Snell-Descartes.
            </p>

            <EqCard>
              <h4 className="font-semibold text-lg mb-4" style={{ color: PALETTE.accent3 }}>
                First Law of Reflection
              </h4>
              <p className="leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.8)" }}>
                The <T color={PALETTE.accent1}>incident ray</T>,{" "}
                <T color={PALETTE.accent5}>reflected ray</T>, and the{" "}
                <T color={PALETTE.accent4}>normal</T> to the surface at the
                point of incidence all lie in the same plane — the{" "}
                <em>Plane of Incidence</em>:
              </p>

              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`\textcolor{${PALETTE.accent4}}{\vec{n}} \cdot (\textcolor{${PALETTE.accent1}}{\vec{i}} \times \textcolor{${PALETTE.accent5}}{\vec{r}}) = 0`}
                />
              </div>

              <Legend
                items={[
                  { color: PALETTE.accent4, math: "\\vec{n}", label: "Normal vector" },
                  { color: PALETTE.accent1, math: "\\vec{i}", label: "Incident ray" },
                  { color: PALETTE.accent5, math: "\\vec{r}", label: "Reflected ray" },
                ]}
              />
            </EqCard>
          </div>

          {/* Video */}
          <div
            className="w-full lg:w-1/2 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <video
              src="/idklol.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover"
              style={{ background: "#262626" }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════════════
          FLAT MIRROR
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="my-20 sm:my-28 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* Left: text column */}
        <div className="w-full lg:w-[44%] flex flex-col gap-10">

          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: PALETTE.accent3 }}
            >
              Second Law
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Light Reflection
            </h2>
          </div>

          {/* Second law */}
          <div className="space-y-5">
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              When a ray of light strikes a smooth surface like a mirror, it
              reflects back into the same medium following a simple geometric
              rule — the <em>law of reflection</em>:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-3xl">
                <Math
                  math={String.raw`\textcolor{${PALETTE.accent1}}{\theta_i} = \textcolor{${PALETTE.accent2}}{\theta_{re}}`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent1, math: "\\theta_i",    label: "Incident Angle" },
                  { color: PALETTE.accent2, math: "\\theta_{re}", label: "Reflected Angle" },
                ]}
              />
            </EqCard>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              This law tells us that light reflects symmetrically with respect
              to the <T color={PALETTE.accent4}>normal line</T> — the line
              perpendicular to the surface at the point of contact. Light
              arrives, interacts, and leaves at the same{" "}
              <T color={PALETTE.accent1}>incident angle</T> it came in, but on
              the opposite side of the <T color={PALETTE.accent4}>normal</T>.
              This symmetry is why mirrors produce predictable images and why a
              laser reflects so cleanly from a flat surface.
            </p>
          </div>

          {/* Vector form */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold" style={{ color: PALETTE.accent3 }}>
              Computing Reflection (Vector Form)
            </h3>
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Instead of measuring angles, computers use the{" "}
              <strong>Vector Reflection Formula</strong>. Given the{" "}
              <T color={PALETTE.accent1}>incoming light vector</T> and the
              mirror&apos;s <T color={PALETTE.accent4}>normal vector</T>, the{" "}
              <T color={PALETTE.accent5}>outgoing ray</T> is:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`\textcolor{${PALETTE.accent5}}{\vec{r}} = \textcolor{${PALETTE.accent1}}{\vec{i}} - 2(\textcolor{${PALETTE.accent1}}{\vec{i}} \cdot \textcolor{${PALETTE.accent4}}{\hat{n}})\textcolor{${PALETTE.accent4}}{\hat{n}}`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent5, math: "\\vec{r}", label: "Reflected direction vector" },
                  { color: PALETTE.accent1, math: "\\vec{i}", label: "Incident direction vector" },
                  { color: PALETTE.accent4, math: "\\hat{n}", label: "Unit normal vector of the surface" },
                ]}
              />
            </EqCard>
          </div>

          {/* Wave model */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold" style={{ color: PALETTE.accent3 }}>
              The Wave Model of Light
            </h3>
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              While we often draw light as straight geometric &ldquo;rays&rdquo; to
              calculate angles easily, light actually travels as an oscillating
              electromagnetic wave. We can describe the displacement of this
              wave over time and distance using the standard wave equation:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`y(x, t) = \textcolor{${PALETTE.accent1}}{A} \sin(\textcolor{${PALETTE.accent4}}{k}x - \textcolor{${PALETTE.accent6}}{\omega} t)`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent1, math: "A",        label: "Amplitude — height of the wave" },
                  { color: PALETTE.accent4, math: "k",        label: "Wavenumber — how tight the peaks are" },
                  { color: PALETTE.accent6,        math: "\\omega",  label: "Angular frequency — how fast it pulses" },
                ]}
              />
            </EqCard>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              When the wave hits the mirror, its continuous phase reflects
              perfectly. Because it stays in the same medium (like air), its{" "}
              <T color={PALETTE.accent6}>angular frequency</T> and speed remain
              completely unchanged.
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              {[
                { label: "Ray Model",  value: false },
                { label: "Wave Model", value: true },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setShowWave(value)}
                  className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                  style={
                    showWave === value
                      ? {
                          background: PALETTE.accent3,
                          color: "#111",
                          boxShadow: "0 4px 0 #b89b00",
                        }
                      : {
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.6)",
                          boxShadow: "0 4px 0 rgba(0,0,0,0.3)",
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.4)" }}>
              Click the buttons above to toggle the view in the playground.
            </p>
          </div>
        </div>

        {/* Right: playground */}
        <div className="w-full lg:w-[56%] flex items-start justify-center">
          <FlatMirrorReflectionPlayground width={780} height={800} showWave={showWave} />
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════════════
          CONVEX MIRROR
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="my-20 sm:my-28 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        <div className="w-full lg:w-[44%] flex flex-col gap-10">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: PALETTE.accent3 }}
            >
              Curved Mirrors
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              The Convex Mirror
            </h2>
          </div>

          <div className="space-y-5">
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              What happens when the mirror isn&apos;t flat? In a{" "}
              <strong>Convex Mirror</strong> — a surface that bulges outward
              towards the light source — the basic Law of Reflection still
              applies perfectly. However, the{" "}
              <T color={PALETTE.accent4}>normal</T> line is no longer pointing
              in one uniform direction.
            </p>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              For a spherical curved mirror, the{" "}
              <T color={PALETTE.accent4}>normal vector</T> is found by drawing a
              straight line from the mirror&apos;s{" "}
              <T color={PALETTE.accent6}>Center of Curvature C</T> to the exact point
              where the light hits the surface,{" "}
              <T color={PALETTE.accent1}>P<sub>hit</sub></T>:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`\textcolor{${PALETTE.accent4}}{\hat{n}} = \frac{\textcolor{${PALETTE.accent1}}{P_{hit}} - \textcolor{${PALETTE.accent6}}{C}}{||\textcolor{${PALETTE.accent1}}{P_{hit}} - \textcolor{${PALETTE.accent6}}{C}||}`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent4, math: "\\hat{n}", label: "Normal vector at the hit point" },
                  { color: PALETTE.accent1, math: "P_{hit}",  label: "Point where the ray hits the surface" },
                  { color: PALETTE.accent6,        math: "C",        label: "Center of Curvature" },
                ]}
              />
            </EqCard>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Because the <T color={PALETTE.accent4}>normal</T> angles outward
              depending on where the ray strikes, incoming parallel rays will
              bounce outward in different directions — they{" "}
              <strong>diverge</strong>. This divergence is exactly why convex
              mirrors make objects appear smaller but give a much wider field of
              view, making them perfect for security mirrors in stores and the
              passenger-side mirrors on cars.
            </p>
          </div>

          <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.4)" }}>
            Try moving the laser up and down to see how the curved normal changes
            the reflection.
          </p>
        </div>

        <div className="w-full lg:w-[56%] flex items-start justify-center">
          <ConvexMirrorReflectionPlayground
            width={760}
            height={620}
            module={"ahhh"}
            showWave={false}
          />
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════════════
          CONCAVE MIRROR
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="my-20 sm:my-28 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        <div className="w-full lg:w-[44%] flex flex-col gap-10">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: PALETTE.accent3 }}
            >
              Curved Mirrors
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              The Concave Mirror
            </h2>
          </div>

          {/* Intro + focal length */}
          <div className="space-y-5">
            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Now flip the curve. A <strong>Concave Mirror</strong> — a surface
              that curves <em>inward</em>, like the inside of a bowl — follows
              the exact same Law of Reflection. But because the normals now
              angle <em>inward</em>, instead of diverging, the reflected rays{" "}
              <strong>converge</strong>.
            </p>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Every ray arriving parallel to the optical axis reflects and passes
              through a single <strong>Focal Point (F)</strong>. The{" "}
              <T color={PALETTE.accent2}>focal length</T>{" "}
              <Math math={`\\textcolor{${PALETTE.accent2}}{f}`} /> is directly
              tied to the mirror&apos;s{" "}
              <T color={PALETTE.accent5}>radius of curvature</T>{" "}
              <Math math={`\\textcolor{${PALETTE.accent5}}{R}`} />:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`\textcolor{${PALETTE.accent2}}{f} = \frac{\textcolor{${PALETTE.accent5}}{R}}{2}`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent2, math: "f", label: "Focal length" },
                  { color: PALETTE.accent5, math: "R", label: "Radius of curvature" },
                ]}
              />
            </EqCard>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              This convergence makes concave mirrors extremely powerful — used in{" "}
              <strong>telescopes</strong> to gather and focus starlight, in{" "}
              <strong>satellite dishes</strong> to focus incoming signals, and in{" "}
              <strong>makeup mirrors</strong> that magnify your face because an
              object placed closer than the focal point produces a large, upright,
              virtual image.
            </p>
          </div>

          {/* Mirror equation */}
          <div className="space-y-5">
            <h3 className="text-xl font-semibold" style={{ color: PALETTE.accent3 }}>
              The Mirror Equation
            </h3>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Knowing that rays converge isn&apos;t enough — we also want to
              know <em>where</em> the image forms. The{" "}
              <strong>Mirror Equation</strong> relates the{" "}
              <T color={PALETTE.accent2}>focal length</T> to the distances of
              the object and image from the mirror&apos;s surface:
            </p>

            <EqCard>
              <div className="flex justify-center py-1 text-2xl">
                <Math
                  math={String.raw`\frac{1}{\textcolor{${PALETTE.accent2}}{f}} = \frac{1}{\textcolor{${PALETTE.accent3}}{d_o}} + \frac{1}{\textcolor{${PALETTE.accent5}}{d_i}}`}
                />
              </div>
              <Legend
                items={[
                  { color: PALETTE.accent2, math: "f",   label: "Focal length of the mirror" },
                  { color: PALETTE.accent3, math: "d_o", label: "Object distance from the mirror" },
                  { color: PALETTE.accent5, math: "d_i", label: "Image distance from the mirror" },
                ]}
              />
            </EqCard>

            <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              When <T color={PALETTE.accent5}>d<sub>i</sub></T> comes out
              positive, the image forms in front of the mirror — a{" "}
              <strong>real image</strong> you could project onto a screen. When
              it comes out negative, the image is behind the mirror — a{" "}
              <strong>virtual image</strong>, like the one you see in a flat
              mirror.
            </p>
          </div>

          <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.4)" }}>
            Move the laser toward and away from the focal point — watch what
            happens to where the reflected rays meet.
          </p>
        </div>

        <div className="w-full lg:w-[56%] flex items-start justify-center">
          <ConcaveMirrorReflectionPlayground
            width={760}
            height={620}
            module={"concave"}
            showWave={false}
          />
        </div>
      </section>

      <Divider />

      {/* ══════════════════════════════════════════════════════════════════════
          CONCLUSION
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="my-20 sm:my-28 max-w-3xl mx-auto text-center space-y-5">
        <p className="leading-relaxed text-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
          Together, the laws of reflection fully describe how light behaves when
          it encounters any smooth surface — whether perfectly flat or curved.
          As we have seen, whether we model light as a simple geometric ray or
          an oscillating wave, these fundamental rules allow us to accurately
          predict the direction of reflected light and construct precise optical
          models.
        </p>
        <p className="leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          In this article, these physical laws and vector mathematics are
          applied in real time to trace light paths as they interact with
          different reflective surfaces — showing that even the most advanced
          optical systems are built upon remarkably simple physical principles.
        </p>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex justify-end pb-16">
        <Link
          href="/lessons/reflection-of-light/reflection-of-light-MCQ"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold uppercase tracking-wider text-black transition-all hover:brightness-110 active:translate-y-0.5"
          style={{
            background: PALETTE.accent3,
            boxShadow: "0 4px 0 #b89b00",
          }}
        >
          Practice Reflection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}