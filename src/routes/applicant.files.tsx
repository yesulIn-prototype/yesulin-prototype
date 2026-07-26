import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FileText, Image, LoaderCircle, Plus, Star, Trash2, Video } from "lucide-react";
import { PhotoTile, VideoTile } from "@/components/poster";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/applicant/files")({
  component: FilesPage,
});

const TABS = ["사진", "영상", "문서"] as const;
type Tab = (typeof TABS)[number];

function FilesPage() {
  const [tab, setTab] = useState<Tab>("사진");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const applicant = useStore((state) => state.applicant);
  const addPhoto = useStore((state) => state.addPhoto);
  const addVideo = useStore((state) => state.addVideo);
  const addDoc = useStore((state) => state.addDoc);
  const removePhoto = useStore((state) => state.removePhoto);
  const removeVideo = useStore((state) => state.removeVideo);
  const removeDoc = useStore((state) => state.removeDoc);

  const accept =
    tab === "사진"
      ? "image/jpeg,image/png,image/webp"
      : tab === "영상"
        ? "video/mp4,video/quicktime,video/webm"
        : ".pdf,.doc,.docx,.hwp,.hwpx";

  async function upload(file?: File) {
    if (!file) return;
    const limit = tab === "영상" ? 25 : 8;
    if (file.size > limit * 1024 * 1024) {
      setNotice(`${tab} 파일은 ${limit}MB 이하만 등록할 수 있습니다.`);
      return;
    }
    setUploading(true);
    setNotice("");
    try {
      if (tab === "사진") await addPhoto(file);
      if (tab === "영상") await addVideo(file);
      if (tab === "문서") await addDoc(file);
      setNotice(`${file.name} 파일을 자료함에 등록했습니다.`);
    } catch {
      setNotice("파일을 등록하지 못했습니다. 파일 형식과 용량을 확인해 주세요.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Materials
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">자료함</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            사진·영상·문서를 한 번 등록하고 여러 지원서에 재사용합니다.
          </p>
        </div>
        <div>
          <input
            ref={fileInput}
            type="file"
            accept={accept}
            className="sr-only"
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInput.current?.click()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {uploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {tab} 추가
          </button>
        </div>
      </header>

      {notice && (
        <p
          className={`rounded-xl border p-4 text-sm ${
            notice.includes("못") || notice.includes("이하")
              ? "border-destructive/30 bg-destructive/5 text-destructive"
              : "border-success/30 bg-success/5 text-success"
          }`}
          role="status"
        >
          {notice}
        </p>
      )}

      <div className="flex gap-1 border-b border-border" role="tablist" aria-label="자료 유형">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={`min-h-11 border-b-2 px-5 text-sm font-semibold ${
              tab === item
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {item}{" "}
            <span className="ml-1 text-xs">
              {item === "사진"
                ? applicant.photos.length
                : item === "영상"
                  ? applicant.videos.length
                  : applicant.docs.length}
            </span>
          </button>
        ))}
      </div>

      {tab === "사진" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {applicant.photos.map((photo) => (
            <article
              key={photo.id}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <PhotoTile color={photo.color} label={photo.type} image={photo.image} />
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h2 className="truncate text-sm font-semibold">{photo.fileName}</h2>
                      {photo.isDefault && <Star className="h-3 w-3 fill-gold text-gold" />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {photo.type} · {photo.createdAt}
                    </p>
                  </div>
                  <DeleteButton
                    label={`${photo.fileName} 삭제`}
                    onClick={() => removePhoto(photo.id)}
                  />
                </div>
              </div>
            </article>
          ))}
          {applicant.photos.length === 0 && <Empty icon={Image} text="등록된 사진이 없습니다." />}
        </div>
      )}

      {tab === "영상" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {applicant.videos.map((video) => (
            <article
              key={video.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {video.url ? (
                <video
                  src={video.url}
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                />
              ) : (
                <VideoTile color={video.color} duration={video.duration} />
              )}
              <div className="flex items-start justify-between gap-2 p-4">
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{video.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {video.type} · {video.createdAt}
                  </p>
                </div>
                <DeleteButton label={`${video.title} 삭제`} onClick={() => removeVideo(video.id)} />
              </div>
            </article>
          ))}
          {applicant.videos.length === 0 && <Empty icon={Video} text="등록된 영상이 없습니다." />}
        </div>
      )}

      {tab === "문서" && (
        <div className="space-y-3">
          {applicant.docs.map((doc) => (
            <article
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      download={doc.fileName}
                      className="block truncate font-semibold hover:underline"
                    >
                      {doc.fileName}
                    </a>
                  ) : (
                    <div className="truncate font-semibold">{doc.fileName}</div>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {doc.type} · {doc.createdAt}
                  </p>
                </div>
              </div>
              <DeleteButton label={`${doc.fileName} 삭제`} onClick={() => removeDoc(doc.id)} />
            </article>
          ))}
          {applicant.docs.length === 0 && <Empty icon={FileText} text="등록된 문서가 없습니다." />}
        </div>
      )}
    </div>
  );
}

function DeleteButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function Empty({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      <Icon className="mx-auto mb-2 h-5 w-5" />
      {text}
    </div>
  );
}
