import type { ApplyStatus, ReviewStatus } from "@/lib/store";
import { cn } from "@/lib/utils";

const applyMap: Record<ApplyStatus, string> = {
  "작성 중": "bg-muted text-muted-foreground",
  "지원 완료": "bg-success/15 text-success",
  "서류 확인": "bg-secondary text-secondary-foreground",
  "오디션 예정": "bg-gold/20 text-gold-foreground",
  "결과 발표": "bg-primary/10 text-primary",
};

const reviewMap: Record<ReviewStatus, string> = {
  "미확인": "bg-warning/15 text-warning-foreground border border-warning/30",
  "검토 중": "bg-secondary text-secondary-foreground",
  "오디션 대상": "bg-success/15 text-success",
  "보류": "bg-muted text-muted-foreground",
  "탈락": "bg-destructive/10 text-destructive",
};

export function ApplyBadge({ status, className }: { status: ApplyStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", applyMap[status], className)}>
      {status}
    </span>
  );
}

export function ReviewBadge({ status, className }: { status: ReviewStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", reviewMap[status], className)}>
      {status}
    </span>
  );
}

export function DeadlineBadge({ daysLeft }: { daysLeft: number }) {
  if (daysLeft < 0)
    return <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">마감</span>;
  const urgent = daysLeft <= 7;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        urgent ? "bg-destructive/10 text-destructive" : "bg-gold/20 text-gold-foreground",
      )}
    >
      D-{daysLeft}
    </span>
  );
}
