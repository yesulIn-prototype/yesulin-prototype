import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, FilePlus2, FileText } from "lucide-react";
import {
  getPerformanceId,
  getPostingTitle,
  getShowActivityTimestamp,
  useProducerWorkspace,
  type Show,
} from "@/lib/store";
import { Poster } from "@/components/poster";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/producer/shows/")({
  component: ShowsList,
});

type PerformanceGroup = {
  id: string;
  title: string;
  postings: Show[];
};

function ShowsList() {
  const { shows, applications } = useProducerWorkspace();

  const performances = useMemo(() => {
    const groups = new Map<string, PerformanceGroup>();
    for (const show of shows) {
      const performanceId = getPerformanceId(show);
      const group = groups.get(performanceId);
      if (group) {
        group.postings.push(show);
      } else {
        groups.set(performanceId, {
          id: performanceId,
          title: show.title,
          postings: [show],
        });
      }
    }
    return [...groups.values()].sort(
      (a, b) => latestPostingTimestamp(b.postings) - latestPostingTimestamp(a.postings),
    );
  }, [shows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Productions
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">공연 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            공연 단위로 여러 차수의 모집 공고와 누적 지원 현황을 확인합니다.
          </p>
        </div>
        <Button asChild>
          <Link to="/producer/create">
            <FilePlus2 /> 새 모집 공고
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {performances.map((performance) => {
          const postings = [...performance.postings].sort(
            (a, b) => getShowActivityTimestamp(b) - getShowActivityTimestamp(a),
          );
          const latestPosting = postings[0];
          const postingIds = new Set(postings.map((posting) => posting.id));
          const performanceApplications = applications.filter((application) =>
            postingIds.has(application.showId),
          );
          const openPostings = postings.filter((posting) => posting.status === "모집 중").length;

          return (
            <article
              key={performance.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elev-1)]"
            >
              <div className="grid grid-cols-[112px_minmax(0,1fr)]">
                <Poster
                  title={performance.title}
                  color={latestPosting.posterColor}
                  image={latestPosting.posterImage}
                  imagePosition={latestPosting.posterPosition}
                  kind={latestPosting.kind}
                  showText={false}
                  className="h-full min-h-40 w-full rounded-none"
                />
                <div className="min-w-0 p-4">
                  <div className="text-xs text-muted-foreground">{latestPosting.kind}</div>
                  <h2 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight">
                    {performance.title}
                  </h2>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {latestPosting.producer}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">
                      공고 {postings.length}건
                    </span>
                    <span className="rounded-full bg-success/10 px-2.5 py-1 font-semibold text-success">
                      모집 중 {openPostings}건
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">누적 지원자</span>
                  <strong>{performanceApplications.length}명</strong>
                </div>
                <div className="mt-3 rounded-xl bg-surface p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    최근 공고
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold">
                    {getPostingTitle(latestPosting)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {latestPosting.deadline} 마감
                  </div>
                </div>
                <Link
                  to="/producer/postings"
                  search={{ performance: performance.id }}
                  className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background text-sm font-semibold hover:bg-secondary"
                >
                  <FileText className="h-4 w-4" /> 공고별 관리
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function latestPostingTimestamp(postings: Show[]) {
  return postings.reduce(
    (latest, posting) => Math.max(getShowActivityTimestamp(posting), latest),
    0,
  );
}
