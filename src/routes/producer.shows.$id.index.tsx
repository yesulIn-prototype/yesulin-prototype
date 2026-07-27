import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useStore,
  daysUntil,
  getPostingTitle,
  isFinalReviewStatus,
  type Applicant,
  type Application,
  type ReviewStatus,
} from "@/lib/store";
import { ReviewBadge } from "@/components/status-badge";
import {
  AlertCircle,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  Eye,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Search,
  Send,
  Star,
  StickyNote,
  Trash2,
  Video as VideoIcon,
} from "lucide-react";
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

export const Route = createFileRoute("/producer/shows/$id/")({
  component: ShowApplicants,
});

const REVIEW_STATUSES: ReviewStatus[] = [
  "미확인",
  "검토 중",
  "오디션 대상",
  "보류",
  "합격",
  "불합격",
];
type SortKey = "recent" | "name" | "career";

type RowModel = {
  app: Application;
  applicant: Applicant | undefined;
  roleNames: string;
  age: number | null;
  height: number | null;
  mainCareer: string;
};

function ShowApplicants() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const show = useStore((s) => s.shows.find((item) => item.id === id));
  const allApplications = useStore((s) => s.applications);
  const removeShow = useStore((s) => s.removeShow);
  const sendShowResults = useStore((s) => s.sendShowResults);
  const updateReview = useStore((s) => s.updateReview);
  const updateReviews = useStore((s) => s.updateReviews);
  const toggleShortlist = useStore((s) => s.toggleShortlist);
  const setRating = useStore((s) => s.setRating);
  const getApplicantById = useStore((s) => s.getApplicantById);

  const [roleFilter, setRoleFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [genderFilter, setGenderFilter] = useState("전체");
  const [nameQuery, setNameQuery] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [minHeight, setMinHeight] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [pending, setPending] = useState<Record<string, ReviewStatus>>({});
  const [statusNotice, setStatusNotice] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ReviewStatus>("검토 중");
  const [compareOpen, setCompareOpen] = useState(false);

  if (!show) throw notFound();

  const applications = allApplications.filter((application) => application.showId === id);
  const deadlineDays = daysUntil(show.deadline);
  const deadlineLabel = deadlineDays >= 0 ? `D-${deadlineDays}` : "마감";
  const announcementDays = show.resultAnnouncementDate
    ? daysUntil(show.resultAnnouncementDate)
    : null;
  const savedFinalResults = applications.filter((application) =>
    isFinalReviewStatus(application.reviewStatus),
  );
  const unsavedResultCount = Object.entries(pending).filter(([appId, nextStatus]) => {
    const application = applications.find((item) => item.id === appId);
    return application && application.reviewStatus !== nextStatus;
  }).length;
  const hasApplications = applications.length > 0;
  const deadlinePassed = deadlineDays < 0;
  const announcementReady = announcementDays !== null && announcementDays <= 0;
  const allResultsSaved =
    hasApplications && savedFinalResults.length === applications.length && unsavedResultCount === 0;
  const canSendResults =
    !show.resultsSentAt && deadlinePassed && announcementReady && allResultsSaved;
  const rows = useMemo<RowModel[]>(() => {
    const list = applications
      .map((app) => {
        const applicant = getApplicantById(app.applicantId);
        const birthYear = Number(applicant?.birthDate.slice(0, 4));
        const height = Number.parseInt(applicant?.height ?? "", 10);
        return {
          app,
          applicant,
          roleNames: app.roleIds
            .map((roleId) => show.roles.find((role) => role.id === roleId)?.name)
            .filter(Boolean)
            .join(", "),
          age: Number.isFinite(birthYear) ? new Date().getFullYear() - birthYear + 1 : null,
          height: Number.isFinite(height) ? height : null,
          mainCareer: applicant?.careers[0]
            ? `${applicant.careers[0].title} · ${applicant.careers[0].role}`
            : "등록된 경력 없음",
        };
      })
      .filter((row) => {
        if (roleFilter !== "전체" && !row.app.roleIds.includes(roleFilter)) return false;
        if (statusFilter !== "전체" && row.app.reviewStatus !== statusFilter) return false;
        if (genderFilter !== "전체" && row.applicant?.gender !== genderFilter) return false;
        if (nameQuery.trim() && !row.app.applicantName.includes(nameQuery.trim())) return false;
        if (minAge && (row.age === null || row.age < Number(minAge))) return false;
        if (maxAge && (row.age === null || row.age > Number(maxAge))) return false;
        if (minHeight && (row.height === null || row.height < Number(minHeight))) return false;
        return true;
      });

    if (sort === "name") {
      list.sort((a, b) => a.app.applicantName.localeCompare(b.app.applicantName, "ko"));
    } else if (sort === "career") {
      list.sort((a, b) => b.app.selectedCareerIds.length - a.app.selectedCareerIds.length);
    } else {
      list.sort((a, b) => (a.app.submittedAt > b.app.submittedAt ? -1 : 1));
    }
    return list;
  }, [
    applications,
    genderFilter,
    getApplicantById,
    maxAge,
    minAge,
    minHeight,
    nameQuery,
    roleFilter,
    show.roles,
    sort,
    statusFilter,
  ]);

  const activeFilterCount = [
    roleFilter !== "전체",
    statusFilter !== "전체",
    genderFilter !== "전체",
    Boolean(nameQuery),
    Boolean(minAge),
    Boolean(maxAge),
    Boolean(minHeight),
  ].filter(Boolean).length;

  function resetFilters() {
    setRoleFilter("전체");
    setStatusFilter("전체");
    setGenderFilter("전체");
    setNameQuery("");
    setMinAge("");
    setMaxAge("");
    setMinHeight("");
  }

  function saveOne(appId: string) {
    const nextStatus = pending[appId];
    if (!nextStatus) return;
    updateReview(appId, { reviewStatus: nextStatus });
    setPending((current) => {
      const next = { ...current };
      delete next[appId];
      return next;
    });
    const changedAt = new Date().toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
    });
    setStatusNotice(`${nextStatus}(으)로 변경했습니다 · ${changedAt} · 캐스팅 담당`);
  }

  function applyBulkStatus() {
    if (selected.length === 0) return;
    updateReviews(selected, { reviewStatus: bulkStatus });
    setStatusNotice(`${selected.length}건을 ${bulkStatus}(으)로 변경했습니다.`);
    setSelected([]);
  }

  async function deleteShow() {
    await navigate({ to: "/producer/postings" });
    removeShow(id);
  }

  function notifyResults() {
    if (!canSendResults) return;
    sendShowResults(show.id);
    setStatusNotice(`${applications.length}명에게 최종 결과 알림을 보냈습니다.`);
  }

  return (
    <div className="space-y-6">
      <Link
        to="/producer/postings"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> 지원 공고 관리로
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{show.producer}</div>
          <h1 className="truncate text-2xl font-semibold tracking-tight">{show.title}</h1>
          <div className="mt-1 text-sm font-semibold text-primary">{getPostingTitle(show)}</div>
          <div className="mt-1 text-sm text-muted-foreground">
            지원 마감 {show.deadline} · {deadlineLabel} · 오디션 {show.auditionDate} · 결과 발표{" "}
            {show.resultAnnouncementDate || "미정"}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
          <div className="flex flex-wrap gap-2">
            <StatChip label="전체" value={applications.length} />
            <StatChip
              label="미확인"
              value={applications.filter((app) => app.reviewStatus === "미확인").length}
              accent="warning"
            />
            <StatChip
              label="오디션 대상"
              value={applications.filter((app) => app.reviewStatus === "오디션 대상").length}
              accent="success"
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant={show.resultsSentAt ? "secondary" : "default"}
              >
                {show.resultsSentAt ? <CheckCircle2 /> : <BellRing />}
                {show.resultsSentAt ? "결과 발송 완료" : "결과 알림 보내기"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>전체 지원자 결과를 최종 확인하세요</AlertDialogTitle>
                <AlertDialogDescription>
                  저장된 합격·불합격 결과와 마감 및 발표 일정을 모두 충족해야 알림을 보낼 수
                  있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="grid gap-2">
                <ResultCheck
                  passed={hasApplications}
                  label="알림 대상 지원자"
                  detail={
                    hasApplications
                      ? `전체 ${applications.length}명`
                      : "알림을 보낼 지원자가 없습니다."
                  }
                />
                <ResultCheck
                  passed={allResultsSaved}
                  label="전체 합·불 결과 저장"
                  detail={`저장 완료 ${savedFinalResults.length}/${applications.length}명${
                    unsavedResultCount > 0 ? ` · 미저장 변경 ${unsavedResultCount}건` : ""
                  }`}
                />
                <ResultCheck
                  passed={deadlinePassed}
                  label="지원 공고 마감"
                  detail={
                    deadlinePassed
                      ? `${show.deadline} 마감 확인`
                      : `${show.deadline}까지 지원 접수 중`
                  }
                />
                <ResultCheck
                  passed={announcementReady}
                  label="결과 발표일"
                  detail={
                    show.resultAnnouncementDate
                      ? announcementReady
                        ? `${show.resultAnnouncementDate} 발표 가능`
                        : `${show.resultAnnouncementDate} 발표 예정`
                      : "결과 발표일이 입력되지 않았습니다."
                  }
                />
              </div>

              <div className="max-h-60 overflow-y-auto rounded-xl border border-border">
                {applications.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">지원자가 없습니다.</div>
                ) : (
                  applications.map((application) => {
                    const pendingStatus = pending[application.id];
                    const isUnsaved =
                      pendingStatus !== undefined && pendingStatus !== application.reviewStatus;
                    return (
                      <div
                        key={application.id}
                        className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
                      >
                        <div>
                          <div className="text-sm font-semibold">{application.applicantName}</div>
                          {isUnsaved && (
                            <div className="mt-0.5 text-xs text-warning-foreground">
                              변경한 결과를 먼저 저장하세요.
                            </div>
                          )}
                        </div>
                        <ReviewBadge
                          status={isUnsaved ? pendingStatus : application.reviewStatus}
                          className="px-3 py-1.5 text-xs"
                        />
                      </div>
                    );
                  })
                )}
              </div>

              {show.resultsSentAt && (
                <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
                  {new Date(show.resultsSentAt).toLocaleString("ko-KR")}에 결과 알림을 발송했습니다.
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>{show.resultsSentAt ? "닫기" : "취소"}</AlertDialogCancel>
                <AlertDialogAction
                  disabled={!canSendResults}
                  onClick={notifyResults}
                  className="gap-2"
                >
                  <Send />
                  {show.resultsSentAt ? "발송 완료" : `전체 ${applications.length}명에게 보내기`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 /> 공고 삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>공고를 삭제할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  ‘{show.title}’ 공고와 지원서 {applications.length}건이 함께 삭제됩니다. 이 작업은
                  되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={deleteShow}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {statusNotice && (
        <div
          className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
          aria-live="polite"
        >
          <CheckCircle2 className="h-4 w-4" />
          {statusNotice}
        </div>
      )}

      {selected.length > 0 && (
        <div className="sticky top-20 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-card p-3 shadow-[var(--shadow-elev-2)]">
          <strong className="mr-auto text-sm">{selected.length}명 선택</strong>
          <label className="sr-only" htmlFor="bulk-review-status">
            일괄 검토 상태
          </label>
          <select
            id="bulk-review-status"
            value={bulkStatus}
            onChange={(event) => setBulkStatus(event.target.value as ReviewStatus)}
            className="min-h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            {REVIEW_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={applyBulkStatus}
            className="min-h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            상태 일괄 변경
          </button>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            disabled={selected.length < 2}
            className="min-h-10 rounded-lg border border-input px-4 text-sm font-semibold disabled:opacity-40"
          >
            선택 비교
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="min-h-10 px-3 text-sm text-muted-foreground"
          >
            선택 해제
          </button>
        </div>
      )}

      <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-elev-1)]">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(4,auto)]">
          <label className="relative">
            <span className="sr-only">지원자 이름 검색</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
              placeholder="지원자 이름 검색"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm"
            />
          </label>
          <FilterSelect
            label="지원 배역"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "전체", label: "지원 배역 전체" },
              ...show.roles.map((role) => ({ value: role.id, label: role.name })),
            ]}
          />
          <FilterSelect
            label="검토 상태"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "전체", label: "검토 상태 전체" },
              ...REVIEW_STATUSES.map((status) => ({ value: status, label: status })),
            ]}
          />
          <FilterSelect
            label="성별"
            value={genderFilter}
            onChange={setGenderFilter}
            options={[
              { value: "전체", label: "성별 전체" },
              { value: "여성", label: "여성" },
              { value: "남성", label: "남성" },
            ]}
          />
          <FilterSelect
            label="정렬"
            value={sort}
            onChange={(value) => setSort(value as SortKey)}
            options={[
              { value: "recent", label: "최신 지원순" },
              { value: "name", label: "이름순" },
              { value: "career", label: "경력 많은 순" },
            ]}
          />
        </div>

        <details className="rounded-lg border border-border bg-surface px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium">나이·키 상세 필터</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <NumberFilter label="최소 나이" value={minAge} onChange={setMinAge} suffix="세" />
            <NumberFilter label="최대 나이" value={maxAge} onChange={setMaxAge} suffix="세" />
            <NumberFilter label="최소 키" value={minHeight} onChange={setMinHeight} suffix="cm" />
          </div>
        </details>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div>
            <strong>{rows.length}명</strong>
            <span className="ml-2 text-muted-foreground">
              {activeFilterCount > 0
                ? `적용된 필터 ${activeFilterCount}개`
                : "전체 지원자를 표시하고 있습니다"}
            </span>
          </div>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5"
            >
              <RotateCcw className="h-4 w-4" /> 필터 초기화
            </button>
          )}
        </div>

        {Object.keys(pending).length > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            저장하지 않은 상태 변경이 {Object.keys(pending).length}건 있습니다.
          </div>
        )}
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <div className="mt-3 font-semibold">조건에 맞는 지원자가 없습니다</div>
          <p className="mt-1 text-sm text-muted-foreground">
            검색 조건을 변경하거나 필터를 초기화해 보세요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" /> 필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {rows.map((row) => (
            <ApplicantCard
              key={row.app.id}
              row={row}
              showId={show.id}
              pendingStatus={pending[row.app.id]}
              onPending={(status) =>
                setPending((current) => ({ ...current, [row.app.id]: status }))
              }
              onSave={() => saveOne(row.app.id)}
              selected={selected.includes(row.app.id)}
              onSelect={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...new Set([...current, row.app.id])]
                    : current.filter((appId) => appId !== row.app.id),
                )
              }
              onToggleShortlist={() => toggleShortlist(row.app.id)}
              onRating={(rating) => setRating(row.app.id, rating)}
            />
          ))}
        </div>
      )}

      {compareOpen && (
        <CompareDialog
          rows={rows.filter((row) => selected.includes(row.app.id))}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
}

function ApplicantCard({
  row,
  showId,
  pendingStatus,
  onPending,
  onSave,
  selected,
  onSelect,
  onToggleShortlist,
  onRating,
}: {
  row: RowModel;
  showId: string;
  pendingStatus?: ReviewStatus;
  onPending: (status: ReviewStatus) => void;
  onSave: () => void;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onToggleShortlist: () => void;
  onRating: (rating: number) => void;
}) {
  const currentStatus = pendingStatus ?? row.app.reviewStatus;
  const isDirty = Boolean(pendingStatus && pendingStatus !== row.app.reviewStatus);

  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-elev-1)] transition hover:shadow-[var(--shadow-elev-2)] ${
        selected
          ? "border-primary ring-2 ring-primary/15"
          : isDirty
            ? "border-warning/60"
            : "border-border"
      }`}
    >
      <div className="grid grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[148px_minmax(0,1fr)]">
        <ApplicantPortrait applicant={row.applicant} name={row.app.applicantName} />
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected}
                onChange={(event) => onSelect(event.target.checked)}
                aria-label={`${row.app.applicantName} 비교 대상으로 선택`}
              />
              <h2 className="text-lg font-semibold tracking-tight">{row.app.applicantName}</h2>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleShortlist}
                aria-label={row.app.shortlisted ? "숏리스트에서 제거" : "숏리스트에 추가"}
                aria-pressed={row.app.shortlisted}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-secondary"
              >
                <Star
                  className={`h-4 w-4 ${
                    row.app.shortlisted ? "fill-gold text-gold" : "text-muted-foreground"
                  }`}
                />
              </button>
              <ReviewBadge status={row.app.reviewStatus} />
            </div>
          </div>
          <div className="mt-1.5 text-xs text-muted-foreground">
            {row.applicant?.gender ?? "-"} · {row.age ? `${row.age}세` : "-"} ·{" "}
            {row.applicant?.height ?? "-"}
          </div>
          <div className="mt-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              지원 배역
            </div>
            <div className="mt-1 text-sm font-semibold">{row.roleNames || "-"}</div>
          </div>
          <div className="mt-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              주요 경력
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground/80">
              {row.mainCareer}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-y border-border bg-surface px-4 py-3">
        <MaterialSummary app={row.app} />
        <span className="text-[11px] text-muted-foreground">지원 {row.app.submittedAt}</span>
      </div>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">평가 점수</span>
        <div className="flex" aria-label={`${row.app.applicantName} 평가 ${row.app.rating ?? 0}점`}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onRating(rating)}
              aria-label={`${rating}점`}
              className="inline-flex h-8 w-8 items-center justify-center"
            >
              <Star
                className={`h-4 w-4 ${
                  rating <= (row.app.rating ?? 0)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="sr-only" htmlFor={`mobile-status-${row.app.id}`}>
          {row.app.applicantName} 검토 상태
        </label>
        <select
          id={`mobile-status-${row.app.id}`}
          value={currentStatus}
          onChange={(event) => onPending(event.target.value as ReviewStatus)}
          className={`col-span-2 rounded-md border bg-background px-3 py-2 text-sm sm:col-span-1 ${
            isDirty ? "border-warning" : "border-input"
          }`}
        >
          {REVIEW_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={onSave}
          disabled={!isDirty}
          className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-35"
        >
          <Save className="h-3.5 w-3.5" /> 상태 저장
        </button>
        <Link
          to="/producer/shows/$id/applicants/$appId"
          params={{ id: showId, appId: row.app.id }}
          className="inline-flex items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
        >
          <Eye className="h-3.5 w-3.5" /> 상세 보기
        </Link>
      </div>
    </article>
  );
}

