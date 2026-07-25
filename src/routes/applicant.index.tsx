import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, daysUntil, findShow, findRole } from "@/lib/store";
import { ApplyBadge } from "@/components/status-badge";
import { Poster } from "@/components/poster";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

export const Route = createFileRoute("/applicant/")({
  component: ApplicantHome,
});

type EventKind = "지원 마감" | "오디션" | "연습" | "공연" | "결과 발표";
type CalEvent = { kind: EventKind; date: string; showTitle: string; role: string; showId: string };

const KIND_META: Record<EventKind, { color: string; dot: string }> = {
  "지원 마감": { color: "bg-destructive/10 text-destructive", dot: "bg-destructive" },
  오디션: { color: "bg-gold/20 text-gold-foreground", dot: "bg-gold" },
  연습: { color: "bg-secondary text-secondary-foreground", dot: "bg-muted-foreground" },
  공연: { color: "bg-success/15 text-success", dot: "bg-success" },
  "결과 발표": { color: "bg-primary/10 text-primary", dot: "bg-primary" },
};

// "YYYY.MM.DD" -> Date
function parseDate(s: string) {
  const [y, m, d] = s.split(".").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}
function keyOf(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function ApplicantHome() {
  const applicant = useStore((s) => s.applicant);
  const allApps = useStore((s) => s.applications);
  const applications = allApps.filter((a) => a.applicantId === "me");
  const shows = useStore((s) => s.shows);

  const reviewing = applications.filter(
    (a) => a.reviewStatus === "검토 중" || a.reviewStatus === "미확인",
  ).length;
  const audition = applications.filter(
    (a) => a.applyStatus === "오디션 예정" || a.reviewStatus === "오디션 대상",
  ).length;
  const results = applications.filter((a) => a.applyStatus === "결과 발표").length;

  // Aggregate events from my applications
  const events: CalEvent[] = useMemo(() => {
    const list: CalEvent[] = [];
    for (const app of applications) {
      const show = findShow(app.showId);
      if (!show) continue;
      const roleNames = app.roleIds
        .map((rid) => findRole(show, rid)?.name)
        .filter(Boolean)
        .join(", ");
      list.push({
        kind: "지원 마감",
        date: show.deadline,
        showTitle: show.title,
        role: roleNames,
        showId: show.id,
      });
      list.push({
        kind: "오디션",
        date: show.auditionDate,
        showTitle: show.title,
        role: roleNames,
        showId: show.id,
      });
      const rStart = show.rehearsalPeriod.split(" – ")[0];
      list.push({
        kind: "연습",
        date: rStart,
        showTitle: show.title,
        role: roleNames,
        showId: show.id,
      });
      const sStart = show.showPeriod.split(" – ")[0];
      list.push({
        kind: "공연",
        date: sStart,
        showTitle: show.title,
        role: roleNames,
        showId: show.id,
      });
    }
    // Also include deadlines of open shows I've NOT applied to (soon-closing)
    for (const show of shows) {
      if (show.status !== "모집 중") continue;
      if (applications.some((a) => a.showId === show.id)) continue;
      list.push({
        kind: "지원 마감",
        date: show.deadline,
        showTitle: show.title,
        role: "미지원",
        showId: show.id,
      });
    }
    return list;
  }, [applications, shows]);

  const today = new Date(2026, 6, 14);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(keyOf(today));

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalEvent[]> = {};
    for (const e of events) (map[e.date] ??= []).push(e);
    return map;
  }, [events]);

  const monthDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: Array<{ date: Date | null; key: string | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      cells.push({ date: dt, key: keyOf(dt) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, key: null });
    return cells;
  }, [cursor]);

  const selectedEvents = selected ? (eventsByDay[selected] ?? []) : [];
  const recent = applications.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Hero: next action first, supporting image and status second */}
      <section className="grid overflow-hidden rounded-[1.5rem] bg-primary text-primary-foreground shadow-[var(--shadow-elev-2)] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="relative flex flex-col justify-between p-6 md:p-10 lg:min-h-[390px]">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.24em] opacity-70">
              <span className="inline-block h-px w-6 bg-gold/70" />
              오늘의 워크스페이스
            </div>
            <h1 className="mt-3 font-display text-3xl leading-[1.1] md:text-5xl">
              안녕하세요, <span className="text-gold">{applicant.name}</span> 님
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed opacity-80 md:text-base">
              오늘도 잘 맞는 공연을 찾아 지원해 보세요. 한 번 등록한 자료는 계속 재사용할 수
              있습니다.
            </p>
            <Link
              to="/applicant/shows"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground shadow-[0_10px_30px_-8px_rgba(199,210,40,0.38)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(199,210,40,0.5)]"
            >
              <Search className="h-4 w-4" /> 새로운 공연 찾기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-3 gap-2">
            <MiniStat label="검토 중" value={reviewing} />
            <MiniStat label="오디션 예정" value={audition} />
            <MiniStat label="결과 발표" value={results} />
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden lg:min-h-full">
          <img
            src="/images/editorial/dashboard-applicant.jpg"
            alt="연습실에서 안무를 연습하는 배우"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent lg:from-black/55" />
          <div className="absolute bottom-5 right-5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
            Keep moving forward
          </div>
        </div>
      </section>

      {/* Main: calendar + my applications */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <h2 className="text-base font-semibold">일정 캘린더</h2>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                  }
                  className="rounded-md p-1.5 hover:bg-secondary"
                  aria-label="이전 달"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="min-w-[92px] text-center text-sm font-medium">
                  {cursor.getFullYear()}년 {cursor.getMonth() + 1}월
                </div>
                <button
                  onClick={() =>
                    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                  }
                  className="rounded-md p-1.5 hover:bg-secondary"
                  aria-label="다음 달"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-3 py-3">
              <div className="grid grid-cols-7 text-center text-[11px] font-medium text-muted-foreground">
                {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((c, i) => {
                  if (!c.date) return <div key={i} className="h-14 rounded-md" />;
                  const isToday = keyOf(today) === c.key;
                  const isSelected = selected === c.key;
                  const dayEvents = eventsByDay[c.key!] ?? [];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelected(c.key)}
                      className={`relative flex h-14 flex-col items-start rounded-md border p-1.5 text-left transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : isToday
                            ? "border-primary/40 bg-primary/[0.03]"
                            : "border-transparent hover:bg-secondary"
                      }`}
                    >
                      <span className={`text-xs font-medium ${isToday ? "text-primary" : ""}`}>
                        {c.date.getDate()}
                      </span>
                      <div className="mt-auto flex gap-0.5">
                        {Array.from(new Set(dayEvents.map((e) => e.kind)))
                          .slice(0, 4)
                          .map((k) => (
                            <span
                              key={k}
                              className={`h-1.5 w-1.5 rounded-full ${KIND_META[k].dot}`}
                            />
                          ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              {(Object.keys(KIND_META) as EventKind[]).map((k) => (
                <span key={k} className="inline-flex items-center gap-1">
                  <span className={`h-2 w-2 rounded-full ${KIND_META[k].dot}`} />
                  {k}
                </span>
              ))}
            </div>

            {/* Selected day details */}
            <div className="border-t border-border p-4">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {selected ?? "날짜를 선택하세요"} 일정
              </div>
              {selectedEvents.length === 0 ? (
                <div className="rounded-md bg-secondary/40 p-4 text-sm text-muted-foreground">
                  현재 예정된 일정이 없습니다.
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedEvents.map((e, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-md border border-border bg-background p-2.5"
                    >
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${KIND_META[e.kind].color}`}
                      >
                        {e.kind}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{e.showTitle}</div>
                        <div className="truncate text-[11px] text-muted-foreground">{e.role}</div>
                      </div>
                      <Link
                        to="/applicant/shows/$id"
                        params={{ id: e.showId }}
                        className="shrink-0 text-xs font-medium text-primary hover:underline"
                      >
                        보기
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* My applications */}
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-semibold">내 지원 현황</h2>
              <p className="mt-1 text-xs text-muted-foreground">최근 제출한 지원서</p>
            </div>
            <Link
              to="/applicant/applications"
              className="text-xs font-medium text-primary hover:underline"
            >
              전체 지원 현황 보기 →
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {recent.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                아직 지원한 공연이 없습니다.
              </div>
            )}
            {recent.map((app) => {
              const show = findShow(app.showId);
              if (!show) return null;
              const roleName = app.roleIds.map((r) => findRole(show, r)?.name).join(", ");
              // Next upcoming event
              const candidates = [
                { kind: "오디션", date: show.auditionDate },
                { kind: "연습 시작", date: show.rehearsalPeriod.split(" – ")[0] },
                { kind: "공연 시작", date: show.showPeriod.split(" – ")[0] },
              ];
              const next = candidates.find((c) => parseDate(c.date) >= today);
              return (
                <div key={app.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{show.title}</div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {roleName} · {app.submittedAt.split(" ")[0]} 지원
                      </div>
                    </div>
                    <ApplyBadge status={app.applyStatus} />
                  </div>
                  {next && (
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      다음 일정: {next.kind} · {next.date}
                    </div>
                  )}
                  <Link
                    to="/applicant/applications"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    지원서 보기 <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommended shows (single entry, no duplicated CTA) */}
      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold">모집 중인 추천 공연</h2>
            <p className="mt-1 text-xs text-muted-foreground">지금 지원할 수 있는 공연</p>
          </div>
          <Link to="/applicant/shows" className="text-xs font-medium text-primary hover:underline">
            더 보기 →
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shows
            .filter((s) => s.status === "모집 중")
            .slice(0, 3)
            .map((show) => (
              <Link
                key={show.id}
                to="/applicant/shows/$id"
                params={{ id: show.id }}
                className="group grid min-h-36 grid-cols-[104px_1fr] overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <Poster
                  title={show.title}
                  color={show.posterColor}
                  image={show.posterImage}
                  kind={show.kind}
                  className="h-full rounded-none"
                />
                <div className="flex min-w-0 flex-col p-4">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {show.producer}
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold">{show.title}</div>
                  <div className="mt-2 text-xs leading-5 text-muted-foreground">
                    마감 {show.deadline}
                    <br />
                    오디션 {show.auditionDate}
                  </div>
                  <div className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-primary">
                    자세히 보기 <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/8 p-3.5 backdrop-blur-sm">
      <div className="text-[10px] font-medium uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-display text-3xl leading-none tabular-nums">{value}</span>
        <span className="text-xs opacity-80">건</span>
      </div>
    </div>
  );
}
