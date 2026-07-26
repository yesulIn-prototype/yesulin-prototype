import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, daysUntil } from "@/lib/store";
import { Poster } from "@/components/poster";

export const Route = createFileRoute("/producer/shows/")({
  component: ShowsList,
});

function ShowsList() {
  const shows = useStore((s) => s.shows);
  const applications = useStore((s) => s.applications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">공연 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          진행 중인 공연과 지원자 현황을 확인합니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shows.map((show) => {
          const apps = applications.filter((a) => a.showId === show.id);
          return (
            <Link
              key={show.id}
              to="/producer/shows/$id"
              params={{ id: show.id }}
              className="flex overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Poster
                title={show.title}
                color={show.posterColor}
                image={show.posterImage}
                imagePosition={show.posterPosition}
                kind={show.kind}
                showText={false}
                className="w-28 shrink-0"
              />
              <div className="flex flex-1 flex-col p-4">
                <div className="text-xs text-muted-foreground">{show.producer}</div>
                <div className="mt-0.5 truncate font-semibold">{show.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {show.status === "모집 중"
                    ? `D-${daysUntil(show.deadline)} · ${show.deadline} 마감`
                    : show.status}
                </div>
                <div className="mt-3 text-xs">
                  지원자 <strong>{apps.length}</strong>명 · 미확인{" "}
                  <strong>{apps.filter((a) => a.reviewStatus === "미확인").length}</strong>명
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
