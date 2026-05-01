export default function Divider() {
  return (
    <div className="flex w-full items-center gap-[clamp(8px,2vw,12px)] py-[clamp(12px,3vw,20px)]">
      <span className="h-[2px] w-[clamp(30px,8vw,50px)] bg-[var(--accent)]"></span>
      <span className="h-[clamp(8px,1.5vw,10px)] w-[clamp(8px,1.5vw,10px)] shrink-0 rounded-full bg-[var(--accent)]"></span>
      <span className="h-[2px] flex-grow bg-[var(--accent)]"></span>
      <span className="h-[clamp(8px,1.5vw,10px)] w-[clamp(8px,1.5vw,10px)] shrink-0 rounded-full bg-[var(--accent)]"></span>
      <span className="h-[2px] w-[clamp(30px,8vw,50px)] bg-[var(--accent)]"></span>
    </div>
  );
}
