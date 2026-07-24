import type { ApplyStatus, ReviewStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

type BadgeStyle = { chip: string; dot: string };

const applyMap: Record<ApplyStatus, BadgeStyle> = {
  "작성 중": {
    chip: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground/60",
  },
  "지원 완료": { chip: "bg-success/10 text-success border-success/25", dot: "bg-success" },
  "서류 확인": {
    chip: "bg-secondary text-secondary-foreground border-border",
    dot: "bg-primary/70",
  },
  "오디션 예정": { chip: "bg-gold/15 text-gold-foreground border-gold/35", dot: "bg-gold" },
  "결과 발표": { chip: "bg-primary/10 text-primary border-primary/25", dot: "bg-primary" },
};

const reviewMap: Record<ReviewStatus, BadgeStyle> = {
  미확인: { chip: "bg-warning/12 text-warning-foreground border-warning/35", dot: "bg-warning" },
  "검토 중": { chip: "bg-secondary text-secondary-foreground border-border", dot: "bg-primary/60" },
  "오디션 대상": { chip: "bg-success/12 text-success border-success/30", dot: "bg-success" },
  보류: { chip: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground/60" },
  합격: { chip: "bg-primary text-primary-foreground border-primary", dot: "bg-primary-foreground" },
  불합격: {
    chip: "bg-destructive/10 text-destructive border-destructive/25",
    dot: "bg-destructive",
  },
};

function BadgeShell({
  style,
  label,
  className,
}: {
  style: BadgeStyle;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-none",
        style.chip,
        className,
      )}
    >
      <span aria-hidden className={cn("inline-block h-1.5 w-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}

export function ApplyBadge({ status, className }: { status: ApplyStatus; className?: string }) {
  return <BadgeShell style={applyMap[status]} label={status} className={className} />;
}

export function ReviewBadge({ status, className }: { status: ReviewStatus; className?: string }) {
  return <BadgeShell style={reviewMap[status]} label={status} className={className} />;
}

export function DeadlineBadge({ daysLeft }: { daysLeft: number }) {
  if (daysLeft < 0)
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium leading-none text-muted-foreground">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        마감
      </span>
    );
  const urgent = daysLeft <= 7;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-none tabular-nums",
        urgent
          ? "border-destructive/25 bg-destructive/10 text-destructive"
          : "border-gold/35 bg-gold/15 text-gold-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", urgent ? "bg-destructive" : "bg-gold")}
      />
      D-{daysLeft}
    </span>
  );
}
