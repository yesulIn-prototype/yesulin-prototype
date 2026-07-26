import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FilePenLine,
  FolderOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { ApplyBadge } from "@/components/status-badge";
import {
  Metric,
  PageHeader,
  Surface,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/workspace-ui";
import { daysUntil, useStore } from "@/lib/store";

export const Route = createFileRoute("/applicant/")({
  component: ApplicantHome,
});

type CalendarEvent = {
  id: string;
  date: string;
  label: string;
  title: string;
  href?: "/applicant/shows/$id" | "/applicant/applications/$appId";
  params?: { id: string } | { appId: string };
  tone: "favorite" | "audition" | "manual";
  manualId?: string;
};

const toDateKey = (value: string) => {
  const match = value.match(/(\d{4})\D(\d{1,2})\D(\d{1,2})/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

function ApplicantHome() {
  const applicant = useStore((state) => state.applicant);
  const shows = useStore((state) => state.shows);
  const allApplications = useStore((state) => state.applications);
  const favoriteShowIds = useStore((state) => state.favoriteShowIds);
  const manualSchedules = useStore((state) => state.manualSchedules);
  const applications = allApplications.filter((application) => application.applicantId === "me");

  const openShows = shows
    .filter((show) => show.status === "모집 중" && daysUntil(show.deadline) >= 0)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));
  const upcomingAuditions = applications
    .filter((application) => application.applyStatus === "오디션 예정")
    .map((application) => ({
      application,
      show: shows.find((show) => show.id === application.showId),
    }))
    .filter((item) => item.show && daysUntil(item.show.auditionDate) >= 0);
  const profileReady =
    Boolean(applicant.name && applicant.phone && applicant.email) &&
    applicant.photos.length > 0 &&
    applicant.videos.length > 0;
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    const favoriteEvents = shows
      .filter((show) => favoriteShowIds.includes(show.id))
      .map((show) => ({
        id: `favorite-${show.id}`,
        date: toDateKey(show.deadline),
        label: "즐겨찾기 마감",
        title: show.title,
        href: "/applicant/shows/$id" as const,
        params: { id: show.id },
        tone: "favorite" as const,
      }));
    const auditionEvents = upcomingAuditions
      .filter(({ show }) => show)
      .map(({ application, show }) => ({
        id: `audition-${application.id}`,
        date: toDateKey(show?.auditionDate ?? ""),
        label: "오디션",
        title: show?.title ?? "오디션 일정",
        href: "/applicant/applications/$appId" as const,
        params: { appId: application.id },
        tone: "audition" as const,
      }));
    const manualEvents = manualSchedules.map((schedule) => ({
      id: `manual-${schedule.id}`,
      date: schedule.date,
      label: schedule.note || "직접 추가한 일정",
      title: schedule.title,
      tone: "manual" as const,
      manualId: schedule.id,
    }));
    return [...favoriteEvents, ...auditionEvents, ...manualEvents].filter((event) => event.date);
  }, [favoriteShowIds, manualSchedules, shows, upcomingAuditions]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Today"
        title={`${applicant.stageName || applicant.name}님, 지금 필요한 일부터 볼게요.`}
        description="마감이 가까운 공고와 심사 결과, 오디션 일정을 먼저 확인하세요."
        actions={
          <Link to="/applicant/shows" className={primaryButtonClass}>
            <Search className="h-4 w-4" /> 공연 찾기
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="진행 중인 지원" value={`${applications.length}건`} />
        <Metric
          label="예정된 오디션"
          value={`${upcomingAuditions.length}건`}
          tone={upcomingAuditions.length > 0 ? "warning" : "default"}
        />
        <Metric
          label="마감 임박 공고"
          value={`${openShows.filter((show) => daysUntil(show.deadline) <= 7).length}건`}
        />
        <Metric
          label="프로필 준비"
          value={profileReady ? "완료" : "확인 필요"}
          tone={profileReady ? "success" : "warning"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <ScheduleCalendar events={calendarEvents} />

        <Surface title="빠른 실행" description="자주 사용하는 작업으로 바로 이동합니다.">
          <div className="grid gap-2">
            <Link to="/applicant/shows" className={primaryButtonClass}>
              <Search className="h-4 w-4" /> 모집 공고 찾기
            </Link>
            <Link to="/applicant/files" className={secondaryButtonClass}>
              <FolderOpen className="h-4 w-4" /> 사진·영상 자료 관리
            </Link>
            <Link to="/applicant/profile" className={secondaryButtonClass}>
              <FilePenLine className="h-4 w-4" /> 프로필 수정
            </Link>
          </div>
        </Surface>
      </div>

      <Surface
        title="마감이 가까운 공고"
        description="현재 지원 가능한 공고를 마감 순서로 정렬했습니다."
        action={
          <Link to="/applicant/shows" className="text-sm font-semibold hover:underline">
            공고 전체 보기 →
          </Link>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {openShows.slice(0, 4).map((show) => {
            const dDay = daysUntil(show.deadline);
            return (
              <Link
                key={show.id}
                to="/applicant/shows/$id"
                params={{ id: show.id }}
                className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary"
              >
                <div className="relative aspect-[16/8] overflow-hidden bg-secondary">
                  {show.posterImage && (
                    <img
                      src={show.posterImage}
                      alt=""
                      loading="lazy"
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] ${
                        show.posterPosition === "top" ? "object-top" : "object-center"
                      }`}
                    />
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow">
                    {dDay === 0 ? "오늘 마감" : `D-${dDay}`}
                  </span>
                </div>
                <div className="p-4">
                  <div className="truncate font-semibold">{show.title}</div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {show.producer} · {show.roles.map((role) => role.name).join(", ")}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" /> {show.deadline}
                  </div>
                </div>
              </Link>
            );
          })}
          {openShows.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              현재 지원 가능한 공고가 없습니다.
            </p>
          )}
        </div>
      </Surface>

      {applications.length > 0 && (
        <Surface title="최근 지원 상태">
          <div className="grid gap-3 md:grid-cols-2">
            {applications.slice(0, 4).map((application) => {
              const show = shows.find((item) => item.id === application.showId);
              return (
                <Link
                  key={application.id}
                  to="/applicant/applications/$appId"
                  params={{ appId: application.id }}
                  className="rounded-xl border border-border p-4 hover:border-primary"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{show?.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {application.submittedAt}
                      </div>
                    </div>
                    <ApplyBadge status={application.applyStatus} />
                  </div>
                </Link>
              );
            })}
          </div>
        </Surface>
      )}
    </div>
  );
}

function ScheduleCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const addManualSchedule = useStore((state) => state.addManualSchedule);
  const removeManualSchedule = useStore((state) => state.removeManualSchedule);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(() => dateKey(today));
  const [isAdding, setIsAdding] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState(() => dateKey(today));
  const [scheduleNote, setScheduleNote] = useState("");
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const leadingDays = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selectedEvents = events.filter((event) => event.date === selectedDate);

  const moveMonth = (offset: number) => {
    const next = new Date(year, month + offset, 1);
    setVisibleMonth(next);
    setSelectedDate(dateKey(next));
  };

  const openScheduleForm = () => {
    setScheduleDate(selectedDate);
    setIsAdding(true);
  };

  const submitSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = scheduleTitle.trim();
    if (!title || !scheduleDate) return;
    addManualSchedule({
      title,
      date: scheduleDate,
      note: scheduleNote.trim() || undefined,
    });
    const nextDate = new Date(`${scheduleDate}T00:00:00`);
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setSelectedDate(scheduleDate);
    setScheduleTitle("");
    setScheduleNote("");
    setIsAdding(false);
  };

  return (
    <Surface
      title="내 일정"
      description="마감일과 오디션, 직접 등록한 일정을 함께 확인합니다."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={openScheduleForm}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> 일정 추가
          </button>
          <div className="flex items-center gap-1" aria-label="월 이동">
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => moveMonth(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <strong className="min-w-24 text-center text-sm tabular-nums">
              {year}년 {month + 1}월
            </strong>
            <button
              type="button"
              aria-label="다음 달"
              onClick={() => moveMonth(1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      }
    >
      {isAdding && (
        <form
          onSubmit={submitSchedule}
          className="mb-4 grid gap-2 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[1fr_150px_auto]"
        >
          <label>
            <span className="sr-only">일정 이름</span>
            <input
              value={scheduleTitle}
              onChange={(event) => setScheduleTitle(event.target.value)}
              placeholder="일정 이름"
              autoFocus
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <label>
            <span className="sr-only">일정 날짜</span>
            <input
              type="date"
              value={scheduleDate}
              onChange={(event) => setScheduleDate(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!scheduleTitle.trim() || !scheduleDate}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-semibold"
            >
              취소
            </button>
          </div>
          <label className="sm:col-span-3">
            <span className="sr-only">일정 메모</span>
            <input
              value={scheduleNote}
              onChange={(event) => setScheduleNote(event.target.value)}
              placeholder="메모 (선택)"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        </form>
      )}

      <div className="mb-2 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#bed000]" /> 즐겨찾기 마감
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> 오디션
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> 직접 추가
        </span>
      </div>

      <div className="grid grid-cols-7 border-b border-border pb-2 text-center text-[11px] font-medium text-muted-foreground">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: leadingDays }, (_, index) => (
          <span key={`empty-${index}`} aria-hidden className="h-9 sm:h-10" />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const key = dateKey(new Date(year, month, day));
          const dayEvents = events.filter((event) => event.date === key);
          const selected = selectedDate === key;
          const isToday = dateKey(today) === key;

          return (
            <button
              key={key}
              type="button"
              aria-label={`${year}년 ${month + 1}월 ${day}일, 일정 ${dayEvents.length}개`}
              aria-pressed={selected}
              onClick={() => setSelectedDate(key)}
              className={`relative flex h-9 min-w-0 flex-col items-center justify-center rounded-lg text-xs transition sm:h-10 ${
                selected ? "bg-foreground font-semibold text-background" : "hover:bg-secondary"
              } ${isToday && !selected ? "ring-1 ring-inset ring-foreground" : ""}`}
            >
              <span>{day}</span>
              {dayEvents.length > 0 && (
                <span className="absolute bottom-1.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        event.tone === "favorite"
                          ? "bg-[#bed000]"
                          : event.tone === "audition"
                            ? "bg-warning"
                            : "bg-primary"
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          {selectedDate.replaceAll("-", ".")} 일정
        </div>
        {selectedEvents.length > 0 ? (
          <div className="space-y-2">
            {selectedEvents.map((event) => {
              const content = (
                <>
                  <span
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      event.tone === "favorite"
                        ? "bg-[#f1ff3d]"
                        : event.tone === "audition"
                          ? "bg-warning/15"
                          : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {event.tone === "favorite" ? (
                      <Bookmark className="h-4 w-4 fill-current" />
                    ) : (
                      <CalendarDays className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs text-muted-foreground">{event.label}</span>
                    <strong className="block truncate text-sm">{event.title}</strong>
                  </span>
                </>
              );

              return event.href && event.params ? (
                <Link
                  key={event.id}
                  to={event.href}
                  params={event.params as never}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary"
                >
                  {content}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ) : (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-xl border border-border p-3"
                >
                  {content}
                  {event.manualId && (
                    <button
                      type="button"
                      aria-label={`${event.title} 일정 삭제`}
                      onClick={() => removeManualSchedule(event.manualId!)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            선택한 날짜에 등록된 일정이 없습니다.
          </p>
        )}
        <Link
          to="/applicant/shows"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
        >
          <Bookmark className="h-4 w-4" /> 공고를 즐겨찾기해 일정에 추가하기
        </Link>
      </div>
    </Surface>
  );
}
