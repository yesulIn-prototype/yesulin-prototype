import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  getApplicationStageProgress,
  getAuditionStages,
  useStore,
  type StageResult,
} from "@/lib/store";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { PhotoTile, VideoTile } from "@/components/poster";
import { StageResultBadge } from "@/components/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Check,
  ChevronLeft,
  Clock3,
  EyeOff,
  Mail,
  Phone,
  Save,
  User,
  Calendar,
  Maximize2,
  CircleCheck,
} from "lucide-react";

export const Route = createFileRoute("/producer/shows/$id/applicants/$appId")({
  component: ApplicantDetail,
});

const STAGE_RESULTS: StageResult[] = ["검토 대기", "진행 중", "합격", "불합격", "보류", "불참"];

function ApplicantDetail() {
  const { id, appId } = Route.useParams();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const app = useStore((s) => s.applications.find((a) => a.id === appId));
  const getApplicantById = useStore((s) => s.getApplicantById);
  const updateReview = useStore((s) => s.updateReview);
  const updateStageProgress = useStore((s) => s.updateStageProgress);
  const [pendingStageId, setPendingStageId] = useState<string | null>(null);
  const [pendingStageResult, setPendingStageResult] = useState<StageResult | null>(null);
  const [memoDraft, setMemoDraft] = useState(app?.memo ?? "");
  const [feedback, setFeedback] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const trackedApplicantKey = useRef<string | null>(null);

  useEffect(() => {
    if (!show || !app) return;
    const trackingKey = `${show.id}:${app.id}`;
    if (trackedApplicantKey.current === trackingKey) return;
    trackedApplicantKey.current = trackingKey;
    trackAnalyticsEvent("applicant_detail_viewed", {
      show_id: show.id,
      review_status: app.reviewStatus,
    });
  }, [app, show]);

  if (!show || !app) throw notFound();
  const applicant = getApplicantById(app.applicantId);
  if (!applicant) throw notFound();

  const showId = show.id;
  const applicationId = app.id;
  const stages = getAuditionStages(show);
  const savedProgress = getApplicationStageProgress(app, show);
  const roleName = app.roleIds.map((r) => show.roles.find((sr) => sr.id === r)?.name).join(", ");
  const careers = applicant.careers.filter((c) => app.selectedCareerIds.includes(c.id));
  const photos = applicant.photos.filter((p) => app.selectedPhotoIds.includes(p.id));
  const selectedPhoto = photos.find((photo) => photo.id === selectedPhotoId);
  const profilePhoto =
    photos.find((photo) => photo.image) ?? applicant.photos.find((photo) => photo.image);
  const videos = applicant.videos.filter((v) => app.selectedVideoIds.includes(v.id));
  const currentStageId = pendingStageId ?? savedProgress.stage.id;
  const currentStageResult = pendingStageResult ?? savedProgress.result;
  const stageDirty =
    currentStageId !== savedProgress.stage.id || currentStageResult !== savedProgress.result;
  const memoDirty = memoDraft !== app.memo;

  function saveStageProgress() {
    if (!stageDirty) return;
    if (
      (currentStageResult === "합격" || currentStageResult === "불합격") &&
      !window.confirm(
        `${stages.find((stage) => stage.id === currentStageId)?.name ?? "전형 단계"} 결과를 '${currentStageResult}'으로 저장하시겠습니까?`,
      )
    ) {
      return;
    }
    updateStageProgress([applicationId], currentStageId, currentStageResult);
    trackAnalyticsEvent("review_status_changed", {
      show_id: showId,
      previous_status: `${savedProgress.stage.name}:${savedProgress.result}`,
      review_status: `${stages.find((stage) => stage.id === currentStageId)?.name}:${currentStageResult}`,
    });
    const changedAt = new Date().toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
    });
    const stageName = stages.find((stage) => stage.id === currentStageId)?.name ?? "전형 단계";
    setFeedback(`${stageName} · ${currentStageResult}(으)로 변경했습니다 · ${changedAt}`);
    setPendingStageId(null);
    setPendingStageResult(null);
  }

  function saveMemo() {
    updateReview(applicationId, { memo: memoDraft });
    setFeedback("내부 메모를 저장했습니다");
  }

  return (
    <div className="space-y-6">
      <Link
        to="/producer/shows/$id"
        params={{ id: show.id }}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> {show.title} 지원자 목록
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            {profilePhoto?.image ? (
              <img
                src={profilePhoto.image}
                alt={`${applicant.name} 프로필`}
                className="h-20 w-16 shrink-0 rounded-xl object-cover object-top shadow-sm"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {applicant.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{applicant.name}</h1>
                <span className="text-sm text-muted-foreground">({applicant.stageName})</span>
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold">
                  {savedProgress.stage.name}
                </span>
                <StageResultBadge status={savedProgress.result} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                지원 배역: <strong className="text-foreground">{roleName}</strong> · 지원일{" "}
                {app.submittedAt}
              </div>
              <p className="mt-2 text-sm text-foreground/80">{applicant.bio}</p>
            </div>
          </div>

          {feedback && (
            <div
              className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
              aria-live="polite"
            >
              <Check className="h-4 w-4" />
              {feedback}
            </div>
          )}

          <Section title="기본 프로필">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                icon={User}
                label="성별 · 키"
                value={`${applicant.gender} · ${applicant.height}`}
              />
              <Field icon={Calendar} label="생년월일" value={applicant.birthDate} />
              <Field icon={Phone} label="연락처" value={applicant.phone} />
              <Field icon={Mail} label="이메일" value={applicant.email} />
            </div>
          </Section>

          <Section title="전형 진행">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {stages.map((stage, index) => {
                const currentIndex = stages.findIndex((item) => item.id === savedProgress.stage.id);
                const completed = index < currentIndex;
                const current = stage.id === savedProgress.stage.id;
                return (
                  <div
                    key={stage.id}
                    className={`rounded-xl border p-3 ${
                      current
                        ? "border-primary bg-primary/5"
                        : completed
                          ? "border-success/30 bg-success/5"
                          : "border-border bg-surface"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Stage {index + 1}
                      </span>
                      {completed && <CircleCheck className="h-4 w-4 text-success" />}
                    </div>
                    <div className="mt-1 text-sm font-semibold">{stage.name}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      {current
                        ? savedProgress.result
                        : completed
                          ? "이전 단계"
                          : (stage.date ?? stage.resultAnnouncementDate ?? "예정")}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="text-xs font-semibold text-muted-foreground">단계 변경 이력</div>
              <div className="mt-2 space-y-2">
                {(app.stageHistory ?? []).length > 0 ? (
                  [...(app.stageHistory ?? [])]
                    .reverse()
                    .slice(0, 5)
                    .map((history) => (
                      <div
                        key={history.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-xs"
                      >
                        <span className="font-medium">
                          {history.stageName} · {history.result}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(history.changedAt).toLocaleString("ko-KR")}
                        </span>
                      </div>
                    ))
                ) : (
                  <div className="rounded-lg bg-surface px-3 py-2 text-xs text-muted-foreground">
                    현재 {savedProgress.stage.name} · {savedProgress.result}
                  </div>
                )}
              </div>
            </div>
          </Section>

          <Section title={`주요 경력 (${careers.length}건)`}>
            <div className="space-y-2">
              {careers.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">{c.title}</div>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                      {c.kind}
                    </span>
                    <span className="text-xs text-muted-foreground">· {c.role}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.period} · {c.producer}
                  </div>
                </div>
              ))}
              {careers.length === 0 && (
                <div className="text-sm text-muted-foreground">제출된 경력이 없습니다.</div>
              )}
            </div>
          </Section>

          <Section title="자기소개">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{applicant.intro}</p>
            {app.motivation && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                  이 공연 지원 동기
                </div>
                <p className="mt-1 text-sm">{app.motivation}</p>
              </div>
            )}
          </Section>

          <Section title={`제출 사진 (${photos.length}장)`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoId(p.id)}
                    disabled={!p.image}
                    aria-label={`${p.fileName} 크게 보기`}
                    className="group relative block w-full cursor-zoom-in rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default"
                  >
                    <PhotoTile
                      color={p.color}
                      label={p.type}
                      image={p.image}
                      className="w-full transition-opacity group-hover:opacity-90"
                    />
                    {p.image && (
                      <span className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white shadow-sm">
                        <Maximize2 className="h-4 w-4" />
                      </span>
                    )}
                  </button>
                  <div className="mt-1 truncate text-[11px] font-medium">{p.fileName}</div>
                  <div className="text-[10px] text-muted-foreground">{p.type}</div>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="text-sm text-muted-foreground">제출된 사진이 없습니다.</div>
              )}
            </div>
          </Section>

          <Section title={`제출 영상 (${videos.length}개)`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {videos.map((v) => (
                <div key={v.id}>
                  <VideoTile color={v.color} duration={v.duration} />
                  <div className="mt-1 truncate text-sm font-medium">{v.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {v.type} · {v.duration}
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="text-sm text-muted-foreground">제출된 영상이 없습니다.</div>
              )}
            </div>
          </Section>

          {show.additionalQuestions.length > 0 && (
            <Section title="추가 질문 답변">
              <ul className="space-y-3">
                {show.additionalQuestions.map((q) => (
                  <li key={q.id}>
                    <div className="text-xs text-muted-foreground">{q.question}</div>
                    <div className="mt-1 text-sm">
                      {app.answers[q.id] || <span className="text-muted-foreground">미응답</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="일정 참여 가능 여부">
            <div className="text-sm">
              연습 일정 · 오디션 참여: <strong>{app.availability || "미응답"}</strong>
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              전형 단계·결과 변경
            </div>
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-medium" htmlFor="applicant-stage">
                현재 전형 단계
              </label>
              <select
                id="applicant-stage"
                value={currentStageId}
                onChange={(event) => setPendingStageId(event.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {stages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
              <label className="block text-xs font-medium" htmlFor="applicant-stage-result">
                단계 결과
              </label>
              <select
                id="applicant-stage-result"
                value={currentStageResult}
                onChange={(event) => setPendingStageResult(event.target.value as StageResult)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STAGE_RESULTS.map((result) => (
                  <option key={result}>{result}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={saveStageProgress}
              disabled={!stageDirty}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-35"
            >
              <Save className="h-4 w-4" /> 단계·결과 저장
            </button>
            {stageDirty && (
              <p className="mt-2 text-xs text-warning-foreground">
                저장하기 전까지 단계와 결과가 확정되지 않습니다.
              </p>
            )}

            <div className="mt-6 border-t border-border pt-5">
              <label
                htmlFor="internal-memo"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                내부 메모
              </label>
              <div className="mt-2 flex items-start gap-2 rounded-md bg-information/10 px-3 py-2 text-xs text-information-foreground">
                <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                공연사 내부에서만 확인할 수 있는 메모입니다.
              </div>
              <textarea
                id="internal-memo"
                rows={4}
                value={memoDraft}
                onChange={(e) => setMemoDraft(e.target.value)}
                placeholder="다음 검토자가 참고할 내용을 남겨 주세요."
                className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={saveMemo}
                disabled={!memoDirty}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-35"
              >
                <Save className="h-4 w-4" /> 내부 메모 저장
              </button>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                최근 상태 이력
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div>
                  <div className="font-medium">
                    {savedProgress.stage.name} · {savedProgress.result}
                  </div>
                  <div className="mt-0.5 text-muted-foreground">현재 저장된 상태 · 캐스팅 담당</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog
        open={Boolean(selectedPhoto?.image)}
        onOpenChange={(open) => {
          if (!open) setSelectedPhotoId(null);
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl gap-0 overflow-hidden border-white/10 bg-black p-0 text-white">
          {selectedPhoto?.image && (
            <>
              <div className="flex max-h-[78vh] min-h-0 items-center justify-center bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={`${applicant.name} ${selectedPhoto.type}`}
                  className="max-h-[78vh] max-w-full object-contain"
                />
              </div>
              <div className="border-t border-white/10 bg-black px-5 py-4 pr-14">
                <DialogTitle className="text-base text-white">{selectedPhoto.fileName}</DialogTitle>
                <DialogDescription className="mt-1 text-white/65">
                  {selectedPhoto.type} · 사진 바깥 영역이나 닫기 버튼을 누르면 이전 화면으로
                  돌아갑니다.
                </DialogDescription>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/70 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
