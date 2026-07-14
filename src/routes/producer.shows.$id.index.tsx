import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore, daysUntil, type ReviewStatus } from "@/lib/store";
import { ReviewBadge } from "@/components/status-badge";
import { ChevronLeft, Check, Image as ImageIcon, Video as VideoIcon } from "lucide-react";

export const Route = createFileRoute("/producer/shows/$id/")({
  component: ShowApplicants,
});

const REVIEW_STATUSES: ReviewStatus[] = ["미확인", "검토 중", "오디션 대상", "보류", "탈락"];

function ShowApplicants() {
  const { id } = Route.useParams();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const allApps = useStore((s) => s.applications);
  const apps = allApps.filter((a) => a.showId === id);

  const [roleFilter, setRoleFilter] = useState<string>("전체");
  const [statusFilter, setStatusFilter] = useState<string>("전체");

  if (!show) throw notFound();

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (roleFilter !== "전체" && !a.roleIds.includes(roleFilter)) return false;
      if (statusFilter !== "전체" && a.reviewStatus !== statusFilter) return false;
      return true;
    });
  }, [apps, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <Link to="/producer" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> 대시보드로
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">{show.producer}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{show.title}</h1>
          <div className="mt-1 text-sm text-muted-foreground">
            마감 {show.deadline} (D-{daysUntil(show.deadline)}) · 오디션 {show.auditionDate}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <StatChip label="전체" value={apps.length} />
          <StatChip label="미확인" value={apps.filter((a) => a.reviewStatus === "미확인").length} accent="warning" />
          <StatChip label="오디션 대상" value={apps.filter((a) => a.reviewStatus === "오디션 대상").length} accent="success" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="전체">지원 배역 전체</option>
          {show.roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="전체">검토 상태 전체</option>
          {REVIEW_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-xs">
            <tr>
              <th className="px-4 py-3 text-left">지원자</th>
              <th className="px-4 py-3 text-left">지원 배역</th>
              <th className="px-4 py-3 text-left">지원일</th>
              <th className="px-4 py-3 text-left">주요 경력</th>
              <th className="px-4 py-3 text-left">사진</th>
              <th className="px-4 py-3 text-left">영상</th>
              <th className="px-4 py-3 text-left">검토 상태</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const roleName = a.roleIds.map((r) => show.roles.find((sr) => sr.id === r)?.name).join(", ");
              return (
                <tr key={a.id} className="border-t border-border hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {a.applicantName.charAt(0)}
                      </div>
                      <div className="font-medium">{a.applicantName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{roleName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.submittedAt.split(" ")[0]}</td>
                  <td className="px-4 py-3 text-xs">{a.selectedCareerIds.length}건</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <ImageIcon className="h-3.5 w-3.5" /> {a.selectedPhotoIds.length}
                      {a.selectedPhotoIds.length > 0 && <Check className="h-3 w-3 text-success" />}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <VideoIcon className="h-3.5 w-3.5" /> {a.selectedVideoIds.length}
                      {a.selectedVideoIds.length > 0 && <Check className="h-3 w-3 text-success" />}
                    </span>
                  </td>
                  <td className="px-4 py-3"><ReviewBadge status={a.reviewStatus} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/producer/shows/$id/applicants/$appId"
                      params={{ id: show.id, appId: a.id }}
                      className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  조건에 맞는 지원자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatChip({ label, value, accent }: { label: string; value: number; accent?: "warning" | "success" }) {
  const color =
    accent === "warning" ? "bg-warning/15 text-warning-foreground"
      : accent === "success" ? "bg-success/15 text-success"
        : "bg-secondary text-secondary-foreground";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ${color}`}>
      {label} <strong>{value}</strong>
    </span>
  );
}
