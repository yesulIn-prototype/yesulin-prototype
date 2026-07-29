import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BellRing,
  CalendarDays,
  FileText,
  Image,
  Maximize2,
  Video,
  X,
} from "lucide-react";
import { QuestionAnswerList } from "@/components/question-answer-list";
import { ApplyBadge } from "@/components/status-badge";
import { useStore, type Photo } from "@/lib/store";

export const Route = createFileRoute("/applicant/applications_/$appId")({
  component: ApplicationDetail,
});

function ApplicationDetail() {
  const { appId } = Route.useParams();
  const applicant = useStore((state) => state.applicant);
  const application = useStore((state) =>
    state.applications.find((item) => item.id === appId && item.applicantId === applicant.id),
  );
  const show = useStore((state) => state.shows.find((item) => item.id === application?.showId));
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [hasHydrated, setHasHydrated] = useState(() => useStore.persist.hasHydrated());

  useEffect(() => {
    setHasHydrated(useStore.persist.hasHydrated());
    return useStore.persist.onFinishHydration(() => setHasHydrated(true));
  }, []);

  useEffect(() => {
    if (!selectedPhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedPhoto]);

  if (!hasHydrated) {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
        제출한 지원서를 불러오고 있습니다.
      </div>
    );
  }

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
        {application.resultNotifiedAt && (
          <div className="mb-5 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">
            <BellRing className="h-4 w-4" />
            {new Date(application.resultNotifiedAt).toLocaleString("ko-KR")}에 최종 결과가
            도착했습니다.
          </div>
        )}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-70">{show.producer}</div>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{show.title}</h1>
            <p className="mt-2 text-sm opacity-80">
              {application.submittedAt} 제출 · {roles.map((role) => role.name).join(", ")}
            </p>
          </div>
          <ApplyBadge
            status={application.applyStatus}
            className="min-h-8 border-white/80 bg-white px-3 py-2 text-xs font-bold text-primary shadow-md"
          />
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

      <Section title={`제출 사진 (${photos.length}장)`}>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Image className="h-4 w-4" /> 사진을 선택하면 원본 크기로 확인할 수 있습니다.
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedPhoto(photo)}
              aria-label={`${photo.fileName} 크게 보기`}
              className="group overflow-hidden rounded-xl border border-border bg-secondary/50 text-left transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="relative flex aspect-[3/4] items-center justify-center overflow-hidden">
                {photo.image ? (
                  <img
                    src={photo.image}
                    alt={photo.type}
                    className="h-full w-full object-contain object-center"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">미리보기 없음</span>
                )}
                <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="h-4 w-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-xs font-semibold text-white">
                  {photo.type}
                </span>
              </span>
              <span className="block truncate px-3 py-2 text-xs font-medium">{photo.fileName}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title={`제출 영상 (${videos.length}개)`}>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Video className="h-4 w-4" /> 재생 버튼으로 제출 영상을 바로 검토할 수 있습니다.
        </div>
        <div className="grid gap-4">
          {videos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-xl border border-border">
              {video.url ? (
                <video
                  controls
                  preload="metadata"
                  poster={photos[0]?.image}
                  className="aspect-video w-full bg-black object-contain"
                >
                  <source src={video.url} />
                  브라우저에서 영상 재생을 지원하지 않습니다.
                </video>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-secondary text-sm text-muted-foreground">
                  재생 가능한 영상 파일이 없습니다.
                </div>
              )}
              <div className="p-4">
                <div className="font-semibold">{video.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {video.type} · {video.duration} · {video.fileName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="추가 질문 답변">
        {show.additionalQuestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">추가 질문이 없는 공고입니다.</p>
        ) : (
          <QuestionAnswerList questions={show.additionalQuestions} answers={application.answers} />
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

      {selectedPhoto?.image && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedPhoto.fileName} 확대 보기`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="확대 사진 닫기"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-[92vh] max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={selectedPhoto.image}
              alt={selectedPhoto.type}
              className="max-h-[84vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <div className="mt-3 text-center text-sm font-semibold text-white">
              {selectedPhoto.fileName} · {selectedPhoto.type}
            </div>
          </div>
        </div>
      )}
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
