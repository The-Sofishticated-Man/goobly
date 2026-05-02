import Math from "@/components/Math";
import ColoredText from "@/components/ColoredText";

export default function Legend({
  items,
}: {
  items: { color: string; math: string; label: string }[];
}) {
  return (
    <ul
      className="mt-5 space-y-2 text-sm"
      style={{
        color: "rgba(255,255,255,0.7)",
      }}
    >
      {items.map(({ color, math, label }) => (
        <li key={label} className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: color,
            }}
          />
          <span>
            <Math math={`\\textcolor{${color}}{${math}}`} /> —{" "}
            <ColoredText color={color}>{label}</ColoredText>
          </span>
        </li>
      ))}
    </ul>
  );
}
