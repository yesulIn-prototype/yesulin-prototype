import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, daysUntil } from "@/lib/store";
import { Poster } from "@/components/poster";
import { ReviewBadge } from "@/components/status-badge";
import { Film, Users, Eye, Mic2 } from "lucide-react";

export const Route = createFileRoute("/producer/")({
  component: ProducerHome,
});

function ProducerHome() {
  const shows = useStore((s) => s.shows);
  const applications = useStore((s) => s.applications);

  const activeShows = shows.filter((s) => s.status === "모집 중");
  const totalApplicants = applications.length;
  const unreviewed = applications.filter((a) => a.reviewStatus === "미확인").length;
  const auditionCount = applications.filter((a) => a.reviewStatus === "오디션 대상").length;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Producer Console
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">대시보드</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            공연별 지원자를 동일한 구조에서 확인할 수 있습니다.
          </p>
        </div>
        <Link
          to="/producer/create"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elev-1)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev-2)]"
        >
          + 새 공고 만들기
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Film} label="진행 중인 모집" value={`${activeShows.length}건`} />
        <Stat icon={Users} label="전체 지원자" value={`${totalApplicants}명`} />
        <Stat icon={Eye} label="미확인 지원자" value={`${unreviewed}명`} accent="warning" />
        <Stat icon={Mic2} label="예정된 오디션 대상" value={`${auditionCount}명`} accent="gold" />
      </div>

      <section>
        <h2 className="text-base font-semibold">진행 중인 공연</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shows.map((show) => {
            const apps = applications.filter((a) => a.showId === show.id);
            const unr = apps.filter((a) => a.reviewStatus === "미확인").length;
            const dLeft = daysUntil(show.deadline);
            return (
              <div
                key={show.id}
                className="flex overflow-hidden rounded-xl border border-border bg-card"
              >
                <Poster title={show.title} color={show.posterColor} className="w-24 shrink-0" />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        show.status === "모집 중"
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {show.status}
                    </span>
                    {show.status === "모집 중" && (
                      <span className="text-[10px] text-muted-foreground">
                        D-{dLeft} · 마감 {show.deadline}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 truncate text-base font-semibold">{show.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    배역: {show.roles.map((r) => r.name).join(", ")}
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">
                      지원자 <strong className="text-foreground">{apps.length}</strong>명
                    </span>
                    <span className="text-warning-foreground">
                      · 미확인 <strong>{unr}</strong>명
                    </span>
                  </div>
                  <div className="mt-auto pt-3">
                    <Link
                      to="/producer/shows/$id"
                      params={{ id: show.id }}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                    >
                      지원자 관리
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold">최근 지원자</h2>
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-border bg-card md:block">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs">
              <tr>
                <th className="px-4 py-2 text-left">지원자</th>
                <th className="px-4 py-2 text-left">지원 공연</th>
                <th className="px-4 py-2 text-left">지원 배역</th>
                <th className="px-4 py-2 text-left">지원 시간</th>
                <th className="px-4 py-2 text-left">검토 상태</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 6).map((a) => {
                const show = shows.find((s) => s.id === a.showId);
                const roleName = a.roleIds
                  .map((r) => show?.roles.find((sr) => sr.id === r)?.name)
                  .join(", ");
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-secondary/40">
                    <td className="px-4 py-2.5 font-medium">{a.applicantName}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{show?.title}</td>
                    <td className="px-4 py-2.5">{roleName}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.submittedAt}</td>
                    <td className="px-4 py-2.5">
                      <ReviewBadge status={a.reviewStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 grid gap-3 md:hidden">
          {applications.slice(0, 6).map((application) => {
            const show = shows.find((item) => item.id === application.showId);
            const roleName = application.roleIds
              .map((roleId) => show?.roles.find((role) => role.id === roleId)?.name)
              .join(", ");
            return (
              <Link
                key={application.id}
                to="/producer/shows/$id/applicants/$appId"
                params={{ id: application.showId, appId: application.id }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{application.applicantName}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{show?.title}</div>
                  </div>
                  <ReviewBadge status={application.reviewStatus} />
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">지원 배역 </span>
                  <strong>{roleName}</strong>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: "gold" | "warning";
}) {
  const color =
    accent === "gold"
      ? "bg-gold/15 text-gold-foreground"
      : accent === "warning"
        ? "bg-warning/15 text-warning-foreground"
        : "bg-primary/10 text-primary";
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-elev-1)]">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl tabular-nums">{value}</div>
    </div>
  );
}
