import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Eye } from "lucide-react";

export const Route = createFileRoute("/producer/create")({
  component: CreatePosting,
});

const ITEM_OPTIONS = [
  "기본 프로필",
  "경력",
  "자기소개",
  "정면 프로필 사진",
  "전신 프로필 사진",
  "자유 사진",
  "연기 영상",
  "노래 영상",
  "안무 영상",
  "이력서",
  "포트폴리오",
] as const;

type Role = { name: string; description: string; requirements: string; allowMultiple: boolean };
type Q = { id: string; question: string; type: string };
type Item = { key: string; required: boolean; note?: string };

function CreatePosting() {
  const [title, setTitle] = useState("");
  const [producer, setProducer] = useState("라이트스테이지");
  const [desc, setDesc] = useState("");
  const [venue, setVenue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [audition, setAudition] = useState("");
  const [rehearsal, setRehearsal] = useState("");
  const [showPeriod, setShowPeriod] = useState("");
  const [roles, setRoles] = useState<Role[]>([
    { name: "", description: "", requirements: "", allowMultiple: false },
  ]);
  const [items, setItems] = useState<Item[]>([
    { key: "기본 프로필", required: true },
    { key: "경력", required: true },
    { key: "정면 프로필 사진", required: true },
    { key: "노래 영상", required: true, note: "최대 2분" },
  ]);
  const [questions, setQuestions] = useState<Q[]>([{ id: "q1", question: "", type: "긴 답변" }]);
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">모집 공고 만들기</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            공연사가 지원자에게 받을 항목만 선택하면 됩니다. 지원자는 저장된 자료에서 곧바로
            제출합니다.
          </p>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
        >
          <Eye className="h-4 w-4" /> 지원서 미리보기
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Section title="공연 기본 정보">
            <div className="grid gap-3 md:grid-cols-2">
              <TextField
                label="공연명"
                value={title}
                onChange={setTitle}
                placeholder="뮤지컬 달빛"
              />
              <TextField label="제작사" value={producer} onChange={setProducer} />
              <TextField
                label="공연 장소"
                value={venue}
                onChange={setVenue}
                placeholder="라이트홀 대극장"
              />
              <TextField
                label="지원 마감일"
                value={deadline}
                onChange={setDeadline}
                placeholder="2026.07.20"
              />
              <TextField
                label="오디션 일정"
                value={audition}
                onChange={setAudition}
                placeholder="2026.07.25"
              />
              <TextField
                label="연습 기간"
                value={rehearsal}
                onChange={setRehearsal}
                placeholder="2026.08.03 – 2026.09.10"
              />
              <TextField
                label="공연 기간"
                value={showPeriod}
                onChange={setShowPeriod}
                placeholder="2026.09.12 – 2026.10.04"
                className="md:col-span-2"
              />
              <TextAreaField
                label="공연 소개"
                value={desc}
                onChange={setDesc}
                className="md:col-span-2"
              />
            </div>
          </Section>

          <Section
            title="모집 배역"
            action={
              <button
                onClick={() =>
                  setRoles([
                    ...roles,
                    { name: "", description: "", requirements: "", allowMultiple: false },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium"
              >
                <Plus className="h-3 w-3" /> 배역 추가
              </button>
            }
          >
            <div className="space-y-3">
              {roles.map((r, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">배역 {i + 1}</div>
                    {roles.length > 1 && (
                      <button
                        onClick={() => setRoles(roles.filter((_, idx) => idx !== i))}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <TextField
                      label="배역명"
                      value={r.name}
                      onChange={(v) => update(roles, setRoles, i, { name: v })}
                      placeholder="민우"
                    />
                    <TextField
                      label="지원 조건"
                      value={r.requirements}
                      onChange={(v) => update(roles, setRoles, i, { requirements: v })}
                    />
                    <TextAreaField
                      label="배역 설명"
                      value={r.description}
                      onChange={(v) => update(roles, setRoles, i, { description: v })}
                      className="md:col-span-2"
                    />
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={r.allowMultiple}
                        onChange={(e) =>
                          update(roles, setRoles, i, { allowMultiple: e.target.checked })
                        }
                        className="h-4 w-4 accent-primary"
                      />
                      복수 지원 허용
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="지원 항목 구성" hint="필요한 항목만 선택하고 필수 여부를 지정하세요.">
            <div className="grid gap-2 md:grid-cols-2">
              {ITEM_OPTIONS.map((opt) => {
                const idx = items.findIndex((it) => it.key === opt);
                const has = idx >= 0;
                return (
                  <div
                    key={opt}
                    className={`flex items-center justify-between rounded-lg border p-3 ${has ? "border-primary/40 bg-primary/5" : "border-border"}`}
                  >
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={has}
                        onChange={(e) => {
                          if (e.target.checked) setItems([...items, { key: opt, required: false }]);
                          else setItems(items.filter((it) => it.key !== opt));
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      {opt}
                    </label>
                    {has && (
                      <label className="inline-flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={items[idx].required}
                          onChange={(e) => {
                            const next = [...items];
                            next[idx] = { ...next[idx], required: e.target.checked };
                            setItems(next);
                          }}
                          className="h-3.5 w-3.5 accent-primary"
                        />
                        필수
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          <Section
            title="추가 질문"
            action={
              <button
                onClick={() =>
                  setQuestions([
                    ...questions,
                    { id: `q${questions.length + 1}`, question: "", type: "긴 답변" },
                  ])
                }
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium"
              >
                <Plus className="h-3 w-3" /> 질문 추가
              </button>
            }
          >
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground">질문 {i + 1}</div>
                    <button
                      onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 grid gap-3 md:grid-cols-[1fr_180px]">
                    <TextField
                      label="질문"
                      value={q.question}
                      onChange={(v) => update(questions, setQuestions, i, { question: v })}
                      placeholder="이 작품에 지원한 이유는?"
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">유형</div>
                      <select
                        value={q.type}
                        onChange={(e) =>
                          update(questions, setQuestions, i, { type: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option>짧은 답변</option>
                        <option>긴 답변</option>
                        <option>단일 선택</option>
                        <option>복수 선택</option>
                        <option>참여 가능 여부</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {preview && (
          <aside className="lg:sticky lg:top-8 lg:self-start rounded-2xl border border-border bg-card p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              지원자 관점 미리보기
            </div>
            <h3 className="mt-2 text-lg font-semibold">{title || "공연명 미입력"}</h3>
            <p className="text-xs text-muted-foreground">{producer}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/80">
              {desc || "공연 소개가 아직 없습니다."}
            </p>

            <div className="mt-4 text-xs text-muted-foreground">
              마감 {deadline || "-"} · 오디션 {audition || "-"}
            </div>

            <div className="mt-5">
              <div className="text-xs font-semibold">모집 배역</div>
              <ul className="mt-1 space-y-1 text-sm">
                {roles
                  .filter((r) => r.name)
                  .map((r, i) => (
                    <li key={i}>
                      • {r.name}
                      {r.allowMultiple && (
                        <span className="ml-1 text-[10px] text-muted-foreground">
                          (복수 지원 가능)
                        </span>
                      )}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold">지원자가 제출할 항목</div>
              <ul className="mt-1 space-y-1 text-sm">
                {items.map((it) => (
                  <li key={it.key} className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${it.required ? "bg-destructive" : "bg-gold"}`}
                    />
                    {it.key}{" "}
                    {it.required && <span className="text-[10px] text-destructive">(필수)</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold">추가 질문</div>
              <ul className="mt-1 space-y-1 text-sm">
                {questions
                  .filter((q) => q.question)
                  .map((q) => (
                    <li key={q.id}>
                      • {q.question}{" "}
                      <span className="text-[10px] text-muted-foreground">({q.type})</span>
                    </li>
                  ))}
                {questions.every((q) => !q.question) && (
                  <li className="text-xs text-muted-foreground">추가 질문 없음</li>
                )}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function update<T>(arr: T[], set: (v: T[]) => void, index: number, patch: Partial<T>) {
  const next = [...arr];
  next[index] = { ...next[index], ...patch };
  set(next);
}

function Section({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
