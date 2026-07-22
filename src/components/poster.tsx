export function Poster({
  title,
  color,
  className = "",
  kind = "Musical",
}: {
  title: string;
  color: string;
  className?: string;
  kind?: string;
}) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-lg ${className}`}
      style={{
        backgroundImage: `linear-gradient(155deg, ${color} 0%, #1a1220 78%, #0d0810 100%)`,
      }}
    >
      {/* Subtle stage spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 22% 12%, rgba(255,255,255,0.28) 0%, transparent 45%), radial-gradient(circle at 78% 92%, rgba(255,220,180,0.14) 0%, transparent 45%)",
        }}
      />
      {/* Fine grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="relative z-10 flex w-full flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] text-white/60 uppercase">
          <span className="inline-block h-px w-6 bg-white/40" />
          {kind}
        </div>
        <div className="font-display text-lg leading-tight text-white">{title}</div>
      </div>
    </div>
  );
}

export function PhotoTile({ color, label, className = "" }: { color: string; label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-md ${className}`}
      style={{
        backgroundImage: `linear-gradient(160deg, ${color} 0%, #1a1220 100%)`,
        aspectRatio: "3/4",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22) 0%, transparent 55%)",
        }}
      />
      <span className="relative z-10 m-2 text-[10px] font-medium tracking-widest text-white/70 uppercase">
        {label}
      </span>
    </div>
  );
}

export function VideoTile({ color, duration, className = "" }: { color: string; duration: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-md ${className}`}
      style={{
        backgroundImage: `linear-gradient(160deg, ${color} 0%, #0f0a15 100%)`,
        aspectRatio: "16/9",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-primary shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="absolute bottom-1.5 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {duration}
      </span>
    </div>
  );
}
