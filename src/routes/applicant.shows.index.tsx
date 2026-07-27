import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, daysUntil, getPostingTitle, getShowActivityTimestamp } from "@/lib/store";
import { Poster } from "@/components/poster";
import { DeadlineBadge } from "@/components/status-badge";
import { Bookmark, CalendarDays, Clock3, RotateCcw, Search } from "lucide-react";

export const Route = createFileRoute("/applicant/shows/")({
  component: ShowsList,
});

function ShowsList() {
  const shows = useStore((s) => s.shows);
  const allApps = useStore((s) => s.applications);
  const favoriteShowIds = useStore((s) => s.favoriteShowIds);
  const toggleFavoriteShow = useStore((s) => s.toggleFavoriteShow);
  const applications = allApps.filter((a) => a.applicantId === "me");
  const appliedIds = new Set(applications.map((a) => a.showId));

  const [q, setQ] = useState("");
  const [kind, setKind] = useState<string>("전체");
  const [openOnly, setOpenOnly] = useState(true);
  const [sortBy, setSortBy] = useState<"마감 임박" | "최신순">("마감 임박");

  const filtered = useMemo(() => {
    let list = shows.filter((s) => {
      if (q && !s.title.includes(q) && !s.producer.includes(q) && !getPostingTitle(s).includes(q))
        return false;
      if (kind !== "전체" && s.kind !== kind) return false;
      if (openOnly && s.status !== "모집 중") return false;
      return true;
    });
    list = list.sort((a, b) =>
      sortBy === "마감 임박"
        ? daysUntil(a.deadline) - daysUntil(b.deadline)
        : getShowActivityTimestamp(b) - getShowActivityTimestamp(a),
    );
    return list;
  }, [shows, q, kind, openOnly, sortBy]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Discover
          </div>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">공연 찾기</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            지원 가능한 공연을 확인하고 저장된 자료로 바로 지원하세요.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          총 <strong className="text-foreground">{filtered.length}</strong>개 공연
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elev-1)] md:grid-cols-[minmax(280px,1fr)_auto_auto_auto]">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="공연명 또는 제작사 검색"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
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
        <label className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm">
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

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((show) => {
          const applied = appliedIds.has(show.id);
          const favorite = favoriteShowIds.includes(show.id);
          return (
            <article
              key={show.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/50"
            >
              <button
                type="button"
                aria-label={favorite ? `${show.title} 즐겨찾기 해제` : `${show.title} 즐겨찾기`}
                aria-pressed={favorite}
                onClick={() => toggleFavoriteShow(show.id)}
                className={`absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition ${
                  favorite
                    ? "border-[#d9e900] bg-[#f1ff3d] text-foreground"
                    : "border-border bg-background/90 text-muted-foreground backdrop-blur hover:border-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
              </button>
              <Link
                to="/applicant/shows/$id"
                params={{ id: show.id }}
                className="group grid min-h-[188px] sm:grid-cols-[128px_1fr]"
              >
                <div className="relative min-h-32 sm:min-h-full">
                  <Poster
                    title={show.title}
                    color={show.posterColor}
                    image={show.posterImage}
                    imagePosition={show.posterPosition}
                    kind={show.kind}
                    showText={false}
                    className="absolute inset-0 h-full w-full rounded-none"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    {show.status === "모집 중" ? (
                      <DeadlineBadge daysLeft={daysUntil(show.deadline)} />
                    ) : (
                      <span className="rounded-full border border-white/30 bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur">
                        {show.status}
                      </span>
                    )}
                    {applied && (
                      <span className="rounded-full border border-success/40 bg-success/90 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow">
                        지원 완료
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-4 pr-16">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    {show.kind}
                  </div>
                  <div className="mt-1 text-lg font-semibold leading-tight text-foreground">
                    {show.title}
                  </div>
                  <div className="mt-1 truncate text-xs font-semibold text-primary">
                    {getPostingTitle(show)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{show.producer}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {show.roles.slice(0, 3).map((role) => (
                      <span
                        key={role.id}
                        className="rounded-full border border-border bg-secondary/60 px-2 py-1 text-[11px] font-medium"
                      >
                        {role.name}
                      </span>
                    ))}
                    {show.roles.length > 3 && (
                      <span className="rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground">
                        +{show.roles.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" /> 마감 {show.deadline}
                    </span>
                    <span>필수 자료 {show.requiredItems.length}개</span>
                  </div>
                  <div className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    공고 상세 확인 →
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <div className="mt-3 font-semibold">조건에 맞는 공고가 없습니다</div>
            <p className="mt-1 text-sm text-muted-foreground">
              검색어를 지우거나 필터를 초기화해 전체 공고를 확인해 보세요.
            </p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setKind("전체");
                setOpenOnly(false);
              }}
              className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
            >
              <RotateCcw className="h-4 w-4" /> 필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
