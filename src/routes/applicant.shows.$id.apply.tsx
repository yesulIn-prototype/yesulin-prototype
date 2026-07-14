import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PhotoTile, VideoTile } from "@/components/poster";
import { Check, ChevronLeft, ChevronRight, Info, AlertTriangle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/applicant/shows/$id/apply")({
  component: ApplyWizard,
});

const STEPS = [
  "지원 배역 선택",
  "기본 프로필 확인",
  "경력 선택",
  "사진 선택",
  "영상 선택",
  "추가 질문",
  "미리보기 및 제출",
];

function ApplyWizard() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const show = useStore((s) => s.shows.find((sh) => sh.id === id));
  const applicant = useStore((s) => s.applicant);
  const submitApplication = useStore((s) => s.submitApplication);

  const [step, setStep] = useState(0);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: applicant.name,
    stageName: applicant.stageName,
    phone: applicant.phone,
    email: applicant.email,
    birthDate: applicant.birthDate,
    gender: applicant.gender,
    height: applicant.height,
    bio: applicant.bio,
  });
  const [careerMode, setCareerMode] = useState<"all" | "select">("select");
  const [careerIds, setCareerIds] = useState<string[]>(applicant.careers.slice(0, 2).map((c) => c.id));
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({}); // reqKey -> photoId
  const [videoMap, setVideoMap] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [motivation, setMotivation] = useState("");

  if (!show) throw notFound();

  const photoRequirements = [...show.requiredItems, ...show.optionalItems].filter((r) => r.key.startsWith("photo-"));
  const videoRequirements = [...show.requiredItems, ...show.optionalItems].filter((r) => r.key.startsWith("video-"));
  const hasMotivation = show.requiredItems.some((r) => r.key === "motivation");

  const missing = useMemo(() => {
    const m: string[] = [];
    if (roleIds.length === 0) m.push("지원 배역");
    for (const req of show.requiredItems) {
      if (req.key.startsWith("photo-") && !photoMap[req.key]) m.push(req.label);
      if (req.key.startsWith("video-") && !videoMap[req.key]) m.push(req.label);
      if (req.key === "motivation" && !motivation.trim()) m.push("지원 동기");
      if (req.key === "career" && careerMode === "select" && careerIds.length === 0) m.push("경력 선택");
    }
    return m;
  }, [roleIds, photoMap, videoMap, motivation, careerIds, careerMode, show.requiredItems]);

  const selectedCareers = useMemo(
    () => (careerMode === "all" ? applicant.careers : applicant.careers.filter((c) => careerIds.includes(c.id))),
    [applicant.careers, careerIds, careerMode],
  );

  function submit() {
    submitApplication({
      showId: show!.id,
      roleIds,
      selectedCareerIds: selectedCareers.map((c) => c.id),
      selectedPhotoIds: Object.values(photoMap),
      selectedVideoIds: Object.values(videoMap),
      answers,
      availability: answers["q3"] ?? "미응답",
      memo: "",
      motivation,
    });
    navigate({ to: "/applicant/shows/$id/complete", params: { id: show!.id } });
  }

  const canNext = step === 0 ? roleIds.length > 0 : true;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/applicant/shows/$id" params={{ id: show.id }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> {show.title} 상세로
      </Link>

      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">지원서 작성</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{show.title}</h1>
      </div>

      <ol className="flex flex-wrap gap-1 rounded-full bg-secondary p-1">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1 min-w-[100px]">
            <button
              onClick={() => setStep(i)}
              className={`w-full rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" : i < step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {i + 1}. {s}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        {step === 0 && (
          <StepBlock title="지원 배역 선택" hint="복수 지원 가능한 배역은 여러 개를 선택할 수 있습니다.">
            <div className="grid gap-3 md:grid-cols-2">
              {show.roles.map((r) => {
                const active = roleIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() =>
                      setRoleIds((prev) =>
                        prev.includes(r.id) ? prev.filter((x) => x !== r.id) : [...prev, r.id],
                      )
                    }
                    className={`text-left rounded-xl border p-4 transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{r.name}</div>
                      <div
                        className={`h-5 w-5 rounded-full border ${
                          active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                        } inline-flex items-center justify-center`}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                    {r.allowMultiple && (
                      <span className="mt-2 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                        복수 지원 가능
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </StepBlock>
        )}

        {step === 1 && (
          <StepBlock title="기본 프로필 확인" hint="내 프로필에서 자동으로 불러왔습니다. 이번 지원서에서만 수정할 수 있습니다.">
            <InfoBanner>
              수정한 내용은 <strong>이번 지원서에만</strong> 반영되며, 내 프로필 원본에는 자동으로 저장되지 않습니다.
            </InfoBanner>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="이름" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
              <Field label="활동명" value={profile.stageName} onChange={(v) => setProfile({ ...profile, stageName: v })} />
              <Field label="연락처" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
              <Field label="이메일" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
              <Field label="생년월일" value={profile.birthDate} onChange={(v) => setProfile({ ...profile, birthDate: v })} />
              <Field label="성별" value={profile.gender} onChange={(v) => setProfile({ ...profile, gender: v })} />
              <Field label="키" value={profile.height} onChange={(v) => setProfile({ ...profile, height: v })} />
              <Field label="프로필 한 줄 소개" value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} className="md:col-span-2" />
            </div>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="경력 선택" hint="내 프로필에 저장된 경력에서 이번 지원서에 포함할 항목을 선택합니다.">
            <div className="flex gap-2">
              <ToggleChip active={careerMode === "all"} onClick={() => setCareerMode("all")}>전체 경력 사용</ToggleChip>
              <ToggleChip active={careerMode === "select"} onClick={() => setCareerMode("select")}>선택한 경력만 제출</ToggleChip>
            </div>
            <div className="space-y-2">
              {applicant.careers.map((c) => {
                const active = careerMode === "all" || careerIds.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={careerMode === "all"}
                      checked={active}
                      onChange={() =>
                        setCareerIds((prev) => (prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id]))
                      }
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-medium">{c.title}</div>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">{c.kind}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {c.role} · {c.period} · {c.producer}
                      </div>
                      {c.detail && <div className="mt-1 text-xs text-foreground/70">{c.detail}</div>}
                    </div>
                  </label>
                );
              })}
            </div>
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title="사진 선택" hint="공연사가 요구한 사진 유형에 맞춰 내 사진 보관함에서 선택합니다.">
            {photoRequirements.length === 0 && <p className="text-sm text-muted-foreground">이 공연은 사진 제출을 요구하지 않습니다.</p>}
            <div className="space-y-6">
              {photoRequirements.map((req) => (
                <div key={req.key}>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{req.label}</div>
                    {req.required && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">필수</span>}
                    {photoMap[req.key] && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                        <Check className="h-3 w-3" /> {applicant.photos.find((p) => p.id === photoMap[req.key])?.fileName} 선택됨
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {applicant.photos.map((p) => {
                      const active = photoMap[req.key] === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPhotoMap({ ...photoMap, [req.key]: p.id })}
                          className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                            active ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/30"
                          }`}
                        >
                          <PhotoTile color={p.color} label={p.type} />
                          <div className="p-2">
                            <div className="truncate text-[11px] font-medium">{p.fileName}</div>
                            <div className="truncate text-[10px] text-muted-foreground">{p.type}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title="영상 선택" hint="공연사가 요구한 영상 유형과 조건을 확인하고 내 영상 보관함에서 선택합니다.">
            {videoRequirements.length === 0 && <p className="text-sm text-muted-foreground">이 공연은 영상 제출을 요구하지 않습니다.</p>}
            <div className="space-y-6">
              {videoRequirements.map((req) => (
                <div key={req.key}>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium">{req.label}</div>
                    {req.required && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">필수</span>
                    )}
                    {req.note && <span className="text-[11px] text-muted-foreground">· {req.note}</span>}
                    {videoMap[req.key] && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
                        <Check className="h-3 w-3" /> 선택됨
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {applicant.videos.map((v) => {
                      const active = videoMap[req.key] === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setVideoMap({ ...videoMap, [req.key]: v.id })}
                          className={`overflow-hidden rounded-lg border-2 text-left transition-all ${
                            active ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-primary/30"
                          }`}
                        >
                          <VideoTile color={v.color} duration={v.duration} />
                          <div className="p-2">
                            <div className="truncate text-xs font-medium">{v.title}</div>
                            <div className="truncate text-[10px] text-muted-foreground">{v.type}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title="공연별 추가 질문" hint="이 공연을 위해 공연사가 추가한 질문입니다.">
            {hasMotivation && (
              <div>
                <label className="flex items-center gap-2 text-sm font-medium">
                  지원 동기 <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] text-destructive">필수</span>
                </label>
                <textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
                  placeholder="이 작품에 지원한 동기를 자유롭게 작성해주세요."
                />
              </div>
            )}
            {show.additionalQuestions.map((q) => (
              <div key={q.id}>
                <label className="text-sm font-medium">{q.question}</label>
                {q.type === "긴 답변" && (
                  <textarea
                    rows={3}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="mt-2 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
                  />
                )}
                {q.type === "짧은 답변" && (
                  <input
                    value={answers[q.id] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    className="mt-2 w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:border-primary"
                  />
                )}
                {q.type === "참여 가능 여부" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(q.options ?? []).map((opt) => (
                      <ToggleChip
                        key={opt}
                        active={answers[q.id] === opt}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      >
                        {opt}
                      </ToggleChip>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </StepBlock>
        )}

        {step === 6 && (
          <StepBlock title="지원서 미리보기" hint="아래 내용으로 제출됩니다. 필수 항목이 모두 포함되어 있는지 확인하세요.">
            {missing.length > 0 ? (
              <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <div>
                  <div className="font-semibold">누락된 필수 항목이 있습니다</div>
                  <ul className="mt-1 list-disc pl-4 text-xs">
                    {missing.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-success">
                <Check className="h-4 w-4" /> 필수 항목이 모두 준비되었습니다.
              </div>
            )}

            <Preview
              show={show}
              profile={profile}
              roleIds={roleIds}
              careers={selectedCareers}
              photoMap={photoMap}
              videoMap={videoMap}
              answers={answers}
              motivation={motivation}
            />
          </StepBlock>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> 이전
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            다음 <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={missing.length > 0}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            지원서 제출 <Sparkles className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StepBlock({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, className = "",
}: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className}>
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {label}
        <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-primary">
          내 프로필에서 불러옴
        </span>
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function ToggleChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-gold-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

import type { Show, Career } from "@/lib/store";

function Preview({
  show, profile, roleIds, careers, photoMap, videoMap, answers, motivation,
}: {
  show: Show;
  profile: Record<string, string>;
  roleIds: string[];
  careers: Career[];
  photoMap: Record<string, string>;
  videoMap: Record<string, string>;
  answers: Record<string, string>;
  motivation: string;
}) {
  const applicant = useStore((s) => s.applicant);
  const roles = show.roles.filter((r) => roleIds.includes(r.id));
  return (
    <div className="space-y-5 rounded-xl border border-border bg-background p-5">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">지원 배역</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {roles.length === 0 ? <span className="text-sm text-muted-foreground">-</span> : roles.map((r) => (
            <span key={r.id} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{r.name}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">기본 정보</div>
        <div className="mt-1 grid gap-1 text-sm md:grid-cols-2">
          <span>{profile.name} ({profile.stageName})</span>
          <span>{profile.gender} · {profile.height} · {profile.birthDate}</span>
          <span>{profile.phone}</span>
          <span>{profile.email}</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">선택한 경력 ({careers.length}건)</div>
        <ul className="mt-1 space-y-1 text-sm">
          {careers.map((c) => (
            <li key={c.id}>• {c.title} — {c.role} ({c.period})</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">선택한 사진</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(photoMap).map(([k, id]) => {
            const p = applicant.photos.find((ph) => ph.id === id);
            if (!p) return null;
            return (
              <div key={k} className="w-20">
                <PhotoTile color={p.color} label={p.type} />
                <div className="mt-1 truncate text-[10px]">{p.fileName}</div>
              </div>
            );
          })}
          {Object.keys(photoMap).length === 0 && <span className="text-xs text-muted-foreground">선택된 사진 없음</span>}
        </div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">선택한 영상</div>
        <div className="mt-2 space-y-1 text-sm">
          {Object.entries(videoMap).map(([k, id]) => {
            const v = applicant.videos.find((vd) => vd.id === id);
            if (!v) return null;
            return <div key={k}>• {v.title} ({v.duration}) — {v.type}</div>;
          })}
          {Object.keys(videoMap).length === 0 && <span className="text-xs text-muted-foreground">선택된 영상 없음</span>}
        </div>
      </div>
      {motivation && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">지원 동기</div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{motivation}</p>
        </div>
      )}
      {show.additionalQuestions.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">추가 질문 답변</div>
          <ul className="mt-1 space-y-2 text-sm">
            {show.additionalQuestions.map((q) => (
              <li key={q.id}>
                <div className="text-xs text-muted-foreground">{q.question}</div>
                <div>{answers[q.id] || <span className="text-muted-foreground">미응답</span>}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
