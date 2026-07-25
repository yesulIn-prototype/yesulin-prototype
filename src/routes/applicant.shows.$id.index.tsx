import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useStore, daysUntil } from "@/lib/store";
import { Poster } from "@/components/poster";
import { DeadlineBadge } from "@/components/status-badge";
import {
  AlertCircle,
  CalendarDays,
  MapPin,
  Users2,
  Coins,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/applicant/shows/$id/")({
  component: ShowDetail,
});

function ShowDetail() {
  const { id } = Route.useParams();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const myApp = useStore((s) =>
    s.applications.find((a) => a.showId === id && a.applicantId === "me"),
  );

  if (!show) throw notFound();
  const isOpen = show.status === "모집 중";

  return (
    <div className="space-y-6">
      <Link
        to="/applicant/shows"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> 공연 목록으로
      </Link>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Poster
          title={show.title}
          color={show.posterColor}
          image={show.posterImage}
          kind={show.kind}
          className="h-56 lg:h-full"
        />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {show.kind}
            </span>
            {show.status === "모집 중" ? (
              <DeadlineBadge daysLeft={daysUntil(show.deadline)} />
            ) : (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{show.status}</span>
            )}
            {myApp && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                <CheckCircle2 className="h-3 w-3" /> 지원 완료
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{show.title}</h1>
          <div className="mt-1 text-sm text-muted-foreground">{show.producer}</div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{show.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={CalendarDays} label="지원 마감" value={show.deadline} />
            <InfoRow icon={CalendarDays} label="오디션 일정" value={show.auditionDate} />
            <InfoRow icon={CalendarDays} label="연습 기간" value={show.rehearsalPeriod} />
            <InfoRow icon={CalendarDays} label="공연 기간" value={show.showPeriod} />
            <InfoRow icon={MapPin} label="공연 장소" value={show.venue} />
            <InfoRow icon={Coins} label="보상" value={show.compensation} />
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <Users2 className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">모집 배역</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {show.roles.map((r) => (
            <div key={r.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{r.name}</div>
                {r.allowMultiple && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                    복수 지원 가능
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              {r.requirements && (
                <div className="mt-2 text-xs text-muted-foreground">
                  지원 조건: {r.requirements}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <RequirementCard title="필수 제출 항목" items={show.requiredItems} required />
        <RequirementCard title="선택 제출 항목" items={show.optionalItems} />
      </section>

      <div className="sticky bottom-[5.4rem] z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-elev-3)] backdrop-blur md:bottom-4">
        <div className="text-sm">
          <div className="font-medium">
            {myApp ? "이미 지원한 공연입니다" : "저장된 프로필과 자료로 바로 지원할 수 있습니다"}
          </div>
          <div className="text-xs text-muted-foreground">
            {isOpen
              ? `지원 마감 ${show.deadline} (D-${daysUntil(show.deadline)})`
              : `${show.deadline}에 마감된 공고입니다`}
          </div>
        </div>
        {myApp ? (
          <Link
            to="/applicant/applications"
            className="rounded-md border border-input bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary"
          >
            제출한 지원서 보기
          </Link>
        ) : isOpen ? (
          <Link
            to="/applicant/shows/$id/apply"
            params={{ id: show.id }}
            className="w-full rounded-md bg-primary px-5 py-2.5 text-center text-sm font-medium text-primary-foreground shadow hover:opacity-90 sm:w-auto"
          >
            지원서 작성하기
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-muted px-5 py-2.5 text-sm font-medium text-muted-foreground sm:w-auto"
          >
            <AlertCircle className="h-4 w-4" /> 지원이 마감되었습니다
          </button>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/70 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function RequirementCard({
  title,
  items,
  required,
}: {
  title: string;
  items: { key: string; label: string; note?: string }[];
  required?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.length === 0 && (
          <li className="text-xs text-muted-foreground">해당 항목이 없습니다.</li>
        )}
        {items.map((it) => (
          <li key={it.key} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${required ? "bg-destructive" : "bg-gold"}`}
            />
            <div>
              <div>{it.label}</div>
              {it.note && <div className="text-xs text-muted-foreground">{it.note}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
