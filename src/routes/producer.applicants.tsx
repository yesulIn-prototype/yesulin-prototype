import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ReviewBadge } from "@/components/status-badge";
import { useStore } from "@/lib/store";
import { Eye, Search, Users } from "lucide-react";

export const Route = createFileRoute("/producer/applicants")({
  component: AllApplicants,
});

function AllApplicants() {
  const applications = useStore((s) => s.applications);
  const shows = useStore((s) => s.shows);
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const list = useMemo(
    () =>
      applications.filter((application) => {
        if (query && !application.applicantName.includes(query.trim())) return false;
        if (showFilter !== "전체" && application.showId !== showFilter) return false;
        if (statusFilter !== "전체" && application.reviewStatus !== statusFilter) return false;
        return true;
      }),
    [applications, query, showFilter, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">지원자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          전체 지원자를 찾고, 공연별 상세 화면에서 자료와 평가를 이어서 검토합니다.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[1fr_auto_auto]">
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
          <span className="sr-only">검토 상태 필터</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="전체">검토 상태 전체</option>
            {["미확인", "검토 중", "오디션 대상", "보류", "합격", "불합격"].map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <div className="text-xs text-muted-foreground md:col-span-3">
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
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-surface text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">지원자</th>
                  <th className="px-4 py-3 text-left font-medium">공연</th>
                  <th className="px-4 py-3 text-left font-medium">지원 배역</th>
                  <th className="px-4 py-3 text-left font-medium">지원 시간</th>
                  <th className="px-4 py-3 text-left font-medium">검토 상태</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((application) => {
                  const show = shows.find((item) => item.id === application.showId);
                  const roleName = application.roleIds
                    .map((roleId) => show?.roles.find((role) => role.id === roleId)?.name)
                    .join(", ");
                  return (
                    <tr key={application.id} className="hover:bg-surface/70">
                      <td className="px-4 py-3 font-medium">{application.applicantName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{show?.title}</td>
                      <td className="px-4 py-3">{roleName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {application.submittedAt}
                      </td>
                      <td className="px-4 py-3">
                        <ReviewBadge status={application.reviewStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {show && (
                          <Link
                            to="/producer/shows/$id/applicants/$appId"
                            params={{ id: show.id, appId: application.id }}
                            className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" /> 상세 보기
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {list.map((application) => {
              const show = shows.find((item) => item.id === application.showId);
              const roleName = application.roleIds
                .map((roleId) => show?.roles.find((role) => role.id === roleId)?.name)
                .join(", ");
              return (
                <article
                  key={application.id}
                  className="rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{application.applicantName}</h2>
                      <div className="mt-1 text-xs text-muted-foreground">{show?.title}</div>
                    </div>
                    <ReviewBadge status={application.reviewStatus} />
                  </div>
                  <div className="mt-3 rounded-lg bg-surface px-3 py-2 text-sm">
                    <span className="text-muted-foreground">지원 배역 </span>
                    <strong>{roleName}</strong>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {application.submittedAt}
                  </div>
                  {show && (
                    <Link
                      to="/producer/shows/$id/applicants/$appId"
                      params={{ id: show.id, appId: application.id }}
                      className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" /> 지원서 상세 보기
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
