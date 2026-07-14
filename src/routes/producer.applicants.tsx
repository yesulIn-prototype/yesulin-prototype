import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/producer/applicants")({
  component: AllApplicants,
});

function AllApplicants() {
  const applications = useStore((s) => s.applications);
  const shows = useStore((s) => s.shows);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">지원자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          공연별 지원자 관리는 각 공연 상세로 이동해 진행하세요. 여기서는 전체 지원자를 확인합니다.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/60 text-xs">
            <tr>
              <th className="px-4 py-3 text-left">지원자</th>
              <th className="px-4 py-3 text-left">공연</th>
              <th className="px-4 py-3 text-left">지원 배역</th>
              <th className="px-4 py-3 text-left">지원 시간</th>
              <th className="px-4 py-3 text-left">검토 상태</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => {
              const show = shows.find((s) => s.id === a.showId);
              const roleName = a.roleIds.map((r) => show?.roles.find((sr) => sr.id === r)?.name).join(", ");
              return (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{a.applicantName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{show?.title}</td>
                  <td className="px-4 py-3">{roleName}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.submittedAt}</td>
                  <td className="px-4 py-3 text-xs">{a.reviewStatus}</td>
                  <td className="px-4 py-3 text-right">
                    {show && (
                      <Link
                        to="/producer/shows/$id/applicants/$appId"
                        params={{ id: show.id, appId: a.id }}
                        className="rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium"
                      >
                        상세 보기
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
