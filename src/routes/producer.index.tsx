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
      <section className="grid overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[var(--shadow-elev-2)] xl:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)]">
        <div className="flex flex-col justify-center p-6 md:p-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Producer Workspace
          </div>
          <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
            지원자 검토에서
            <br />
            다음 결정까지.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground md:text-base">
            공연별 지원 자료와 검토 상태를 한 구조로 정리해, 캐스팅 팀이 같은 기준으로 빠르게 판단할
            수 있습니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/producer/create"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elev-1)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev-2)]"
            >
              + 새 공고 만들기
            </Link>
            <Link
              to="/producer/applicants"
              className="inline-flex items-center rounded-full border border-border-strong px-5 py-2.5 text-sm font-semibold transition hover:border-foreground hover:bg-secondary"
            >
              지원자 전체 보기
            </Link>
          </div>
        </div>
        <div className="relative min-h-64 overflow-hidden xl:min-h-[360px]">
          <img
            src="/images/editorial/dashboard-producer.jpg"
            alt="오디션 현장에서 지원자를 평가하는 캐스팅 담당자"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
          <div className="absolute bottom-5 right-5 rounded-full bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-foreground">
            Focus on the decision
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Film} label="진행 중인 모집" value={`${activeShows.length}건`} />
        <Stat icon={Users} label="전체 지원자" value={`${totalApplicants}명`} />
        <Stat icon={Eye} label="미확인 지원자" value={`${unreviewed}명`} accent="warning" />
        <Stat icon={Mic2} label="예정된 오디션 대상" value={`${auditionCount}명`} accent="gold" />
      </div>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">진행 중인 공연</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              마감과 미확인 지원자를 기준으로 우선 검토하세요.
            </p>
          </div>
          <Link to="/producer/shows" className="text-xs font-semibold hover:underline">
            공연 전체 보기 →
          </Link>
        </div>
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
                <Poster
                  title={show.title}
                  color={show.posterColor}
                  image={show.posterImage}
                  kind={show.kind}
                  className="w-28 shrink-0"
                />
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
