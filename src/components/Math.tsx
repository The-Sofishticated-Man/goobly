import 'katex/dist/katex.min.css'; // Import CSS once here or in layout
import katex from 'katex';
import 'katex/dist/katex.min.css';

type MathProps = {
  math: string;
  block?: boolean; // true for block (centered), false for inline
};

export default function Math({ math, block = false }: MathProps) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: block, // This handles the block vs inline rendering
  });

  return (
    <span 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}