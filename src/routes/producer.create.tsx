import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileImage,
  ImagePlus,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { getPerformanceId, useStore, type AdditionalQuestion, type ShowRole } from "@/lib/store";

import { trackAnalyticsEvent } from "@/lib/analytics";

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

type ItemDraft = { key: string; required: boolean };
type OcrStatus = "idle" | "reading" | "analyzing" | "complete" | "error";

const MOCK_POSTER_IMAGE = "/images/editorial/company-connect-restaurant.jpg";
const MOCK_SOURCE_URL =
  "https://otr.co.kr/audition/?board_name=audition&search_field=fn_user_pid&search_text=2444&list_type=list&lang=ko_KR&vid=21547";
const MOCK_POSTER_NAME = "[연극식당]매일이 크리스마스_배우오디션공고.png";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const emptyRole = (): ShowRole => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  requirements: "",
  allowMultiple: false,
});

function CreatePosting() {
  const navigate = useNavigate();
  const saveShow = useStore((state) => state.saveShow);
  const shows = useStore((state) => state.shows);
  const performances = useMemo(() => {
    const groups = new Map<string, string>();
    for (const show of shows) groups.set(getPerformanceId(show), show.title);
    return [...groups.entries()];
  }, [shows]);
  const [performanceId, setPerformanceId] = useState("new");
  const [title, setTitle] = useState("");
  const [postingTitle, setPostingTitle] = useState("");
  const [producer, setProducer] = useState("컴퍼니연결");
  const [kind, setKind] = useState("뮤지컬");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [compensation, setCompensation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [auditionDate, setAuditionDate] = useState("");
  const [resultAnnouncementDate, setResultAnnouncementDate] = useState("");
  const [rehearsalPeriod, setRehearsalPeriod] = useState("");
  const [showPeriod, setShowPeriod] = useState("");
  const [roles, setRoles] = useState<ShowRole[]>([emptyRole()]);
  const [posterImage, setPosterImage] = useState("");
  const [posterFileName, setPosterFileName] = useState("");
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrMessage, setOcrMessage] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([
    { key: "기본 프로필", required: true },
    { key: "경력", required: true },
    { key: "정면 프로필 사진", required: true },
  ]);
  const [questions, setQuestions] = useState<AdditionalQuestion[]>([]);
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const trackedStart = useRef(false);
  const analysisTimer = useRef<number | null>(null);

  useEffect(() => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackAnalyticsEvent("recruitment_create_started", {
      entry_point: "producer_console",
    });
  }, []);

  const validRoles = useMemo(() => roles.filter((role) => role.name.trim()), [roles]);
  const isAnalyzing = ocrStatus === "reading" || ocrStatus === "analyzing";
  const isOcrComplete = ocrStatus === "complete";

  useEffect(
    () => () => {
      if (analysisTimer.current) window.clearTimeout(analysisTimer.current);
    },
    [],
  );

  function applyMockResult() {
    const sharedRequirement =
      "전 배역 트리플 캐스트 · 전체 연습 및 공연 일정 참여 · 관객과 열린 태도로 소통 가능한 배우";

    setTitle("연극 식당: 매일이 크리스마스");
    setProducer("컴퍼니 연결 × 남극장");
    setKind("연극");
    setDescription(
      "세상의 모든 숫자가 사라진 날, 자신의 식당을 매일 크리스마스로 꾸미는 남자와 크리스마스에 운명을 만날 것이라 믿는 여자가 서로의 하루가 되어가는 사랑스러운 로맨틱 코미디입니다. 공연 중 다이닝 씨어터 형식의 음식 체험 프로그램과 관객과의 직접적인 소통 및 인터랙션이 포함됩니다.",
    );
    setVenue("남극장");
    setCompensation("개별 협의");
    setDeadline("2026.07.31 20:00");
    setAuditionDate("2026.08.03 – 2026.08.05");
    setResultAnnouncementDate("2026.08.10");
    setRehearsalPeriod("2026.08.24부터 평일 13:00–17:00");
    setShowPeriod("2026.10.07 – 2027.01.10");
    setRoles([
      {
        id: crypto.randomUUID(),
        name: "남자 역",
        description:
          "숫자가 사라진 뒤, 운영하던 레스토랑을 매일 크리스마스로 꾸미고 있는 사장. 진지하고 조금 너드스럽다.",
        requirements: sharedRequirement,
        allowMultiple: true,
      },
      {
        id: crypto.randomUUID(),
        name: "여자 역",
        description: "크리스마스에 운명을 만나게 될 것이라고 믿는 사람. 쾌활하고 시원시원하다.",
        requirements: sharedRequirement,
        allowMultiple: true,
      },
      {
        id: crypto.randomUUID(),
        name: "멀티 역",
        description:
          "옆가게 사장, 단골손님, 배달기사, 구청 직원, 청소업체 직원, 사진사, 영화관 직원, 꽃집 사장, 뉴스 앵커, 정부 직원 등.",
        requirements: `${sharedRequirement} · 빠른 인물 전환과 다양한 캐릭터 표현`,
        allowMultiple: true,
      },
    ]);
    setItems([
      { key: "기본 프로필", required: true },
      { key: "경력", required: true },
      { key: "정면 프로필 사진", required: true },
      { key: "연기 영상", required: true },
      { key: "노래 영상", required: false },
    ]);
    setQuestions([
      {
        id: crypto.randomUUID(),
        question: "지원 배역과 해당 배역을 선택한 이유를 작성해 주세요.",
        type: "긴 답변",
      },
      {
        id: crypto.randomUUID(),
        question: "전체 공연 및 연습 일정에 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 협의 필요", "불가"],
      },
    ]);
    setErrors([]);
    setNotice("");
  }

  function startMockAnalysis(image: string, fileName: string) {
    if (analysisTimer.current) window.clearTimeout(analysisTimer.current);
    setPosterImage(image);
    setPosterFileName(fileName);
    setOcrStatus("analyzing");
    setOcrMessage("이미지에서 일정, 배역, 지원 조건을 찾고 있어요.");

    analysisTimer.current = window.setTimeout(() => {
      applyMockResult();
      setOcrStatus("complete");
      setOcrMessage("공연 정보, 모집 배역, 제출 자료를 자동으로 채웠습니다.");
      analysisTimer.current = null;
    }, 1300);
  }

  async function processImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setOcrStatus("error");
      setOcrMessage("PNG, JPG 또는 WEBP 이미지 파일을 선택해 주세요.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setOcrStatus("error");
      setOcrMessage("이미지는 10MB 이하로 올려 주세요.");
      return;
    }

    setOcrStatus("reading");
    setOcrMessage("이미지를 불러오고 있어요.");
    try {
      const image = await fileToDataUrl(file);
      startMockAnalysis(image, file.name);
    } catch {
      setOcrStatus("error");
      setOcrMessage("이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.");
    }
  }

  function validate(forPublish: boolean) {
    if (!forPublish) return [];
    const next: string[] = [];
    if (!title.trim()) next.push("공연명을 입력해 주세요.");
    if (!producer.trim()) next.push("제작사를 입력해 주세요.");
    if (!deadline) next.push("지원 마감일을 선택해 주세요.");
    if (!resultAnnouncementDate) next.push("결과 발표일을 입력해 주세요.");
    if (validRoles.length === 0) next.push("한 개 이상의 모집 배역을 입력해 주세요.");
    return next;
  }

  function save(publicationStatus: "임시 저장" | "게시됨") {
    const nextErrors = validate(publicationStatus === "게시됨");
    setErrors(nextErrors);
    if (nextErrors.length > 0) {
      document.getElementById("create-errors")?.focus();
      return;
    }

    const linkedPostings = shows.filter((show) => getPerformanceId(show) === performanceId);
    const recruitmentRound =
      performanceId === "new"
        ? 1
        : Math.max(0, ...linkedPostings.map((show) => show.recruitmentRound ?? 1)) + 1;
    const resolvedPerformanceId =
      performanceId === "new" ? `performance-${crypto.randomUUID()}` : performanceId;

    const showId = saveShow({
      performanceId: resolvedPerformanceId,
      title: title.trim() || "제목 없는 공고",
      postingTitle:
        postingTitle.trim() || `${recruitmentRound}차 ${kind === "연극" ? "배우" : "출연진"} 모집`,
      recruitmentRound,
      producer: producer.trim(),
      kind,
      description,
      venue,
      compensation: compensation || "협의",
      deadline: deadline.replaceAll("-", "."),
      auditionDate: auditionDate.replaceAll("-", "."),
      resultAnnouncementDate: resultAnnouncementDate.replaceAll("-", "."),
      rehearsalPeriod,
      showPeriod,
      roles: validRoles.length > 0 ? validRoles : roles,
      posterColor: "#171717",
      posterImage,
      posterPosition: "top",
      sourceUrl: isOcrComplete ? MOCK_SOURCE_URL : undefined,
      sourceLabel: isOcrComplete ? "OTR 원문 공고" : undefined,
      requiredItems: items
        .filter((item) => item.required)
        .map((item) => ({
          key: toRequirementKey(item.key),
          label: item.key,
          required: true,
        })),
      optionalItems: items
        .filter((item) => !item.required)
        .map((item) => ({
          key: toRequirementKey(item.key),
          label: item.key,
          required: false,
        })),
      additionalQuestions: questions.filter((question) => question.question.trim()),
      status: publicationStatus === "게시됨" ? "모집 중" : "모집 예정",
      publicationStatus,
    });

    if (publicationStatus === "게시됨") {
      trackAnalyticsEvent("recruitment_created", {
        show_id: showId,
        role_count: validRoles.length,
        submission_item_count: items.length,
        additional_question_count: questions.filter((question) => question.question.trim()).length,
      });
      navigate({ to: "/producer/shows/$id", params: { id: showId } });
      return;
    }
    setNotice("임시 저장했습니다. 이 브라우저에서 이어서 편집할 수 있습니다.");
  }

  function togglePreview() {
    const nextPreview = !preview;
    setPreview(nextPreview);

    if (nextPreview) {
      trackAnalyticsEvent("recruitment_previewed", {
        role_count: roles.length,
        submission_item_count: items.length,
        additional_question_count: questions.filter((question) => question.question.trim()).length,
      });
    }
  }

  return (
    <form
      noValidate
      className="pb-24"
      onSubmit={(event) => {
        event.preventDefault();
        save("게시됨");
      }}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Posting editor
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">모집 공고 만들기</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            필수 정보부터 작성하고, 지원자가 실제로 제출할 화면을 미리 확인하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={togglePreview}
          aria-expanded={preview}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-semibold hover:bg-secondary"
        >
          {preview ? <X className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {preview ? "미리보기 닫기" : "지원서 미리보기"}
        </button>
      </header>

      {errors.length > 0 && (
        <div
          id="create-errors"
          tabIndex={-1}
          role="alert"
          className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <div className="font-semibold">게시하기 전에 확인해 주세요.</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {notice && (
        <p
          className="mt-6 rounded-xl border border-success/30 bg-success/5 p-4 text-sm text-success"
          role="status"
        >
          {notice}
        </p>
      )}

      <div className={`mt-6 grid gap-6 ${preview ? "xl:grid-cols-[minmax(0,1fr)_380px]" : ""}`}>
        <div className="space-y-6">
          <section
            aria-busy={isAnalyzing}
            className="overflow-hidden rounded-2xl border border-information/25 bg-card shadow-[var(--shadow-elev-1)]"
          >
            <div className="border-b border-border bg-information/[0.06] p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-information text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">이미지로 공고 자동 작성</h2>
                      <span className="rounded-full border border-information/20 bg-background px-2 py-0.5 text-[11px] font-semibold text-information">
                        MOCK OCR
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      포스터나 상세 이미지를 올리면 공연 정보와 모집 조건을 항목별로 정리합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[220px_minmax(0,1fr)] md:p-6">
              <div
                className="group relative flex h-64 items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-surface"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const file = event.dataTransfer.files[0];
                  if (file) void processImage(file);
                }}
              >
                {posterImage ? (
                  <img
                    src={posterImage}
                    alt={`${posterFileName} 미리보기`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <label
                    htmlFor="posting-image"
                    className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-5 text-center"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <ImagePlus className="h-5 w-5" />
                    </span>
                    <span className="mt-3 text-sm font-semibold">이미지를 선택하거나 끌어놓기</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, WEBP · 최대 10MB
                    </span>
                  </label>
                )}
                {posterImage && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-xs text-white">
                    <span className="block truncate">{posterFileName}</span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="grid gap-2 sm:grid-cols-3">
                  <OcrStep number="1" label="상세 이미지 업로드" active={ocrStatus !== "idle"} />
                  <OcrStep
                    number="2"
                    label="텍스트와 조건 분석"
                    active={isAnalyzing || isOcrComplete}
                  />
                  <OcrStep number="3" label="등록 항목 자동 입력" active={isOcrComplete} />
                </div>

                <div
                  role="status"
                  className={`mt-4 flex min-h-16 items-center gap-3 rounded-xl border p-3 text-sm ${
                    ocrStatus === "error"
                      ? "border-destructive/25 bg-destructive/5 text-destructive"
                      : isOcrComplete
                        ? "border-success/25 bg-success/5 text-success"
                        : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {isAnalyzing ? (
                    <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-information" />
                  ) : isOcrComplete ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                  ) : (
                    <FileImage className="h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <div className="font-semibold">
                      {isAnalyzing
                        ? "AI가 공고를 분석하고 있습니다"
                        : isOcrComplete
                          ? "자동 입력이 완료되었습니다"
                          : ocrStatus === "error"
                            ? "이미지를 확인해 주세요"
                            : "이미지를 올리면 분석을 시작합니다"}
                    </div>
                    <div className="mt-0.5 text-xs opacity-80">
                      {ocrMessage ||
                        "Mock에서는 예시 공고의 분석 결과를 적용하며, 모든 값은 직접 수정할 수 있습니다."}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <label
                    htmlFor="posting-image"
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground ${
                      isAnalyzing ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    {posterImage ? "다른 이미지 업로드" : "이미지 업로드"}
                  </label>
                  <input
                    id="posting-image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    disabled={isAnalyzing}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = "";
                      if (file) void processImage(file);
                    }}
                  />
                  <button
                    type="button"
                    disabled={isAnalyzing}
                    onClick={() => startMockAnalysis(MOCK_POSTER_IMAGE, MOCK_POSTER_NAME)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-semibold disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4 text-information" />
                    예시 공고로 체험
                  </button>
                  {posterImage && isOcrComplete && (
                    <button
                      type="button"
                      onClick={() => startMockAnalysis(posterImage, posterFileName)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted-foreground hover:bg-secondary"
                    >
                      <RefreshCw className="h-4 w-4" /> 다시 분석
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <FormSection
            number="01"
            title="공연 기본 정보"
            description="탐색 목록과 공고 상단에 노출됩니다."
            action={isOcrComplete ? <AutoFilledBadge /> : undefined}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label
                className="grid gap-1.5 text-sm font-medium md:col-span-2"
                htmlFor="performance-link"
              >
                공고를 연결할 공연
                <select
                  id="performance-link"
                  value={performanceId}
                  onChange={(event) => {
                    const nextPerformanceId = event.target.value;
                    setPerformanceId(nextPerformanceId);
                    const linkedShow = shows.find(
                      (show) => getPerformanceId(show) === nextPerformanceId,
                    );
                    if (!linkedShow) return;
                    setTitle(linkedShow.title);
                    setKind(linkedShow.kind);
                    setVenue(linkedShow.venue);
                    setPosterImage(linkedShow.posterImage);
                  }}
                  className="min-h-11 rounded-xl border border-input bg-background px-3"
                >
                  <option value="new">새 공연으로 등록</option>
                  {performances.map(([id, performanceTitle]) => (
                    <option key={id} value={id}>
                      기존 공연 · {performanceTitle}
                    </option>
                  ))}
                </select>
                <span className="text-xs font-normal text-muted-foreground">
                  같은 공연의 추가 모집이라면 기존 공연을 선택하세요.
                </span>
              </label>
              <Field id="show-title" label="공연명" value={title} onChange={setTitle} required />
              <Field
                id="posting-title"
                label="공고명"
                value={postingTitle}
                onChange={setPostingTitle}
                placeholder="예: 2차 앙상블 추가 모집"
              />
              <Field
                id="producer-name"
                label="제작사"
                value={producer}
                onChange={setProducer}
                required
              />
              <label className="grid gap-1.5 text-sm font-medium" htmlFor="show-kind">
                공연 유형
                <select
                  id="show-kind"
                  value={kind}
                  onChange={(event) => setKind(event.target.value)}
                  className="min-h-11 rounded-xl border border-input bg-background px-3"
                >
                  <option>뮤지컬</option>
                  <option>연극</option>
                  <option>무용</option>
                  <option>콘서트</option>
                  <option>기타</option>
                </select>
              </label>
              <Field id="venue" label="공연 장소" value={venue} onChange={setVenue} />
              <Field
                id="compensation"
                label="출연료"
                value={compensation}
                onChange={setCompensation}
              />
              <Field
                id="deadline"
                label="지원 마감일"
                value={deadline}
                onChange={setDeadline}
                placeholder="2026.07.31 20:00"
                required
              />
              <Field
                id="audition-date"
                label="오디션 예정일"
                value={auditionDate}
                onChange={setAuditionDate}
                placeholder="2026.08.03 – 2026.08.05"
              />
              <Field
                id="result-announcement-date"
                label="결과 발표일"
                value={resultAnnouncementDate}
                onChange={setResultAnnouncementDate}
                placeholder="2026.08.10"
                required
              />
              <Field
                id="rehearsal-period"
                label="연습 기간"
                value={rehearsalPeriod}
                onChange={setRehearsalPeriod}
                placeholder="2026.08.03 – 2026.09.10"
              />
              <Field
                id="show-period"
                label="공연 기간"
                value={showPeriod}
                onChange={setShowPeriod}
                placeholder="2026.09.12 – 2026.10.04"
              />
              <label
                className="grid gap-1.5 text-sm font-medium md:col-span-2"
                htmlFor="show-description"
              >
                공연 소개
                <textarea
                  id="show-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  className="rounded-xl border border-input bg-background p-3 text-sm"
                />
              </label>
            </div>
          </FormSection>

          <FormSection
            number="02"
            title="모집 배역"
            description="지원자는 여기에서 지원할 배역을 선택합니다."
            action={
              <div className="flex flex-wrap items-center gap-2">
                {isOcrComplete && <AutoFilledBadge />}
                <button
                  type="button"
                  onClick={() => setRoles((current) => [...current, emptyRole()])}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-semibold"
                >
                  <Plus className="h-4 w-4" /> 배역 추가
                </button>
              </div>
            }
          >
            <div className="space-y-4">
              {roles.map((role, index) => (
                <fieldset key={role.id} className="rounded-xl border border-border p-4">
                  <legend className="px-1 text-sm font-semibold">배역 {index + 1}</legend>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      id={`role-name-${role.id}`}
                      label="배역명"
                      value={role.name}
                      onChange={(value) => updateRole(roles, setRoles, role.id, { name: value })}
                      required
                    />
                    <Field
                      id={`role-requirements-${role.id}`}
                      label="지원 조건"
                      value={role.requirements}
                      onChange={(value) =>
                        updateRole(roles, setRoles, role.id, { requirements: value })
                      }
                    />
                    <label
                      className="grid gap-1.5 text-sm font-medium md:col-span-2"
                      htmlFor={`role-description-${role.id}`}
                    >
                      배역 설명
                      <textarea
                        id={`role-description-${role.id}`}
                        value={role.description}
                        onChange={(event) =>
                          updateRole(roles, setRoles, role.id, {
                            description: event.target.value,
                          })
                        }
                        rows={3}
                        className="rounded-xl border border-input bg-background p-3"
                      />
                    </label>
                    <label className="inline-flex min-h-10 items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={role.allowMultiple}
                        onChange={(event) =>
                          updateRole(roles, setRoles, role.id, {
                            allowMultiple: event.target.checked,
                          })
                        }
                      />
                      다른 배역과 복수 지원 허용
                    </label>
                    {roles.length > 1 && (
                      <button
                        type="button"
                        aria-label={`배역 ${index + 1} 삭제`}
                        onClick={() =>
                          setRoles((current) => current.filter((item) => item.id !== role.id))
                        }
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-destructive/30 px-3 text-sm text-destructive md:justify-self-end"
                      >
                        <Trash2 className="h-4 w-4" /> 삭제
                      </button>
                    )}
                  </div>
                </fieldset>
              ))}
            </div>
          </FormSection>

          <FormSection
            number="03"
            title="제출 자료"
            description="정말 필요한 자료만 요청하면 지원 완료율이 높아집니다."
            action={isOcrComplete ? <AutoFilledBadge /> : undefined}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {ITEM_OPTIONS.map((option) => {
                const item = items.find((candidate) => candidate.key === option);
                return (
                  <div
                    key={option}
                    className={`rounded-xl border p-3 ${item ? "border-primary/30 bg-primary/5" : "border-border"}`}
                  >
                    <label className="flex min-h-8 items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={Boolean(item)}
                        onChange={(event) =>
                          setItems((current) =>
                            event.target.checked
                              ? [...current, { key: option, required: false }]
                              : current.filter((candidate) => candidate.key !== option),
                          )
                        }
                      />
                      {option}
                    </label>
                    {item && (
                      <label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={item.required}
                          onChange={(event) =>
                            setItems((current) =>
                              current.map((candidate) =>
                                candidate.key === option
                                  ? { ...candidate, required: event.target.checked }
                                  : candidate,
                              ),
                            )
                          }
                        />
                        필수 제출
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </FormSection>

          <FormSection
            number="04"
            title="추가 질문"
            description="심사에 실제로 사용할 질문만 추가하세요."
            action={
              <div className="flex flex-wrap items-center gap-2">
                {isOcrComplete && <AutoFilledBadge />}
                <button
                  type="button"
                  onClick={() =>
                    setQuestions((current) => [
                      ...current,
                      {
                        id: crypto.randomUUID(),
                        question: "",
                        type: "긴 답변",
                      },
                    ])
                  }
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-secondary px-3 text-sm font-semibold"
                >
                  <Plus className="h-4 w-4" /> 질문 추가
                </button>
              </div>
            }
          >
            {questions.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                추가 질문 없이 기본 프로필과 제출 자료만 받을 수 있습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[1fr_180px_auto]"
                  >
                    <Field
                      id={`question-${question.id}`}
                      label={`질문 ${index + 1}`}
                      value={question.question}
                      onChange={(value) =>
                        setQuestions((current) =>
                          current.map((item) =>
                            item.id === question.id ? { ...item, question: value } : item,
                          ),
                        )
                      }
                    />
                    <label
                      className="grid gap-1.5 text-sm font-medium"
                      htmlFor={`question-type-${question.id}`}
                    >
                      답변 방식
                      <select
                        id={`question-type-${question.id}`}
                        value={question.type}
                        onChange={(event) =>
                          setQuestions((current) =>
                            current.map((item) =>
                              item.id === question.id
                                ? {
                                    ...item,
                                    type: event.target.value as AdditionalQuestion["type"],
                                  }
                                : item,
                            ),
                          )
                        }
                        className="min-h-11 rounded-xl border border-input bg-background px-3"
                      >
                        <option>짧은 답변</option>
                        <option>긴 답변</option>
                        <option>참여 가능 여부</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      aria-label={`질문 ${index + 1} 삭제`}
                      onClick={() =>
                        setQuestions((current) => current.filter((item) => item.id !== question.id))
                      }
                      className="min-h-11 self-end rounded-xl border border-input px-3 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="mx-auto h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FormSection>
        </div>

        {preview && (
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elev-1)] xl:sticky xl:top-24">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Applicant preview
            </div>
            {posterImage && (
              <div className="mt-3 h-48 overflow-hidden rounded-xl bg-surface">
                <img src={posterImage} alt="" className="h-full w-full object-cover object-top" />
              </div>
            )}
            <h2 className="mt-3 text-xl font-semibold">{title || "공연명"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{producer || "제작사"}</p>
            <dl className="mt-5 grid gap-3 text-sm">
              <PreviewRow label="지원 마감" value={deadline || "미정"} />
              <PreviewRow label="오디션" value={auditionDate || "미정"} />
              <PreviewRow label="공연 장소" value={venue || "미정"} />
            </dl>
            <div className="mt-6">
              <div className="text-xs font-semibold text-muted-foreground">모집 배역</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {validRoles.length > 0 ? (
                  validRoles.map((role) => (
                    <span key={role.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
                      {role.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">배역을 입력해 주세요.</span>
                )}
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-primary p-4 text-primary-foreground">
              <div className="text-xs opacity-70">제출 자료</div>
              <div className="mt-1 font-semibold">
                필수 {items.filter((item) => item.required).length}개 · 선택{" "}
                {items.filter((item) => !item.required).length}개
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="hidden text-sm text-muted-foreground md:block">
            임시 저장 후에도 이 브라우저에서 계속 편집할 수 있습니다.
          </p>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => save("임시 저장")}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-input bg-background px-4 text-sm font-semibold"
            >
              <Save className="h-4 w-4" /> 임시 저장
            </button>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              <Send className="h-4 w-4" /> 공고 게시
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium" htmlFor={id}>
      <span>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="min-h-11 rounded-xl border border-input bg-background px-3"
      />
    </label>
  );
}

function FormSection({
  number,
  title,
  description,
  action,
  children,
}: {
  number: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elev-1)] md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground">
            {number}
          </span>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function OcrStep({ number, label, active }: { number: string; label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
        active
          ? "border-information/25 bg-information/[0.06] text-foreground"
          : "border-border text-muted-foreground"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          active ? "bg-information text-white" : "bg-secondary"
        }`}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

function AutoFilledBadge() {
  return (
    <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-information/20 bg-information/[0.06] px-2.5 text-[11px] font-semibold text-information">
      <Sparkles className="h-3 w-3" /> AI 자동 입력
    </span>
  );
}

function updateRole(
  roles: ShowRole[],
  setRoles: React.Dispatch<React.SetStateAction<ShowRole[]>>,
  id: string,
  patch: Partial<ShowRole>,
) {
  setRoles(roles.map((role) => (role.id === id ? { ...role, ...patch } : role)));
}

function toRequirementKey(label: string) {
  if (label.includes("사진")) return label.includes("전신") ? "photo-full" : "photo-front";
  if (label.includes("영상")) {
    if (label.includes("노래")) return "video-song";
    if (label.includes("안무")) return "video-dance";
    return "video-acting";
  }
  if (label === "경력") return "career";
  if (label === "지원 동기") return "motivation";
  return label.toLowerCase().replace(/\s+/g, "-");
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
