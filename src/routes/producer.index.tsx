import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  Send,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Poster } from "@/components/poster";
import { ReviewBadge } from "@/components/status-badge";
import {
  Metric,
  PageHeader,
  Surface,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/workspace-ui";
import {
  daysUntil,
  getApplicationStageProgress,
  getAuditionStages,
  useProducerWorkspace,
  useStore,
} from "@/lib/store";

export const Route = createFileRoute("/producer/")({
  component: ProducerHome,
});

function ProducerHome() {
  const { shows, applications } = useProducerWorkspace();
  const getApplicantById = useStore((state) => state.getApplicantById);
  const activeShows = shows.filter(
    (show) => show.status === "모집 중" && show.publicationStatus !== "임시 저장",
  );
  const uniqueApplicants = new Set(applications.map((application) => application.applicantId)).size;
  const unreviewed = applications.filter((application) => application.reviewStatus === "미확인");
  const shortlisted = applications.filter((application) => application.shortlisted);
  const closingSoon = activeShows
    .filter((show) => {
      const days = daysUntil(show.deadline);
      return days >= 0 && days <= 3;
    })
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
  const resultWork = shows
    .filter((show) => !show.resultsSentAt && daysUntil(show.deadline) < 0)
    .map((show) => {
      const showApplications = applications.filter((application) => application.showId === show.id);
      const finalStageId = getAuditionStages(show).at(-1)?.id;
      const completedCount = showApplications.filter((application) => {
        const progress = getApplicationStageProgress(application, show);
        return (
          progress.result === "불합격" ||
          progress.result === "불참" ||
          (progress.stage.id === finalStageId && progress.result === "합격")
        );
      }).length;
      return {
        show,
        applicationCount: showApplications.length,
        completedCount,
        announcementDays: show.resultAnnouncementDate
          ? daysUntil(show.resultAnnouncementDate)
          : null,
      };
    })
    .filter((item) => item.applicationCount > 0 && item.announcementDays !== null);
  const readyToSend = resultWork.filter(
    (item) =>
      item.announcementDays !== null &&
      item.announcementDays <= 0 &&
      item.completedCount === item.applicationCount,
  );
  const resultsToComplete = resultWork.filter(
    (item) =>
      item.announcementDays !== null &&
      item.announcementDays <= 3 &&
      item.completedCount < item.applicationCount,
  );
  const todayTaskCount =
    (unreviewed.length > 0 ? 1 : 0) +
    readyToSend.length +
    resultsToComplete.length +
    closingSoon.length;
  const todayLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());

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

      <Surface
        title="오늘 할 일"
        description={`${todayLabel} · 일정과 지원자 상태를 기준으로 우선순위를 정리했습니다.`}
        action={
          <span
            className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-bold ${
              todayTaskCount > 0
                ? "bg-primary text-primary-foreground"
                : "bg-success/10 text-success"
            }`}
          >
            {todayTaskCount > 0 ? `${todayTaskCount}개 업무` : "모두 완료"}
          </span>
        }
      >
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {readyToSend.map(({ show, applicationCount }) => (
            <ActionTask
              key={`send-${show.id}`}
              icon={Send}
              tone="urgent"
              label="발송 가능"
              title={`${show.title} 결과를 보낼 수 있어요`}
              description={`전체 ${applicationCount}명의 결과 저장과 발표 날짜 확인이 완료되었습니다.`}
              action={
                <Link to="/producer/shows/$id" params={{ id: show.id }} className={taskActionClass}>
                  발송 확인 <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          ))}

          {unreviewed.length > 0 && (
            <ActionTask
              icon={ClipboardCheck}
              tone="warning"
              label="검토 필요"
              title={`새 지원서 ${unreviewed.length}건이 기다리고 있어요`}
              description="아직 열어보지 않은 지원서를 최근 제출 순으로 확인해 주세요."
              action={
                <Link to="/producer/applicants" className={taskActionClass}>
                  검토 시작 <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          )}

          {resultsToComplete.map(({ show, applicationCount, completedCount, announcementDays }) => (
            <ActionTask
              key={`result-${show.id}`}
              icon={BellRing}
              tone="warning"
              label={announcementDays !== null && announcementDays <= 0 ? "발표 지연" : "발표 예정"}
              title={`${show.title} 결과를 마무리해 주세요`}
              description={`${applicationCount - completedCount}명의 최종 결과가 비어 있습니다 · 발표 ${
                announcementDays === 0
                  ? "오늘"
                  : announcementDays !== null && announcementDays < 0
                    ? `${Math.abs(announcementDays)}일 지남`
                    : `D-${announcementDays}`
              }`}
              action={
                <Link to="/producer/shows/$id" params={{ id: show.id }} className={taskActionClass}>
                  결과 입력 <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          ))}

          {closingSoon.map((show) => {
            const dDay = daysUntil(show.deadline);
            const applicationCount = applications.filter(
              (application) => application.showId === show.id,
            ).length;
            return (
              <ActionTask
                key={`deadline-${show.id}`}
                icon={CalendarClock}
                tone="information"
                label={dDay === 0 ? "오늘 마감" : `D-${dDay}`}
                title={`${show.title} 모집 마감이 가까워요`}
                description={`지원서 ${applicationCount}건 · ${show.deadline} 마감`}
                action={
                  <Link
                    to="/producer/shows/$id"
                    params={{ id: show.id }}
                    className={taskActionClass}
                  >
                    마감 관리 <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            );
          })}

          {todayTaskCount === 0 && (
            <div className="flex items-center gap-4 bg-success/5 p-5 md:p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success text-success-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold">오늘 처리할 긴급 업무가 없습니다.</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  새로운 지원이나 일정 변화가 생기면 이곳에 우선 표시됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </Surface>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="진행 중인 모집" value={`${activeShows.length}건`} />
        <Metric label="고유 지원자" value={`${uniqueApplicants}명`} />
        <Metric
          label="미확인 지원서"
          value={`${unreviewed.length}건`}
          tone={unreviewed.length > 0 ? "warning" : "default"}
        />
        <Metric
          label="관심 지원자"
          value={`${shortlisted.length}명`}
          hint="다시 검토하려고 별표 표시한 지원자"
          tone="success"
        />
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
                        className="h-full w-full object-contain"
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
        <Surface
          title="관심 지원자"
          description="캐스팅 후보로 다시 확인할 수 있도록 별표 표시해 둔 지원자입니다."
        >
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

const taskActionClass =
  "inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-semibold transition hover:border-primary hover:bg-secondary";

const taskTone = {
  urgent: {
    icon: "bg-destructive/10 text-destructive",
    label: "bg-destructive/10 text-destructive",
  },
  warning: {
    icon: "bg-warning/15 text-warning-foreground",
    label: "bg-warning/15 text-warning-foreground",
  },
  information: {
    icon: "bg-information/10 text-information",
    label: "bg-information/10 text-information",
  },
} as const;

function ActionTask({
  icon: Icon,
  tone,
  label,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  tone: keyof typeof taskTone;
  label: string;
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 bg-card p-4 md:flex-row md:items-center md:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-3.5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${taskTone[tone].icon}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${taskTone[tone].label}`}
          >
            {label}
          </span>
          <div className="mt-2 font-semibold tracking-[-0.01em]">{title}</div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="pl-[3.4rem] md:pl-0">{action}</div>
    </div>
  );
}
