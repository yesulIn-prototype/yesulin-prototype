export type PostingScheduleDraft = {
  deadline: string;
  auditionStart: string;
  auditionEnd: string;
  resultAnnouncement: string;
  rehearsalStart: string;
  rehearsalEnd: string;
  showStart: string;
  showEnd: string;
};

export type PostingScheduleField = keyof PostingScheduleDraft;

export type PostingScheduleIssue = {
  field: PostingScheduleField;
  message: string;
};

const toTimestamp = (value: string) => {
  if (!value) return null;
  const timestamp = new Date(value.includes("T") ? value : `${value}T00:00`).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const isBefore = (later: string, earlier: string) => {
  const laterTimestamp = toTimestamp(later);
  const earlierTimestamp = toTimestamp(earlier);
  return laterTimestamp !== null && earlierTimestamp !== null && laterTimestamp < earlierTimestamp;
};

export function getPostingScheduleIssues(schedule: PostingScheduleDraft): PostingScheduleIssue[] {
  const issues: PostingScheduleIssue[] = [];

  if (schedule.auditionEnd && !schedule.auditionStart) {
    issues.push({
      field: "auditionStart",
      message: "오디션 종료일을 입력하려면 시작일도 선택해 주세요.",
    });
  }
  if (isBefore(schedule.auditionEnd, schedule.auditionStart)) {
    issues.push({
      field: "auditionEnd",
      message: "오디션 종료일은 시작일보다 빠를 수 없습니다.",
    });
  }
  if (schedule.rehearsalEnd && !schedule.rehearsalStart) {
    issues.push({
      field: "rehearsalStart",
      message: "연습 종료일을 입력하려면 시작일도 선택해 주세요.",
    });
  }
  if (isBefore(schedule.rehearsalEnd, schedule.rehearsalStart)) {
    issues.push({
      field: "rehearsalEnd",
      message: "연습 종료일은 시작일보다 빠를 수 없습니다.",
    });
  }
  if (schedule.showEnd && !schedule.showStart) {
    issues.push({
      field: "showStart",
      message: "공연 종료일을 입력하려면 시작일도 선택해 주세요.",
    });
  }
  if (isBefore(schedule.showEnd, schedule.showStart)) {
    issues.push({
      field: "showEnd",
      message: "공연 종료일은 시작일보다 빠를 수 없습니다.",
    });
  }

  if (isBefore(schedule.auditionStart, schedule.deadline)) {
    issues.push({
      field: "auditionStart",
      message: "오디션은 지원 마감 이후에 진행되어야 합니다.",
    });
  }

  const lastAuditionDate = schedule.auditionEnd || schedule.auditionStart;
  if (isBefore(schedule.resultAnnouncement, lastAuditionDate)) {
    issues.push({
      field: "resultAnnouncement",
      message: "결과 발표는 오디션 종료 이후로 설정해 주세요.",
    });
  } else if (isBefore(schedule.resultAnnouncement, schedule.deadline)) {
    issues.push({
      field: "resultAnnouncement",
      message: "결과 발표는 지원 마감 이후로 설정해 주세요.",
    });
  }

  if (isBefore(schedule.rehearsalStart, schedule.resultAnnouncement)) {
    issues.push({
      field: "rehearsalStart",
      message: "연습 시작일은 결과 발표 이후로 설정해 주세요.",
    });
  }

  const lastRehearsalDate = schedule.rehearsalEnd || schedule.rehearsalStart;
  if (isBefore(schedule.showStart, lastRehearsalDate)) {
    issues.push({
      field: "showStart",
      message: "공연 시작일은 연습 종료 이후로 설정해 주세요.",
    });
  }

  return issues;
}

export function formatPostingDate(value: string) {
  return value ? value.replaceAll("-", ".") : "";
}

export function formatPostingDateTime(value: string) {
  if (!value) return "";
  const [date, time] = value.split("T");
  return `${formatPostingDate(date)}${time ? ` ${time}` : ""}`;
}

export function formatPostingDateRange(start: string, end: string) {
  if (!start) return "";
  const formattedStart = formatPostingDate(start);
  if (!end || end === start) return formattedStart;
  return `${formattedStart} – ${formatPostingDate(end)}`;
}
