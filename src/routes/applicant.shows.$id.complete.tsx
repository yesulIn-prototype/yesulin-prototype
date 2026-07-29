import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useStore, findShow, findRole, daysUntil } from "@/lib/store";
import { CheckCircle2, Calendar, Files, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/applicant/shows/$id/complete")({
  component: ApplyComplete,
});

function ApplyComplete() {
  const { id } = Route.useParams();
  const show = findShow(id);
  const applicantId = useStore((s) => s.applicant.id);
  const app = useStore((s) =>
    [...s.applications].reverse().find((a) => a.applicantId === applicantId && a.showId === id),
  );

  if (!show) throw notFound();

  const roles = app
    ? app.roleIds
        .map((r) => findRole(show, r)?.name)
        .filter(Boolean)
        .join(", ")
    : "";
  const fileCount = (app?.selectedPhotoIds.length ?? 0) + (app?.selectedVideoIds.length ?? 0);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">지원서가 제출되었습니다.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          저장된 프로필과 자료를 재사용해 제출을 완료했습니다.
        </p>

        <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-background text-left text-sm">
          <Row label="공연명" value={show.title} />
          <Row label="지원 배역" value={roles || "-"} />
          <Row label="제출 일시" value={app?.submittedAt ?? "-"} />
          <Row label="지원 마감일" value={`${show.deadline} (D-${daysUntil(show.deadline)})`} />
          <Row label="오디션 예정일" value={show.auditionDate} />
          <Row label="제출한 자료 수" value={`${fileCount}개`} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            to="/applicant/applications"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Files className="h-4 w-4" /> 내 지원 현황으로 이동
          </Link>
          {app && (
            <Link
              to="/applicant/applications/$appId"
              params={{ appId: app.id }}
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
            >
              제출한 지원서 확인
            </Link>
          )}
          <Link
            to="/applicant/shows"
            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            다른 공연 찾아보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}
