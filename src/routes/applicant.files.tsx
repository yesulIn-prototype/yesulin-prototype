import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { PhotoTile, VideoTile } from "@/components/poster";
import { Plus, Star } from "lucide-react";

export const Route = createFileRoute("/applicant/files")({
  component: FilesPage,
});

const TABS = ["사진", "영상", "문서"] as const;

function FilesPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("사진");
  const applicant = useStore((s) => s.applicant);
  const addPhoto = useStore((s) => s.addPhoto);
  const addVideo = useStore((s) => s.addVideo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">파일 보관함</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          여기 있는 파일을 각 공연 지원서에서 그대로 선택해 제출합니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "사진" && (
          <button onClick={addPhoto} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            <Plus className="h-3 w-3" /> 사진 추가
          </button>
        )}
        {tab === "영상" && (
          <button onClick={addVideo} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            <Plus className="h-3 w-3" /> 영상 추가
          </button>
        )}
      </div>

      {tab === "사진" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {applicant.photos.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <PhotoTile color={p.color} label={p.type} />
              <div className="p-2">
                <div className="flex items-center gap-1">
                  <div className="truncate text-xs font-medium">{p.fileName}</div>
                  {p.isDefault && <Star className="h-3 w-3 fill-gold text-gold" />}
                </div>
                <div className="text-[10px] text-muted-foreground">{p.type} · {p.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "영상" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applicant.videos.map((v) => (
            <div key={v.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <VideoTile color={v.color} duration={v.duration} />
              <div className="p-3">
                <div className="truncate text-sm font-medium">{v.title}</div>
                <div className="text-xs text-muted-foreground">{v.type} · {v.duration}</div>
                <div className="text-[10px] text-muted-foreground">{v.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "문서" && (
        <div className="space-y-2">
          {applicant.docs.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
              <div>
                <div className="text-sm font-medium">{d.fileName}</div>
                <div className="text-xs text-muted-foreground">{d.type} · {d.createdAt}</div>
              </div>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{d.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
