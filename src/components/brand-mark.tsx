export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-8 w-8 rounded-[0.6rem]" : "h-9 w-9 rounded-[0.7rem]";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-[#111] shadow-[0_5px_16px_rgba(0,0,0,0.2)] ring-1 ring-black/10 ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 32" className="h-[72%] w-[72%]" fill="none">
        <rect
          x="3.75"
          y="3.75"
          width="24.5"
          height="24.5"
          rx="7"
          stroke="white"
          strokeOpacity="0.14"
          strokeWidth="1.5"
        />
        <path d="M9.5 9v14" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <path
          d="M15.5 23V9l7 14V9"
          stroke="#F7FF54"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
