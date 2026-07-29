export function BrandWordmark({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-5 w-[3.75rem]" : "h-6 w-[4.5rem]";

  return (
    <span className={`inline-flex shrink-0 items-center ${sizeClass} ${className}`}>
      <img
        src="/images/yesulin-wordmark.png"
        alt="예술IN"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
