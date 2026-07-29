import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUp, CalendarClock, Eye, FilePlus2, Megaphone, Users } from "lucide-react";
import {
  daysUntil,
  getPerformanceId,
  getPostingTitle,
  getShowActivityTimestamp,
  useProducerWorkspace,
  useStore,
  type Show,
} from "@/lib/store";
import { Poster } from "@/components/poster";
import { Button } from "@/components/ui/button";

type PostingsSearch = {
  performance?: string;
};

export const Route = createFileRoute("/producer/postings")({
  validateSearch: (search: Record<string, unknown>): PostingsSearch => ({
    performance: typeof search.performance === "string" ? search.performance : undefined,
  }),
  component: PostingsManagement,
});

function PostingsManagement() {
  const { performance: initialPerformance } = Route.useSearch();
  const { shows, applications } = useProducerWorkspace();
  const bumpShow = useStore((state) => state.bumpShow);
  const [performanceFilter, setPerformanceFilter] = useState(initialPerformance ?? "전체");
  const [notice, setNotice] = useState("");

  const performanceOptions = useMemo(() => {
    const options = new Map<string, string>();
    for (const show of shows) options.set(getPerformanceId(show), show.title);
    return [...options.entries()];
  }, [shows]);

  const postings = useMemo(
    () =>
      [...shows]
        .filter(
          (show) => performanceFilter === "전체" || getPerformanceId(show) === performanceFilter,
        )
        .sort((a, b) => getShowActivityTimestamp(b) - getShowActivityTimestamp(a)),
    [performanceFilter, shows],
  );

  function handleBump(show: Show) {
    bumpShow(show.id);
    const bumpedAt = new Date().toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
    });
    setNotice(`‘${getPostingTitle(show)}’ 공고를 목록 최상단으로 끌어올렸습니다 · ${bumpedAt}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Recruitment postings
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">지원 공고 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            공연별 1차·추가 모집 공고를 나누어 관리하고 노출 순서를 갱신합니다.
          </p>
        </div>
        <Button asChild>
          <Link to="/producer/create">
            <FilePlus2 /> 새 공고 만들기
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <label
          className="grid min-w-[260px] gap-1.5 text-sm font-semibold"
          htmlFor="performance-filter"
        >
          공연 선택
          <select
            id="performance-filter"
            value={performanceFilter}
            onChange={(event) => setPerformanceFilter(event.target.value)}
            className="min-h-11 rounded-xl border border-input bg-background px-3 font-normal"
          >
            <option value="전체">전체 공연</option>
            {performanceOptions.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
        </label>
        <div className="ml-auto text-sm text-muted-foreground">
          공고 <strong className="text-foreground">{postings.length}건</strong>
        </div>
      </div>

      {notice && (
        <div
          className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success"
          role="status"
        >
          <ArrowUp className="h-4 w-4" />
          {notice}
        </div>
      )}

      <div className="space-y-4">
        {postings.map((show) => {
          const postingApplications = applications.filter(
            (application) => application.showId === show.id,
          );
          const deadlineDays = daysUntil(show.deadline);
          return (
            <article
              key={show.id}
              data-show-id={show.id}
              className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elev-1)] md:grid-cols-[144px_minmax(0,1fr)_auto]"
            >
              <Poster
                title={show.title}
                color={show.posterColor}
                image={show.posterImage}
                imagePosition={show.posterPosition}
                kind={show.kind}
                showText={false}
                className="h-44 w-full rounded-none md:h-full"
              />

              <div className="min-w-0 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                    {show.recruitmentRound ?? 1}차 공고
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      show.status === "모집 중"
                        ? "bg-success/10 text-success"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {show.status}
                  </span>
                  {show.bumpedAt && (
                    <span className="text-xs text-muted-foreground">
                      최근 끌어올림{" "}
                      {new Date(show.bumpedAt).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">{show.title}</div>
                <h2 className="mt-1 truncate text-xl font-semibold tracking-tight">
                  {getPostingTitle(show)}
                </h2>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4" />
                    {show.deadline} 마감
                    {deadlineDays >= 0 ? ` · D-${deadlineDays}` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    지원자 {postingApplications.length}명
                  </span>
                </div>
              </div>

              <div className="flex flex-row gap-2 border-t border-border p-4 md:w-44 md:flex-col md:justify-center md:border-l md:border-t-0">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/producer/shows/$id" params={{ id: show.id }}>
                    <Eye /> 지원자·결과
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleBump(show)}
                >
                  <ArrowUp /> 끌어올리기
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {postings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Megaphone className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <div className="mt-3 font-semibold">등록된 공고가 없습니다</div>
          <p className="mt-1 text-sm text-muted-foreground">
            선택한 공연의 새 모집 공고를 만들어 보세요.
          </p>
        </div>
      )}
    </div>
  );
}
