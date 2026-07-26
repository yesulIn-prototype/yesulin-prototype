import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, daysUntil } from "@/lib/store";
import { Poster } from "@/components/poster";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/producer/shows/")({
  component: ShowsList,
});

function ShowsList() {
  const shows = useStore((s) => s.shows);
  const applications = useStore((s) => s.applications);
  const removeShow = useStore((s) => s.removeShow);

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
            <article
              key={show.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Link to="/producer/shows/$id" params={{ id: show.id }} className="flex">
                <Poster
                  title={show.title}
                  color={show.posterColor}
                  image={show.posterImage}
                  imagePosition={show.posterPosition}
                  kind={show.kind}
                  showText={false}
                  className="w-28 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col p-4 pr-12">
                  <div className="truncate text-xs text-muted-foreground">{show.producer}</div>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`${show.title} 공고 삭제`}
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>공고를 삭제할까요?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ‘{show.title}’ 공고와 지원서 {apps.length}건이 함께 삭제됩니다. 이 작업은
                      되돌릴 수 없습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => removeShow(show.id)}
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </article>
          );
        })}
      </div>
    </div>
  );
}
