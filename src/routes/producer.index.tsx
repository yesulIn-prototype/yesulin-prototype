import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarClock, FilePlus2, Star, Users } from "lucide-react";
import { Poster } from "@/components/poster";
import { ReviewBadge } from "@/components/status-badge";
import {
  Metric,
  PageHeader,
  Surface,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/workspace-ui";
import { daysUntil, useStore } from "@/lib/store";

export const Route = createFileRoute("/producer/")({
  component: ProducerHome,
});

function ProducerHome() {
  const shows = useStore((state) => state.shows);
  const applications = useStore((state) => state.applications);
  const getApplicantById = useStore((state) => state.getApplicantById);
  const activeShows = shows.filter(
    (show) => show.status === "모집 중" && show.publicationStatus !== "임시 저장",
  );
  const uniqueApplicants = new Set(applications.map((application) => application.applicantId)).size;
  const unreviewed = applications.filter((application) => application.reviewStatus === "미확인");
  const shortlisted = applications.filter((application) => application.shortlisted);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Casting workspace"
        title="오늘 결정이 필요한 지원자부터 확인하세요."
        description="미확인 지원서와 마감이 가까운 공고를 우선순위에 맞춰 정리했습니다."
        actions={
          <div className="flex gap-2">
            <Link to="/producer/applicants" className={secondaryButtonClass}>
              <Users className="h-4 w-4" /> 전체 지원서
            </Link>
            <Link to="/producer/create" className={primaryButtonClass}>
              <FilePlus2 className="h-4 w-4" /> 새 공고
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="진행 중인 모집" value={`${activeShows.length}건`} />
        <Metric label="고유 지원자" value={`${uniqueApplicants}명`} />
        <Metric
          label="미확인 지원서"
          value={`${unreviewed.length}건`}
          tone={unreviewed.length > 0 ? "warning" : "default"}
        />
        <Metric label="숏리스트" value={`${shortlisted.length}명`} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Surface
          title="검토 대기"
          description="아직 확인하지 않은 최근 지원서입니다."
          action={
            <Link to="/producer/applicants" className="text-sm font-semibold hover:underline">
              모두 보기 →
            </Link>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {unreviewed.slice(0, 4).map((application) => {
              const show = shows.find((item) => item.id === application.showId);
              const applicant = getApplicantById(application.applicantId);
              const photo =
                applicant?.photos.find((item) => item.isDefault && item.image) ??
                applicant?.photos.find((item) => item.image);
              return (
                <Link
                  key={application.id}
                  to="/producer/shows/$id/applicants/$appId"
                  params={{ id: application.showId, appId: application.id }}
                  className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-secondary">
                    {photo?.image ? (
                      <img
                        src={photo.image}
                        alt={`${application.applicantName} 지원자 프로필`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-4xl font-semibold text-muted-foreground/40">
                        {application.applicantName.slice(0, 1)}
                      </span>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-warning px-2.5 py-1 text-[11px] font-semibold text-warning-foreground shadow-sm">
                      미확인
                    </span>
                  </span>
                  <span className="flex items-center gap-3 p-4">
                    <span className="min-w-0 flex-1">
                      <strong className="block">{application.applicantName}</strong>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {show?.title} · {application.submittedAt}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </Link>
              );
            })}
            {unreviewed.length === 0 && (
              <div className="col-span-full rounded-xl bg-secondary/60 p-6 text-center text-sm text-muted-foreground">
                미확인 지원서가 없습니다.
              </div>
            )}
          </div>
        </Surface>

        <Surface title="모집 마감 관리" description="마감이 가까운 공고부터 확인합니다.">
          <div className="space-y-3">
            {activeShows
              .slice()
              .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
              .slice(0, 4)
              .map((show) => {
                const count = applications.filter(
                  (application) => application.showId === show.id,
                ).length;
                const dDay = daysUntil(show.deadline);
                return (
                  <Link
                    key={show.id}
                    to="/producer/shows/$id"
                    params={{ id: show.id }}
                    className="block rounded-xl border border-border p-4 hover:border-primary"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{show.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">지원서 {count}건</div>
                      </div>
                      <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                        {dDay < 0 ? "마감" : dDay === 0 ? "오늘" : `D-${dDay}`}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </Surface>
      </div>

      <Surface
        title="진행 중인 공고"
        description="게시된 모집 공고와 지원 현황입니다."
        action={
          <Link to="/producer/shows" className="text-sm font-semibold hover:underline">
            공고 전체 보기 →
          </Link>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeShows.map((show) => {
            const showApplications = applications.filter(
              (application) => application.showId === show.id,
            );
            const showUnreviewed = showApplications.filter(
              (application) => application.reviewStatus === "미확인",
            ).length;
            return (
              <Link
                key={show.id}
                to="/producer/shows/$id"
                params={{ id: show.id }}
                className="flex overflow-hidden rounded-xl border border-border hover:border-primary"
              >
                <Poster
                  title={show.title}
                  color={show.posterColor}
                  image={show.posterImage}
                  imagePosition={show.posterPosition}
                  kind={show.kind}
                  showText={false}
                  className="w-24 shrink-0"
                />
                <div className="min-w-0 flex-1 p-4">
                  <div className="truncate font-semibold">{show.title}</div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <span>지원 {showApplications.length}</span>
                    <span
                      className={showUnreviewed > 0 ? "font-semibold text-warning-foreground" : ""}
                    >
                      미확인 {showUnreviewed}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarClock className="h-3.5 w-3.5" /> {show.deadline}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Surface>

      {shortlisted.length > 0 && (
        <Surface title="숏리스트">
          <div className="flex flex-wrap gap-2">
            {shortlisted.map((application) => (
              <Link
                key={application.id}
                to="/producer/shows/$id/applicants/$appId"
                params={{ id: application.showId, appId: application.id }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold"
              >
                <Star className="h-4 w-4 fill-gold text-gold" /> {application.applicantName}
                <ReviewBadge status={application.reviewStatus} />
              </Link>
            ))}
          </div>
        </Surface>
      )}
    </div>
  );
}
