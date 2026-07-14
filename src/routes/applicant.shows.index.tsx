import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, daysUntil } from "@/lib/store";
import { Poster } from "@/components/poster";
import { DeadlineBadge } from "@/components/status-badge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/applicant/shows/")({
  component: ShowsList,
});

function ShowsList() {
  const shows = useStore((s) => s.shows);
  const allApps = useStore((s) => s.applications);
  const applications = allApps.filter((a) => a.applicantId === "me");
  const appliedIds = new Set(applications.map((a) => a.showId));

  const [q, setQ] = useState("");
  const [kind, setKind] = useState<string>("전체");
  const [openOnly, setOpenOnly] = useState(true);
  const [sortBy, setSortBy] = useState<"마감 임박" | "최신순">("마감 임박");

  const filtered = useMemo(() => {
    let list = shows.filter((s) => {
      if (q && !s.title.includes(q) && !s.producer.includes(q)) return false;
      if (kind !== "전체" && s.kind !== kind) return false;
      if (openOnly && s.status !== "모집 중") return false;
      return true;
    });
    list = list.sort((a, b) =>
      sortBy === "마감 임박" ? daysUntil(a.deadline) - daysUntil(b.deadline) : b.deadline.localeCompare(a.deadline),
    );
    return list;
  }, [shows, q, kind, openOnly, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">공연 찾기</h1>
        <p className="mt-1 text-sm text-muted-foreground">지원 가능한 공연을 확인하고 저장된 자료로 바로 지원하세요.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="공연명 또는 제작사 검색"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="전체">공연 종류 전체</option>
          <option value="뮤지컬">뮤지컬</option>
          <option value="연극">연극</option>
        </select>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          모집 중만
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "마감 임박" | "최신순")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option>마감 임박</option>
          <option>최신순</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((show) => {
          const applied = appliedIds.has(show.id);
          return (
            <Link
              key={show.id}
              to="/applicant/shows/$id"
              params={{ id: show.id }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Poster title={show.title} color={show.posterColor} className="h-40" />
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                    {show.kind}
                  </span>
                  {show.status === "모집 중" ? (
                    <DeadlineBadge daysLeft={daysUntil(show.deadline)} />
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {show.status}
                    </span>
                  )}
                  {applied && (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
                      지원 완료
                    </span>
                  )}
                </div>
                <div className="mt-2 text-base font-semibold leading-tight">{show.title}</div>
                <div className="text-xs text-muted-foreground">{show.producer}</div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div>모집 배역: {show.roles.map((r) => r.name).join(", ")}</div>
                  <div>지원 마감: {show.deadline}</div>
                  <div>오디션: {show.auditionDate}</div>
                  <div>공연: {show.showPeriod}</div>
                </div>
                <div className="mt-auto pt-4">
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                    상세 보기 →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
            조건에 맞는 공연이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
