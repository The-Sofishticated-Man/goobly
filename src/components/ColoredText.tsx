export default function ColoredText({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span style={{ color }} className="font-semibold">
      {children}
    </span>
  );
}
