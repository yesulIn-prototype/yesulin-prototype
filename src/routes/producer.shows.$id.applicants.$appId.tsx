import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useStore, type ReviewStatus } from "@/lib/store";
import { PhotoTile, VideoTile } from "@/components/poster";
import { ReviewBadge } from "@/components/status-badge";
import { ChevronLeft, User, Phone, Mail, Ruler, Calendar } from "lucide-react";

export const Route = createFileRoute("/producer/shows/$id/applicants/$appId")({
  component: ApplicantDetail,
});

const REVIEW_STATUSES: ReviewStatus[] = ["미확인", "검토 중", "오디션 대상", "보류", "탈락"];

function ApplicantDetail() {
  const { id, appId } = Route.useParams();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const app = useStore((s) => s.applications.find((a) => a.id === appId));
  const getApplicantById = useStore((s) => s.getApplicantById);
  const updateReview = useStore((s) => s.updateReview);

  if (!show || !app) throw notFound();
  const applicant = getApplicantById(app.applicantId);
  if (!applicant) throw notFound();

  const roleName = app.roleIds.map((r) => show.roles.find((sr) => sr.id === r)?.name).join(", ");
  const careers = applicant.careers.filter((c) => app.selectedCareerIds.includes(c.id));
  const photos = applicant.photos.filter((p) => app.selectedPhotoIds.includes(p.id));
  const videos = applicant.videos.filter((v) => app.selectedVideoIds.includes(v.id));

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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {applicant.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{applicant.name}</h1>
                <span className="text-sm text-muted-foreground">({applicant.stageName})</span>
                <ReviewBadge status={app.reviewStatus} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                지원 배역: <strong className="text-foreground">{roleName}</strong> · 지원일 {app.submittedAt}
              </div>
              <p className="mt-2 text-sm text-foreground/80">{applicant.bio}</p>
            </div>
          </div>

          <Section title="기본 프로필">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field icon={User} label="성별 · 키" value={`${applicant.gender} · ${applicant.height}`} />
              <Field icon={Calendar} label="생년월일" value={applicant.birthDate} />
              <Field icon={Phone} label="연락처" value={applicant.phone} />
              <Field icon={Mail} label="이메일" value={applicant.email} />
            </div>
          </Section>

          <Section title={`주요 경력 (${careers.length}건)`}>
            <div className="space-y-2">
              {careers.map((c) => (
                <div key={c.id} className="rounded-lg border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">{c.title}</div>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">{c.kind}</span>
                    <span className="text-xs text-muted-foreground">· {c.role}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {c.period} · {c.producer}
                  </div>
                </div>
              ))}
              {careers.length === 0 && <div className="text-sm text-muted-foreground">제출된 경력이 없습니다.</div>}
            </div>
          </Section>

          <Section title="자기소개">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{applicant.intro}</p>
            {app.motivation && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">이 공연 지원 동기</div>
                <p className="mt-1 text-sm">{app.motivation}</p>
              </div>
            )}
          </Section>

          <Section title={`제출 사진 (${photos.length}장)`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id}>
                  <PhotoTile color={p.color} label={p.type} />
                  <div className="mt-1 truncate text-[11px] font-medium">{p.fileName}</div>
                  <div className="text-[10px] text-muted-foreground">{p.type}</div>
                </div>
              ))}
              {photos.length === 0 && <div className="text-sm text-muted-foreground">제출된 사진이 없습니다.</div>}
            </div>
          </Section>

          <Section title={`제출 영상 (${videos.length}개)`}>
            <div className="grid gap-3 sm:grid-cols-2">
              {videos.map((v) => (
                <div key={v.id}>
                  <VideoTile color={v.color} duration={v.duration} />
                  <div className="mt-1 truncate text-sm font-medium">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{v.type} · {v.duration}</div>
                </div>
              ))}
              {videos.length === 0 && <div className="text-sm text-muted-foreground">제출된 영상이 없습니다.</div>}
            </div>
          </Section>

          {show.additionalQuestions.length > 0 && (
            <Section title="추가 질문 답변">
              <ul className="space-y-3">
                {show.additionalQuestions.map((q) => (
                  <li key={q.id}>
                    <div className="text-xs text-muted-foreground">{q.question}</div>
                    <div className="mt-1 text-sm">{app.answers[q.id] || <span className="text-muted-foreground">미응답</span>}</div>
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
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">검토 상태</div>
            <div className="mt-3 space-y-1.5">
              {REVIEW_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateReview(app.id, { reviewStatus: s })}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    app.reviewStatus === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                  {app.reviewStatus === s && <span className="text-xs">선택됨</span>}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">내부 메모</label>
              <textarea
                rows={4}
                value={app.memo}
                onChange={(e) => updateReview(app.id, { memo: e.target.value })}
                placeholder="지원자에 대한 내부 메모를 남겨주세요."
                className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </aside>
      </div>
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

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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
