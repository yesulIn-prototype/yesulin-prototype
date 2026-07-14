import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, daysUntil, findShow, findRole, type ApplyStatus } from "@/lib/store";
import { ApplyBadge } from "@/components/status-badge";
import { Files, Search } from "lucide-react";

export const Route = createFileRoute("/applicant/applications")({
  component: MyApplications,
});

function MyApplications() {
  const apps = useStore((s) => s.applications.filter((a) => a.applicantId === "me"));
  const [statusFilter, setStatusFilter] = useState<"전체" | ApplyStatus>("전체");
  const [sort, setSort] = useState<"최신순" | "마감 임박">("최신순");

  const list = useMemo(() => {
    let l = apps.slice();
    if (statusFilter !== "전체") l = l.filter((a) => a.applyStatus === statusFilter);
    l.sort((a, b) => {
      if (sort === "최신순") return b.submittedAt.localeCompare(a.submittedAt);
      const sa = findShow(a.showId);
      const sb = findShow(b.showId);
      return daysUntil(sa?.deadline ?? "9999.12.31") - daysUntil(sb?.deadline ?? "9999.12.31");
    });
    return l;
  }, [apps, statusFilter, sort]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">내 지원 현황</h1>
          <p className="mt-1 text-sm text-muted-foreground">지원한 공연과 다음 일정을 한 화면에서 확인합니다.</p>
        </div>
        <Link to="/applicant/shows" className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Search className="h-4 w-4" /> 새 공연 찾기
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "전체" | ApplyStatus)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="전체">지원 상태 전체</option>
          <option value="작성 중">작성 중</option>
          <option value="지원 완료">지원 완료</option>
          <option value="서류 확인">서류 확인</option>
          <option value="오디션 예정">오디션 예정</option>
          <option value="결과 발표">결과 발표</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "최신순" | "마감 임박")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option>최신순</option>
          <option>마감 임박</option>
        </select>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            <Files className="mx-auto mb-2 h-6 w-6" />
            지원 내역이 없습니다.
          </div>
        )}
        {list.map((app) => {
          const show = findShow(app.showId);
          if (!show) return null;
          const roleName = app.roleIds.map((r) => findRole(show, r)?.name).join(", ");
          const dLeft = daysUntil(show.deadline);
          return (
            <div key={app.id} className="rounded-xl border border-border bg-card p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ApplyBadge status={app.applyStatus} />
                    <span className="text-xs text-muted-foreground">{show.producer}</span>
                  </div>
                  <div className="mt-2 text-lg font-semibold">{show.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">지원 배역: {roleName}</div>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
                    <MiniStat label="지원일" value={app.submittedAt.split(" ")[0]} />
                    <MiniStat label="지원 마감" value={`${show.deadline}${dLeft >= 0 ? ` (D-${dLeft})` : ""}`} />
                    <MiniStat label="다음 일정" value={`오디션 ${show.auditionDate}`} />
                    <MiniStat label="제출 자료" value={`${app.selectedPhotoIds.length + app.selectedVideoIds.length}개`} />
                  </div>
                </div>
                <Link
                  to="/applicant/shows/$id"
                  params={{ id: show.id }}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                >
                  제출한 지원서 보기
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/60 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-xs font-medium text-foreground">{value}</div>
    </div>
  );
}
