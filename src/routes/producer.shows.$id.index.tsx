import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useStore,
  daysUntil,
  type Applicant,
  type Application,
  type ReviewStatus,
} from "@/lib/store";
import { ReviewBadge } from "@/components/status-badge";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Eye,
  FileText,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Search,
  StickyNote,
  Video as VideoIcon,
} from "lucide-react";

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
  const show = useStore((s) => s.shows.find((item) => item.id === id));
  const allApplications = useStore((s) => s.applications);
  const updateReview = useStore((s) => s.updateReview);
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

  if (!show) throw notFound();

  const applications = allApplications.filter((application) => application.showId === id);
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
          age: Number.isFinite(birthYear) ? 2026 - birthYear + 1 : null,
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
    if (
      (nextStatus === "합격" || nextStatus === "불합격") &&
      !window.confirm(`검토 상태를 '${nextStatus}'으로 변경하시겠습니까?`)
    ) {
      return;
    }

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
            지원 마감 {show.deadline} · D-{daysUntil(show.deadline)} · 오디션 {show.auditionDate}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
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
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-elev-1)] lg:block">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">지원자</th>
                  <th className="px-4 py-3 font-medium">지원 배역</th>
                  <th className="px-4 py-3 font-medium">프로필</th>
                  <th className="px-4 py-3 font-medium">주요 경력</th>
                  <th className="px-4 py-3 font-medium">제출 자료</th>
                  <th className="px-4 py-3 font-medium">지원일</th>
                  <th className="px-4 py-3 font-medium">검토 상태</th>
                  <th className="px-4 py-3 text-right font-medium">상세</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <ApplicantTableRow
                    key={row.app.id}
                    row={row}
                    showId={show.id}
                    pendingStatus={pending[row.app.id]}
                    onPending={(status) =>
                      setPending((current) => ({ ...current, [row.app.id]: status }))
                    }
                    onSave={() => saveOne(row.app.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
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
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ApplicantTableRow({
  row,
  showId,
  pendingStatus,
  onPending,
  onSave,
}: {
  row: RowModel;
  showId: string;
  pendingStatus?: ReviewStatus;
  onPending: (status: ReviewStatus) => void;
  onSave: () => void;
}) {
  const currentStatus = pendingStatus ?? row.app.reviewStatus;
  const isDirty = Boolean(pendingStatus && pendingStatus !== row.app.reviewStatus);

  return (
    <tr className={isDirty ? "bg-warning/5" : "hover:bg-surface/70"}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar applicant={row.applicant} name={row.app.applicantName} />
          <div>
            <div className="font-semibold">{row.app.applicantName}</div>
            <ReviewBadge status={row.app.reviewStatus} className="mt-1" />
          </div>
        </div>
      </td>
      <td className="max-w-40 px-4 py-3 font-medium">{row.roleNames || "-"}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {row.applicant?.gender ?? "-"} · {row.age ? `${row.age}세` : "-"}
        <br />
        {row.applicant?.height ?? "-"}
      </td>
      <td className="max-w-52 px-4 py-3 text-xs">{row.mainCareer}</td>
      <td className="px-4 py-3">
        <MaterialSummary app={row.app} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
        {row.app.submittedAt}
      </td>
      <td className="px-4 py-3">
        <div className="flex min-w-56 items-center gap-2">
          <label className="sr-only" htmlFor={`status-${row.app.id}`}>
            {row.app.applicantName} 검토 상태
          </label>
          <select
            id={`status-${row.app.id}`}
            value={currentStatus}
            onChange={(event) => onPending(event.target.value as ReviewStatus)}
            className={`min-w-0 flex-1 rounded-md border bg-background px-2 py-1.5 text-xs ${
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
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-35"
          >
            <Save className="h-3.5 w-3.5" /> 저장
          </button>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          to="/producer/shows/$id/applicants/$appId"
          params={{ id: showId, appId: row.app.id }}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-secondary"
        >
          <Eye className="h-3.5 w-3.5" /> 상세 보기
        </Link>
      </td>
    </tr>
  );
}

function ApplicantCard({
  row,
  showId,
  pendingStatus,
  onPending,
  onSave,
}: {
  row: RowModel;
  showId: string;
  pendingStatus?: ReviewStatus;
  onPending: (status: ReviewStatus) => void;
  onSave: () => void;
}) {
  const currentStatus = pendingStatus ?? row.app.reviewStatus;
  const isDirty = Boolean(pendingStatus && pendingStatus !== row.app.reviewStatus);

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-card ${
        isDirty ? "border-warning/60" : "border-border"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <Avatar applicant={row.applicant} name={row.app.applicantName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">{row.app.applicantName}</h2>
            <ReviewBadge status={row.app.reviewStatus} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {row.applicant?.gender ?? "-"} · {row.age ? `${row.age}세` : "-"} ·{" "}
            {row.applicant?.height ?? "-"}
          </div>
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">지원 배역 </span>
            <strong>{row.roleNames || "-"}</strong>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">{row.mainCareer}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-y border-border bg-surface px-4 py-2.5">
        <MaterialSummary app={row.app} />
        <span className="text-[11px] text-muted-foreground">{row.app.submittedAt}</span>
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-[1fr_auto_auto]">
        <label className="sr-only" htmlFor={`mobile-status-${row.app.id}`}>
          {row.app.applicantName} 검토 상태
        </label>
        <select
          id={`mobile-status-${row.app.id}`}
          value={currentStatus}
          onChange={(event) => onPending(event.target.value as ReviewStatus)}
          className={`rounded-md border bg-background px-3 py-2 text-sm ${
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

function Avatar({ applicant, name }: { applicant: Applicant | undefined; name: string }) {
  return (
    <div
      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-base font-bold text-white shadow-sm"
      style={{
        background: applicant?.photos[0]?.color ?? "var(--primary)",
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
