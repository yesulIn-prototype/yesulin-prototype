export function BrandMark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-8 w-16 rounded-lg" : "h-9 w-[4.5rem] rounded-xl";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-white px-1.5 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.1)] ring-1 ring-black/10 ${sizeClass} ${className}`}
      aria-hidden="true"
    >
      <img
        src="/images/yesulin-logo-mark.png"
        alt=""
        className="h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