function CompareDialog({ rows, onClose }: { rows: RowModel[]; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
    >
      <div className="mx-auto my-8 max-w-6xl rounded-2xl bg-card p-5 shadow-2xl md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="compare-title" className="text-xl font-semibold">
              지원자 비교
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              배역, 경력, 제출 자료와 평가를 같은 기준으로 비교합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 rounded-lg border border-input px-4 text-sm font-semibold"
          >
            닫기
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border p-3 text-left text-muted-foreground">
                  비교 항목
                </th>
                {rows.map((row) => (
                  <th key={row.app.id} className="border-b border-border p-3 text-left text-lg">
                    {row.app.applicantName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="지원 배역" rows={rows} value={(row) => row.roleNames} />
              <CompareRow
                label="기본 정보"
                rows={rows}
                value={(row) =>
                  `${row.applicant?.gender ?? "-"} · ${row.age ? `${row.age}세` : "-"} · ${
                    row.applicant?.height ?? "-"
                  }`
                }
              />
              <CompareRow label="주요 경력" rows={rows} value={(row) => row.mainCareer} />
              <CompareRow
                label="제출 자료"
                rows={rows}
                value={(row) =>
                  `경력 ${row.app.selectedCareerIds.length} · 사진 ${row.app.selectedPhotoIds.length} · 영상 ${row.app.selectedVideoIds.length}`
                }
              />
              <CompareRow
                label="평가"
                rows={rows}
                value={(row) => `${row.app.rating ?? 0} / 5점`}
              />
              <CompareRow label="상태" rows={rows} value={(row) => row.app.reviewStatus} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  rows,
  value,
}: {
  label: string;
  rows: RowModel[];
  value: (row: RowModel) => string;
}) {
  return (
    <tr>
      <th className="border-b border-border bg-secondary/40 p-3 text-left">{label}</th>
      {rows.map((row) => (
        <td key={row.app.id} className="border-b border-border p-3 text-muted-foreground">
          {value(row)}
        </td>
      ))}
    </tr>
  );
}

function ApplicantPortrait({
  applicant,
  name,
}: {
  applicant: Applicant | undefined;
  name: string;
}) {
  const photo = applicant?.photos.find((item) => item.isDefault) ?? applicant?.photos[0];

  if (photo?.image) {
    return (
      <img
        src={photo.image}
        alt={`${name} 프로필`}
        loading="lazy"
        className="h-full min-h-40 w-full object-cover object-top sm:min-h-52"
      />
    );
  }

  return (
    <div
      className="grid min-h-40 w-full place-items-center text-3xl font-bold text-white sm:min-h-52"
      style={{
        background: photo?.color ?? "var(--primary)",
      }}
      aria-label={`${name} 프로필 이미지 대체 영역`}
    >
      {name.charAt(0)}
    </div>
  );
}

function MaterialSummary({ app }: { app: Application }) {
  return (
    <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <FileText className="h-3.5 w-3.5" /> {app.selectedCareerIds.length}
      </span>
      <span className="inline-flex items-center gap-1">
        <ImageIcon className="h-3.5 w-3.5" /> {app.selectedPhotoIds.length}
      </span>
      <span className="inline-flex items-center gap-1">
        <VideoIcon className="h-3.5 w-3.5" /> {app.selectedVideoIds.length}
      </span>
      <span className={`inline-flex items-center gap-1 ${app.memo ? "text-primary" : ""}`}>
        <StickyNote className="h-3.5 w-3.5" /> {app.memo ? 1 : 0}
      </span>
    </div>
  );
}

function ResultCheck({
  passed,
  label,
  detail,
}: {
  passed: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
        passed ? "border-success/30 bg-success/10" : "border-warning/35 bg-warning/10"
      }`}
    >
      {passed ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
      ) : (
        <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
      )}
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberFilter({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
}) {
  return (
    <label className="text-xs font-medium text-muted-foreground">
      {label}
      <div className="mt-1 flex items-center rounded-md border border-input bg-background">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none"
        />
        <span className="pr-3">{suffix}</span>
      </div>
    </label>
  );
}

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "warning" | "success";
}) {
  const color =
    accent === "warning"
      ? "bg-warning/15 text-warning-foreground"
      : accent === "success"
        ? "bg-success/15 text-success"
        : "bg-secondary text-secondary-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${color}`}
    >
      {label} <strong>{value}</strong>
    </span>
  );
}
