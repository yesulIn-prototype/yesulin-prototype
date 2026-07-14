import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { PhotoTile, VideoTile } from "@/components/poster";
import { Plus, Star, Info } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/applicant/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const applicant = useStore((s) => s.applicant);
  const updateApplicant = useStore((s) => s.updateApplicant);
  const addPhoto = useStore((s) => s.addPhoto);
  const addVideo = useStore((s) => s.addVideo);
  const addCareer = useStore((s) => s.addCareer);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(applicant);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">내 프로필</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            여기에 등록한 정보는 공연 지원서에서 <strong className="text-foreground">그대로 재사용</strong>됩니다.
          </p>
        </div>
        <button
          onClick={() => {
            if (editing) updateApplicant(draft);
            setEditing(!editing);
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          {editing ? "저장" : "기본 정보 편집"}
        </button>
      </div>

      <Section title="기본 정보">
        <div className="grid gap-4 md:grid-cols-2">
          {(
            [
              ["name", "이름"], ["stageName", "활동명"], ["phone", "연락처"], ["email", "이메일"],
              ["birthDate", "생년월일"], ["gender", "성별"], ["height", "키"], ["bio", "프로필 한 줄 소개"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <div className="text-xs text-muted-foreground">{label}</div>
              {editing ? (
                <input
                  value={(draft as unknown as Record<string, string>)[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              ) : (
                <div className="mt-1 text-sm font-medium">{(applicant as unknown as Record<string, string>)[key]}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="경력"
        action={
          <button
            onClick={() =>
              addCareer({
                title: "새 작품",
                kind: "뮤지컬",
                role: "배역",
                period: "2026.01 – 2026.02",
                producer: "제작사",
                detail: "",
              })
            }
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <Plus className="h-3 w-3" /> 경력 추가
          </button>
        }
      >
        <div className="space-y-3">
          {applicant.careers.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-medium">{c.title}</div>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">{c.kind}</span>
                <span className="text-xs text-muted-foreground">· {c.role}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {c.period} · {c.producer}
              </div>
              {c.detail && <div className="mt-1 text-xs text-foreground/70">{c.detail}</div>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="자기소개">
        <div className="flex items-start gap-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-gold-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          기본 자기소개를 저장해두면 각 공연 지원 시 <strong>이 내용을 불러온 뒤 해당 공연에 맞게 수정</strong>할 수 있습니다.
        </div>
        <textarea
          rows={5}
          value={applicant.intro}
          onChange={(e) => updateApplicant({ intro: e.target.value })}
          className="mt-3 w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-primary"
        />
      </Section>

      <Section
        title="사진 보관함"
        action={
          <button onClick={addPhoto} className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Plus className="h-3 w-3" /> 사진 추가
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {applicant.photos.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-border">
              <PhotoTile color={p.color} label={p.type} />
              <div className="p-2">
                <div className="flex items-center gap-1">
                  <div className="truncate text-xs font-medium">{p.fileName}</div>
                  {p.isDefault && <Star className="h-3 w-3 fill-gold text-gold" />}
                </div>
                <div className="text-[10px] text-muted-foreground">{p.type}</div>
                <div className="text-[10px] text-muted-foreground">{p.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="영상 보관함"
        action={
          <button onClick={addVideo} className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium hover:bg-accent">
            <Plus className="h-3 w-3" /> 영상 추가
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applicant.videos.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-lg border border-border">
              <VideoTile color={v.color} duration={v.duration} />
              <div className="p-3">
                <div className="truncate text-sm font-medium">{v.title}</div>
                <div className="text-xs text-muted-foreground">{v.type} · {v.duration}</div>
                <div className="text-[10px] text-muted-foreground">{v.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="문서 보관함">
        <div className="space-y-2">
          {applicant.docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">{d.fileName}</div>
                <div className="text-xs text-muted-foreground">{d.type} · {d.createdAt}</div>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{d.type}</span>
            </div>
          ))}
          {applicant.docs.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
              등록된 문서가 없습니다.
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
