import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, daysUntil, type ReviewStatus } from "@/lib/store";
import { ReviewBadge } from "@/components/status-badge";
import {
  ChevronLeft,
  Image as ImageIcon,
  Video as VideoIcon,
  StickyNote,
  FileText,
  Save,
  Search,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/producer/shows/$id/")({
  component: ShowApplicants,
});

const REVIEW_STATUSES: ReviewStatus[] = ["미확인", "검토 중", "오디션 대상", "보류", "합격", "불합격"];
type SortKey = "recent" | "name" | "career";

function ShowApplicants() {
  const { id } = Route.useParams();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const allApps = useStore((s) => s.applications);
  const updateReview = useStore((s) => s.updateReview);
  const getApplicantById = useStore((s) => s.getApplicantById);
  const apps = allApps.filter((a) => a.showId === id);

  const [roleFilter, setRoleFilter] = useState<string>("전체");
  const [statusFilter, setStatusFilter] = useState<string>("전체");
  const [genderFilter, setGenderFilter] = useState<string>("전체");
  const [nameQuery, setNameQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  // Per-card pending status changes
  const [pending, setPending] = useState<Record<string, ReviewStatus>>({});

  if (!show) throw notFound();

  const filtered = useMemo(() => {
    const list = apps.filter((a) => {
      if (roleFilter !== "전체" && !a.roleIds.includes(roleFilter)) return false;
      if (statusFilter !== "전체" && a.reviewStatus !== statusFilter) return false;
      if (nameQuery.trim() && !a.applicantName.includes(nameQuery.trim())) return false;
      if (genderFilter !== "전체") {
        const applicant = getApplicantById(a.applicantId);
        if (applicant?.gender !== genderFilter) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.applicantName.localeCompare(b.applicantName, "ko"));
    else if (sort === "career")
      sorted.sort((a, b) => b.selectedCareerIds.length - a.selectedCareerIds.length);
    else sorted.sort((a, b) => (a.submittedAt > b.submittedAt ? -1 : 1));
    return sorted;
  }, [apps, roleFilter, statusFilter, genderFilter, nameQuery, sort, getApplicantById]);

  const dirtyCount = Object.keys(pending).length;

  function saveOne(appId: string) {
    const next = pending[appId];
    if (!next) return;
    updateReview(appId, { reviewStatus: next });
    setPending((p) => {
      const { [appId]: _, ...rest } = p;
      return rest;
    });
  }

  return (
    <div className="space-y-6">
      <Link
        to="/producer"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> 대시보드로
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{show.producer}</div>
          <h1 className="truncate text-2xl font-semibold tracking-tight">{show.title}</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            마감 {show.deadline} (D-{daysUntil(show.deadline)}) · 오디션 {show.auditionDate}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <StatChip label="전체" value={apps.length} />
          <StatChip label="미확인" value={apps.filter((a) => a.reviewStatus === "미확인").length} accent="warning" />
          <StatChip
            label="오디션 대상"
            value={apps.filter((a) => a.reviewStatus === "오디션 대상").length}
            accent="success"
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="이름 검색"
              className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">지원 배역 전체</option>
            {show.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">검토 상태 전체</option>
            {REVIEW_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">성별 전체</option>
            <option value="여성">여성</option>
            <option value="남성">남성</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="recent">최신 지원순</option>
            <option value="name">이름순</option>
            <option value="career">경력순</option>
          </select>
          <div className="flex items-center justify-end text-xs text-muted-foreground">
            총 {filtered.length}명
          </div>
        </div>

        {dirtyCount > 0 && (
          <div className="flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            저장되지 않은 상태 변경이 {dirtyCount}건 있습니다. 각 카드의 <strong>변경사항 저장</strong>{" "}
            버튼을 눌러 확정하세요.
          </div>
        )}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-16 text-center text-sm text-muted-foreground">
          조건에 맞는 지원자가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => {
            const applicant = getApplicantById(a.applicantId);
            const roleNames = a.roleIds
              .map((r) => show.roles.find((sr) => sr.id === r)?.name)
              .filter(Boolean)
              .join(", ");
            const memoCount = a.memo.trim() ? 1 : 0;
            const pendingStatus = pending[a.id];
            const currentStatus = pendingStatus ?? a.reviewStatus;
            const isDirty = pendingStatus !== undefined && pendingStatus !== a.reviewStatus;

            return (
              <div
                key={a.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md ${
                  isDirty ? "border-warning/50" : "border-border"
                }`}
              >
                {/* Header */}
                <div className="flex items-start gap-3 p-4">
                  <div
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-lg font-bold text-white"
                    style={{
                      background: applicant?.photos[0]?.color ?? "hsl(var(--primary))",
                    }}
                  >
                    {a.applicantName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate font-semibold">{a.applicantName}</div>
                      <ReviewBadge status={a.reviewStatus} />
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {applicant?.gender ?? "-"} · {applicant?.height ?? "-"} ·{" "}
                      {applicant?.birthDate?.slice(0, 4) ?? "-"}년생
                    </div>
                    <div className="mt-1 truncate text-xs">
                      <span className="text-muted-foreground">지원 배역 </span>
                      <span className="font-medium">{roleNames || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-4 gap-1 border-y border-border bg-secondary/30 px-4 py-2.5 text-center text-[11px]">
                  <MetaCell icon={<FileText className="h-3.5 w-3.5" />} label="경력" value={a.selectedCareerIds.length} />
                  <MetaCell icon={<ImageIcon className="h-3.5 w-3.5" />} label="사진" value={a.selectedPhotoIds.length} />
                  <MetaCell icon={<VideoIcon className="h-3.5 w-3.5" />} label="영상" value={a.selectedVideoIds.length} />
                  <MetaCell
                    icon={<StickyNote className="h-3.5 w-3.5" />}
                    label="메모"
                    value={memoCount}
                    highlight={memoCount > 0}
                  />
                </div>

                <div className="px-4 py-2 text-[11px] text-muted-foreground">
                  지원일 {a.submittedAt}
                </div>

                {/* Status change */}
                <div className="mt-auto space-y-2 border-t border-border p-4">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    검토 상태 변경
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currentStatus}
                      onChange={(e) =>
                        setPending((p) => ({ ...p, [a.id]: e.target.value as ReviewStatus }))
                      }
                      className={`flex-1 rounded-md border bg-background px-2 py-1.5 text-sm ${
                        isDirty ? "border-warning" : "border-input"
                      }`}
                    >
                      {REVIEW_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => saveOne(a.id)}
                      disabled={!isDirty}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
                    >
                      <Save className="h-3.5 w-3.5" />
                      저장
                    </button>
                  </div>
                  <Link
                    to="/producer/shows/$id/applicants/$appId"
                    params={{ id: show.id, appId: a.id }}
                    className="block rounded-md border border-input bg-background px-3 py-1.5 text-center text-xs font-medium hover:bg-secondary"
                  >
                    상세 보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetaCell({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`flex items-center gap-1 ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
        <span className="font-semibold">{value}</span>
      </div>
      <span className="text-muted-foreground">{label}</span>
    </div>
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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${color}`}>
      {label} <strong>{value}</strong>
    </span>
  );
}
