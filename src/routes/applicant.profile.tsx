import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BriefcaseBusiness, Check, FolderOpen, Info, Pencil, Plus, X } from "lucide-react";
import { useStore, type Applicant } from "@/lib/store";

export const Route = createFileRoute("/applicant/profile")({
  component: ProfilePage,
});

const BASIC_FIELDS: Array<{
  key: keyof Pick<
    Applicant,
    "name" | "stageName" | "phone" | "email" | "birthDate" | "gender" | "height" | "bio"
  >;
  label: string;
  type?: string;
  autoComplete?: string;
}> = [
  { key: "name", label: "이름", autoComplete: "name" },
  { key: "stageName", label: "활동명" },
  { key: "phone", label: "연락처", type: "tel", autoComplete: "tel" },
  { key: "email", label: "이메일", type: "email", autoComplete: "email" },
  { key: "birthDate", label: "생년월일", type: "date", autoComplete: "bday" },
  { key: "gender", label: "성별" },
  { key: "height", label: "키", autoComplete: "off" },
  { key: "bio", label: "프로필 한 줄 소개" },
];

function ProfilePage() {
  const applicant = useStore((state) => state.applicant);
  const updateApplicant = useStore((state) => state.updateApplicant);
  const addCareer = useStore((state) => state.addCareer);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(applicant);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(applicant), [applicant]);

  function saveProfile() {
    updateApplicant({
      name: draft.name.trim(),
      stageName: draft.stageName.trim(),
      phone: draft.phone.trim(),
      email: draft.email.trim(),
      birthDate: draft.birthDate,
      gender: draft.gender.trim(),
      height: draft.height.trim(),
      bio: draft.bio.trim(),
      intro: draft.intro,
    });
    setSaved(true);
    setEditing(false);
    window.setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Reusable profile
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">내 프로필</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            신원·소개·경력을 관리합니다. 사진과 영상은 자료함에서 별도로 관리됩니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/applicant/files"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold"
          >
            <FolderOpen className="h-4 w-4" /> 자료함
          </Link>
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setDraft(applicant);
                  setEditing(false);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input px-4 text-sm font-semibold"
              >
                <X className="h-4 w-4" /> 취소
              </button>
              <button
                type="button"
                onClick={saveProfile}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                <Check className="h-4 w-4" /> 저장
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              <Pencil className="h-4 w-4" /> 프로필 편집
            </button>
          )}
        </div>
      </header>

      {saved && (
        <p
          className="rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-success"
          role="status"
        >
          프로필을 저장했습니다.
        </p>
      )}

      <Section title="기본 정보">
        <div className="grid gap-4 md:grid-cols-2">
          {BASIC_FIELDS.map((field) => {
            const value = draft[field.key];
            return (
              <div key={field.key}>
                <label htmlFor={`profile-${field.key}`} className="text-sm font-medium">
                  {field.label}
                </label>
                {editing ? (
                  <input
                    id={`profile-${field.key}`}
                    name={field.key}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete}
                    value={value}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                ) : (
                  <div className="mt-1.5 min-h-7 text-sm text-foreground">{value || "-"}</div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="자기소개">
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-gold-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          지원서에 불러온 뒤 작품에 맞게 수정할 수 있는 기본 소개입니다.
        </div>
        {editing ? (
          <textarea
            id="profile-intro"
            aria-label="기본 자기소개"
            value={draft.intro}
            onChange={(event) => setDraft((current) => ({ ...current, intro: event.target.value }))}
            rows={6}
            className="w-full rounded-xl border border-input bg-background p-3 text-sm leading-6"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {applicant.intro || "등록된 자기소개가 없습니다."}
          </p>
        )}
      </Section>

      <Section
        title="경력"
        action={
          <button
            type="button"
            onClick={() =>
              addCareer({
                title: "새 작품",
                kind: "뮤지컬",
                role: "배역",
                period: "기간 미정",
                producer: "제작사",
                detail: "",
              })
            }
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> 경력 추가
          </button>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          {applicant.careers.map((career) => (
            <article key={career.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <BriefcaseBusiness className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold">{career.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {career.role} · {career.kind}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {career.period} · {career.producer}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
