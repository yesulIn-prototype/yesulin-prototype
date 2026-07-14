export function Poster({ title, color, className = "" }: { title: string; color: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-lg ${className}`}
      style={{ background: `linear-gradient(135deg, ${color} 0%, #1a1220 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.15) 0%, transparent 40%)",
        }}
      />
      <div className="relative z-10 p-4">
        <div className="text-[10px] tracking-[0.3em] text-white/60 uppercase">Musical</div>
        <div className="mt-1 text-lg font-semibold leading-tight text-white">{title}</div>
      </div>
    </div>
  );
}

export function PhotoTile({ color, label, className = "" }: { color: string; label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-md ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, #1a1220)`,
        aspectRatio: "3/4",
      }}
    >
      <span className="text-[10px] font-medium tracking-widest text-white/70 uppercase">{label}</span>
    </div>
  );
}

export function VideoTile({ color, duration, className = "" }: { color: string; duration: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-md ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, #0f0a15)`,
        aspectRatio: "16/9",
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-current">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="absolute bottom-1.5 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
        {duration}
      </span>
    </div>
  );
}
