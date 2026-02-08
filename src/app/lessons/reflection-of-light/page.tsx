"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Playground from "@/components/Playground";
import Image from 'next/image';
import Math from '@/components/Math';

const markdown = `
## Reflection of Light

When a ray of light strikes a mirror, the **angle of incidence** equals the **angle of reflection**.

$$
\\theta_i = \\theta_{re}
$$

Below is an interactive visualization.
`;

export default function ReflectionLesson() {
  return (
    <main className="mx-auto space-y-8 p-8">
      <div className="lesson-container max-w-3xl mx-auto">
        <h1>LIGHT REFLECTION</h1>
        <h2>reflection on a Plan miror</h2>
        <p>
          Light reflection is a basic yet fascinating concept in Geometrical
          Optics. It shows how light bounces off surfaces like mirrors or metals,
          following simple laws we can see in everyday life. Despite its
          simplicity, reflection helps us understand how light interacts with its
          surroundings and how images are formed from a calm lake to a laser
          hitting a mirror, it's all governed by the same rules.<br /><br />

          Even with modern advances like lasers, fiber optics, and holography,
          reflection remains central. It's used in telescopes, cameras, and many
          optical instruments. Understanding it isn't just about formulas, it's
          about predicting and controlling light, showing how elegantly simple
          physics can be.
        </p>
        <h3 className="text-yellow-400">Let's explore details</h3>
        <p>
          When light strikes a reflective surface, its behavior is described by the
          Two Laws of Reflection, also known as the first and second laws of Snell-
          Descartes.
        </p>


      </div>
      <div className={"flex items-center justify-between "}>
        <div>
          <h3 className="text-yellow-400">First law of Reflection</h3>
          <p>
            The incident ray, the refracted ray, and the normal to the surface at the
            point of incidence all lie in the same plane, named the Incidence plane,<br />
            presented such as:
            <br /><br />
          </p>
          <div className="text-2xl mx-40 ">
            <Math math={String.raw`\textcolor{#ff6b6b}{\vec{n}} \cdot (\textcolor{#feca57}{\vec{i}} \times \textcolor{#feca57}{\vec{r}}) = 0`} />
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li><Math math={String.raw`\textcolor{#ff6b6b}{\vec{n}}`} /> Normal vector</li>
            <li><Math math={String.raw`\textcolor{#feca57}{\vec{i}}`} /> Incident ray</li>
            <li><Math math={String.raw`\textcolor{#feca57}{\vec{r}}`} /> Reflected ray</li>
          </ul>
        </div>
        <Image
          src="/sample.png"    // Path starts from the public folder
          alt="Sample Image"   // Always include alt text for accessibility
          width={500}          // Desired width in pixels
          height={300}         // Desired height in pixels
          priority             // Optional: loads the image faster if it's "above the fold"
        />
      </div>

      <Playground module="ahhhh" />
    </main>
  );
}
