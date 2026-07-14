import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, daysUntil, findShow, findRole } from "@/lib/store";
import { ApplyBadge, DeadlineBadge } from "@/components/status-badge";
import { Poster } from "@/components/poster";
import { Calendar, CheckCircle2, Clock, Search, User, ArrowRight, CalendarClock, Mic2, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/applicant/")({
  component: ApplicantHome,
});

function ApplicantHome() {
  const applicant = useStore((s) => s.applicant);
  const applications = useStore((s) => s.applications.filter((a) => a.applicantId === "me"));
  const shows = useStore((s) => s.shows);

  const submitted = applications.length;
  const upcoming = shows.filter((s) => s.status === "모집 중" && daysUntil(s.deadline) >= 0).length;
  const nearestDeadline = shows
    .filter((s) => s.status === "모집 중" && daysUntil(s.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))[0];
  const upcomingAuditions = applications.filter((a) => a.applyStatus === "오디션 예정").length;

  // Build combined schedule
  type Event = { kind: "지원 마감" | "오디션" | "연습" | "공연"; date: string; showTitle: string; role: string };
  const events: Event[] = [];
  for (const app of applications) {
    const show = findShow(app.showId);
    if (!show) continue;
    const roleNames = app.roleIds.map((rid) => findRole(show, rid)?.name).filter(Boolean).join(", ");
    events.push({ kind: "지원 마감", date: show.deadline, showTitle: show.title, role: roleNames });
    events.push({ kind: "오디션", date: show.auditionDate, showTitle: show.title, role: roleNames });
    events.push({ kind: "연습", date: show.rehearsalPeriod.split(" – ")[0], showTitle: show.title, role: roleNames });
    events.push({ kind: "공연", date: show.showPeriod.split(" – ")[0], showTitle: show.title, role: roleNames });
  }
  events.sort((a, b) => a.date.localeCompare(b.date));
  const upcomingEvents = events.filter((e) => daysUntil(e.date) >= -1).slice(0, 6);

  const recent = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-primary via-primary to-[#3a1a2c] p-6 text-primary-foreground md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest opacity-70">지원자 홈</div>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">안녕하세요, {applicant.name} 님</h1>
            <p className="mt-2 max-w-md text-sm opacity-80">
              한 번 등록한 자료로 오늘도 새로운 공연에 지원해 보세요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/applicant/shows"
              className="inline-flex items-center gap-1.5 rounded-md bg-gold px-4 py-2 text-sm font-medium text-gold-foreground shadow hover:opacity-90"
            >
              <Search className="h-4 w-4" /> 새 공연 찾아보기
            </Link>
            <Link
              to="/applicant/profile"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              <User className="h-4 w-4" /> 내 프로필 관리
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Search} label="지원 예정 공연" value={`${upcoming}건`} />
        <StatCard icon={CheckCircle2} label="지원 완료" value={`${submitted}건`} accent="success" />
        <StatCard
          icon={Clock}
          label="가까운 지원 마감"
          value={nearestDeadline ? `${nearestDeadline.title} · D-${daysUntil(nearestDeadline.deadline)}` : "-"}
          accent="warning"
        />
        <StatCard icon={Mic2} label="예정된 오디션" value={`${upcomingAuditions}건`} accent="gold" />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionHeader
            icon={CalendarClock}
            title="다가오는 일정"
            hint="지원 마감·오디션·연습·공연 일정을 통합해서 보여줍니다"
          />
          <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {upcomingEvents.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">예정된 일정이 없습니다.</div>
            )}
            {upcomingEvents.map((e, i) => {
              const d = daysUntil(e.date);
              return (
                <div key={i} className="flex items-center gap-4 p-4">
                  <EventKindPill kind={e.kind} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{e.showTitle}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {e.role || "배역 미지정"} · {e.date}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      d < 0
                        ? "bg-muted text-muted-foreground"
                        : d <= 7
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {d < 0 ? "지남" : `D-${d}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          <SectionHeader icon={FileIcon} title="최근 지원" hint="내가 최근에 제출한 지원서" />
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
              return (
                <div key={app.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{show.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {roleName} · {app.submittedAt.split(" ")[0]}
                      </div>
                    </div>
                    <ApplyBadge status={app.applyStatus} />
                  </div>
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

      <section>
        <SectionHeader icon={Search} title="모집 중인 공연" hint="지금 지원 가능한 공연" />
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {shows
            .filter((s) => s.status === "모집 중")
            .slice(0, 3)
            .map((show) => (
              <Link
                key={show.id}
                to="/applicant/shows/$id"
                params={{ id: show.id }}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Poster title={show.title} color={show.posterColor} className="h-32" />
                <div className="p-4">
                  <div className="text-xs text-muted-foreground">{show.producer}</div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-semibold">{show.title}</div>
                    <DeadlineBadge daysLeft={daysUntil(show.deadline)} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    마감 {show.deadline} · 오디션 {show.auditionDate}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: "gold" | "success" | "warning";
}) {
  const color =
    accent === "gold"
      ? "bg-gold/15 text-gold-foreground"
      : accent === "success"
        ? "bg-success/15 text-success"
        : accent === "warning"
          ? "bg-warning/15 text-warning-foreground"
          : "bg-primary/10 text-primary";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-lg font-semibold">{value}</div>
    </div>
  );
}

export function SectionHeader({
  icon: Icon,
  title,
  hint,
  right,
}: {
  icon: React.ElementType;
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

function EventKindPill({ kind }: { kind: string }) {
  const map: Record<string, string> = {
    "지원 마감": "bg-destructive/10 text-destructive",
    오디션: "bg-gold/20 text-gold-foreground",
    연습: "bg-secondary text-secondary-foreground",
    공연: "bg-success/15 text-success",
  };
  return (
    <span className={`inline-flex shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold ${map[kind]}`}>
      {kind}
    </span>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return <PlayCircle {...props} />;
}
