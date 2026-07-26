import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, FileText, Image, Video } from "lucide-react";
import { ApplyBadge } from "@/components/status-badge";
import { PhotoTile } from "@/components/poster";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/applicant/applications_/$appId")({
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { appId } = Route.useParams();
  const application = useStore((state) =>
    state.applications.find((item) => item.id === appId && item.applicantId === "me"),
  );
  const show = useStore((state) => state.shows.find((item) => item.id === application?.showId));
  const applicant = useStore((state) => state.applicant);

  if (!application || !show) throw notFound();

  const roles = show.roles.filter((role) => application.roleIds.includes(role.id));
  const careers = applicant.careers.filter((career) =>
    application.selectedCareerIds.includes(career.id),
  );
  const photos = applicant.photos.filter((photo) =>
    application.selectedPhotoIds.includes(photo.id),
  );
  const videos = applicant.videos.filter((video) =>
    application.selectedVideoIds.includes(video.id),
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/applicant/applications"
        className="inline-flex min-h-10 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> 내 지원 현황
      </Link>

      <header className="rounded-2xl bg-primary p-6 text-primary-foreground md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-70">{show.producer}</div>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{show.title}</h1>
            <p className="mt-2 text-sm opacity-80">
              {application.submittedAt} 제출 · {roles.map((role) => role.name).join(", ")}
            </p>
          </div>
          <ApplyBadge status={application.applyStatus} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Summary label="현재 상태" value={application.applyStatus} />
          <Summary label="오디션 일정" value={show.auditionDate || "미정"} />
          <Summary label="제출 자료" value={`${photos.length + videos.length}개`} />
        </div>
      </header>

      <Section title="지원 배역">
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <span
              key={role.id}
              className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold"
            >
              {role.name}
            </span>
          ))}
        </div>
        {application.motivation && (
          <div className="mt-5">
            <div className="text-sm font-semibold">지원 동기</div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {application.motivation}
            </p>
          </div>
        )}
      </Section>

      <Section title="제출한 프로필과 경력">
        <dl className="grid gap-3 rounded-xl bg-secondary/50 p-4 text-sm sm:grid-cols-2">
          <Detail label="이름" value={applicant.name} />
          <Detail label="활동명" value={applicant.stageName || "-"} />
          <Detail label="연락처" value={applicant.phone} />
          <Detail label="이메일" value={applicant.email} />
        </dl>
        <div className="mt-4 space-y-3">
          {careers.map((career) => (
            <div key={career.id} className="rounded-xl border border-border p-4">
              <div className="font-semibold">{career.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {career.role} · {career.period} · {career.producer}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="제출한 자료">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Image className="h-4 w-4" /> 사진 {photos.length}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="overflow-hidden rounded-xl border border-border">
                  <PhotoTile color={photo.color} label={photo.type} image={photo.image} />
                  <div className="truncate p-2 text-xs">{photo.fileName}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Video className="h-4 w-4" /> 영상 {videos.length}
            </div>
            <div className="space-y-2">
              {videos.map((video) => (
                <div key={video.id} className="rounded-xl border border-border p-3">
                  <div className="font-medium">{video.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {video.type} · {video.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="추가 질문 답변">
        {show.additionalQuestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">추가 질문이 없는 공고입니다.</p>
        ) : (
          <dl className="space-y-4">
            {show.additionalQuestions.map((question) => (
              <div key={question.id}>
                <dt className="text-sm font-semibold">{question.question}</dt>
                <dd className="mt-2 rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
                  {application.answers[question.id] || "미응답"}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/applicant/shows/$id"
          params={{ id: show.id }}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold"
        >
          <FileText className="h-4 w-4" /> 공고 다시 보기
        </Link>
        <Link
          to="/applicant"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <CalendarDays className="h-4 w-4" /> 다음 일정 확인
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-3">
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
