"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import Playground from "@/components/Playground";
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
    <main className="mx-auto max-w-3xl space-y-8 p-8">
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {markdown}
        </ReactMarkdown>
      </article>

      <Playground module="ahhhh" />
      <article className="prose prose-invert max-w-none">
        <ReactMarkdown>
          {`# As you rotate the laser, notice how the reflection angle changes symmetrically.`}
        </ReactMarkdown>
      </article>
    </main>
  );
}
