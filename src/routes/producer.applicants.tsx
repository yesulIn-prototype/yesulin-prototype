import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { StageResultBadge } from "@/components/status-badge";
import {
  getApplicationStageProgress,
  getAuditionStages,
  useStore,
  type StageResult,
} from "@/lib/store";
import { ArrowRight, Search, Users } from "lucide-react";

export const Route = createFileRoute("/producer/applicants")({
  component: AllApplicants,
});

function AllApplicants() {
  const applications = useStore((s) => s.applications);
  const shows = useStore((s) => s.shows);
  const getApplicantById = useStore((s) => s.getApplicantById);
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState("전체");
  const [stageFilter, setStageFilter] = useState("전체");
  const [stageResultFilter, setStageResultFilter] = useState("전체");
  const stageOptions = Array.from(
    new Map(
      shows.flatMap((show) => getAuditionStages(show)).map((stage) => [stage.id, stage] as const),
    ).values(),
  );

  const list = useMemo(
    () =>
      applications.filter((application) => {
        const show = shows.find((item) => item.id === application.showId);
        if (!show) return false;
        const progress = getApplicationStageProgress(application, show);
        if (query && !application.applicantName.includes(query.trim())) return false;
        if (showFilter !== "전체" && application.showId !== showFilter) return false;
        if (stageFilter !== "전체" && progress.stage.id !== stageFilter) return false;
        if (stageResultFilter !== "전체" && progress.result !== stageResultFilter) return false;
        return true;
      }),
    [applications, query, showFilter, shows, stageFilter, stageResultFilter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">지원자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 지원자를 찾고, 공연별 상세 화면에서 자료와 평가를 이어서 검토합니다.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_repeat(4,auto)]">
        <label className="relative">
          <span className="sr-only">지원자 이름 검색</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="지원자 이름 검색"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
          />
        </label>
        <label>
          <span className="sr-only">공연 필터</span>
          <select
            value={showFilter}
            onChange={(event) => setShowFilter(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">공연 전체</option>
            {shows.map((show) => (
              <option key={show.id} value={show.id}>
                {show.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">전형 단계 필터</span>
          <select
            value={stageFilter}
            onChange={(event) => setStageFilter(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">전형 단계 전체</option>
            {stageOptions.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">단계 결과 필터</span>
          <select
            value={stageResultFilter}
            onChange={(event) => setStageResultFilter(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">단계 결과 전체</option>
            {(["검토 대기", "진행 중", "합격", "불합격", "보류", "불참"] as StageResult[]).map(
              (result) => (
                <option key={result}>{result}</option>
              ),
            )}
          </select>
        </label>
        <div className="text-xs text-muted-foreground md:col-span-5">
          검색 결과 <strong className="text-foreground">{list.length}명</strong>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Users className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <div className="mt-3 font-semibold">조건에 맞는 지원자가 없습니다</div>
          <p className="mt-1 text-sm text-muted-foreground">검색어 또는 필터를 변경해 보세요.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((application) => {
            const show = shows.find((item) => item.id === application.showId);
            const applicant = getApplicantById(application.applicantId);
            const photo =
              applicant?.photos.find((item) => item.isDefault && item.image) ??
              applicant?.photos.find((item) => item.image);
            const roleName = application.roleIds
              .map((roleId) => show?.roles.find((role) => role.id === roleId)?.name)
              .join(", ");

            if (!show) return null;
            const progress = getApplicationStageProgress(application, show);
            return (
              <Link
                key={application.id}
                to="/producer/shows/$id/applicants/$appId"
                params={{ id: show.id, appId: application.id }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:border-primary hover:shadow-[var(--shadow-elev-2)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  {photo?.image ? (
                    <img
                      src={photo.image}
                      alt={`${application.applicantName} 지원자 프로필`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-semibold text-muted-foreground/40">
                      {application.applicantName.slice(0, 1)}
                    </div>
                  )}
                  <div className="absolute right-3 top-3">
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full border border-white/30 bg-black/65 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur">
                        {progress.stage.name}
                      </span>
                      <StageResultBadge
                        status={progress.result}
                        className="min-h-8 px-3 py-2 text-xs font-bold shadow-md backdrop-blur"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold">{application.applicantName}</h2>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">{show.title}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-surface px-3 py-2.5 text-sm">
                    <span className="text-muted-foreground">지원 배역 </span>
                    <strong>{roleName}</strong>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{application.submittedAt}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      상세 보기 <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
