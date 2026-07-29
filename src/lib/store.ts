import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type ReviewStatus = "미확인" | "검토 중" | "오디션 대상" | "보류" | "합격" | "불합격";
export type ApplyStatus = "작성 중" | "지원 완료" | "서류 확인" | "오디션 예정" | "합격" | "불합격";
export type ScheduleKind = "지원 마감" | "오디션" | "연습" | "공연";
export type PublicationStatus = "임시 저장" | "게시됨";
export type StageResult = "검토 대기" | "진행 중" | "합격" | "불합격" | "보류" | "불참";
export type AuditionStageType = "서류" | "오디션" | "최종";

export type Career = {
  id: string;
  title: string;
  kind: string;
  role: string;
  period: string;
  producer: string;
  detail: string;
};

export type Photo = {
  id: string;
  fileName: string;
  image?: string;
  type: "정면 프로필" | "전신 프로필" | "상반신 프로필" | "콘셉트 사진";
  createdAt: string;
  isDefault?: boolean;
  color: string;
};

export type Video = {
  id: string;
  title: string;
  fileName: string;
  url?: string;
  type: "연기 자유 영상" | "지정 연기 영상" | "노래 자유곡 영상" | "안무 영상";
  duration: string;
  createdAt: string;
  color: string;
};

export type Doc = {
  id: string;
  fileName: string;
  url?: string;
  type: "이력서" | "포트폴리오" | "기타 제출 문서";
  createdAt: string;
};

export type ManualSchedule = {
  id: string;
  title: string;
  date: string;
  note?: string;
};

export type Applicant = {
  id: string;
  name: string;
  stageName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: string;
  height: string;
  bio: string;
  intro: string;
  careers: Career[];
  photos: Photo[];
  videos: Video[];
  docs: Doc[];
};

export type ShowRole = {
  id: string;
  name: string;
  description: string;
  requirements: string;
  allowMultiple: boolean;
};

export type RequirementItem = {
  key: string;
  label: string;
  required: boolean;
  note?: string;
};

export type AdditionalQuestion = {
  id: string;
  question: string;
  type: "짧은 답변" | "긴 답변" | "단일 선택" | "복수 선택" | "참여 가능 여부";
  options?: string[];
};

export type AuditionStage = {
  id: string;
  name: string;
  order: number;
  type: AuditionStageType;
  date?: string;
  venue?: string;
  resultAnnouncementDate?: string;
};

export type StageHistoryEntry = {
  id: string;
  stageId: string;
  stageName: string;
  result: StageResult;
  changedAt: string;
};

export type ShowDetailImage = {
  id: string;
  name: string;
  image: string;
};

export type Show = {
  id: string;
  performanceId?: string;
  title: string;
  postingTitle?: string;
  recruitmentRound?: number;
  producer: string;
  posterColor: string;
  posterImage: string;
  posterPosition?: "center" | "top";
  kind: string;
  description: string;
  detailText?: string;
  detailImages?: ShowDetailImage[];
  sourceUrl?: string;
  sourceLabel?: string;
  producerUrl?: string;
  roles: ShowRole[];
  deadline: string;
  auditionDate: string;
  rehearsalPeriod: string;
  showPeriod: string;
  venue: string;
  compensation: string;
  requiredItems: RequirementItem[];
  optionalItems: RequirementItem[];
  additionalQuestions: AdditionalQuestion[];
  status: "모집 중" | "모집 마감" | "모집 예정";
  publicationStatus?: PublicationStatus;
  updatedAt?: string;
  bumpedAt?: string;
  resultAnnouncementDate?: string;
  resultsSentAt?: string;
  auditionStages?: AuditionStage[];
};

export type Application = {
  id: string;
  showId: string;
  roleIds: string[];
  applicantId: string;
  applicantName: string;
  submittedAt: string;
  applyStatus: ApplyStatus;
  reviewStatus: ReviewStatus;
  selectedCareerIds: string[];
  selectedPhotoIds: string[];
  selectedVideoIds: string[];
  answers: Record<string, string>;
  availability: string;
  memo: string;
  motivation: string;
  shortlisted?: boolean;
  rating?: number;
  resultNotifiedAt?: string;
  currentStageId?: string;
  stageResult?: StageResult;
  stageHistory?: StageHistoryEntry[];
};

export type AccountRole = "producer" | "applicant";

export type TempAccount = {
  id: string;
  username: string;
  password: string;
  role: AccountRole;
  name: string;
  applicantId?: string;
  producerKey?: "company-connect" | "ninejin" | "test";
  logo?: string;
};

export const TEMP_ACCOUNTS: TempAccount[] = [
  {
    id: "producer-ninejin",
    username: "ninejin",
    password: "1234",
    role: "producer",
    name: "나인진엔터테인먼트",
    producerKey: "ninejin",
    logo: "/images/ninejin-group-logo.png",
  },
  {
    id: "producer-company-connect",
    username: "connect",
    password: "1234",
    role: "producer",
    name: "컴퍼니연결",
    producerKey: "company-connect",
    logo: "/images/company-connect-logo.png",
  },
  {
    id: "producer-test",
    username: "test",
    password: "1234",
    role: "producer",
    name: "테스트",
    producerKey: "test",
  },
  {
    id: "applicant-minjun",
    username: "minjun",
    password: "1234",
    role: "applicant",
    name: "강민준",
    applicantId: "login-minjun",
  },
  {
    id: "applicant-jihwan",
    username: "jihwan",
    password: "1234",
    role: "applicant",
    name: "김지환",
    applicantId: "login-jihwan",
  },
  {
    id: "applicant-donggun",
    username: "donggun",
    password: "1234",
    role: "applicant",
    name: "이동건",
    applicantId: "login-donggun",
  },
  {
    id: "applicant-haneul",
    username: "haneul",
    password: "1234",
    role: "applicant",
    name: "김하늘",
    applicantId: "me",
  },
];

export function getAuthAccount(accountId: string | null | undefined) {
  return TEMP_ACCOUNTS.find((account) => account.id === accountId);
}

export function isShowOwnedByAccount(show: Show, accountId: string | null | undefined) {
  const account = getAuthAccount(accountId);
  if (!account || account.role !== "producer") return false;
  if (account.producerKey === "ninejin") return show.producer.includes("나인진");
  if (account.producerKey === "company-connect") {
    return show.producer.replace(/\s/g, "").includes("컴퍼니연결");
  }
  return (
    !show.producer.includes("나인진") && !show.producer.replace(/\s/g, "").includes("컴퍼니연결")
  );
}

// -------- mock data --------

const meApplicant: Applicant = {
  id: "me",
  name: "김하늘",
  stageName: "하늘",
  phone: "010-1234-5678",
  email: "haneul@example.com",
  birthDate: "1998-04-12",
  gender: "여성",
  height: "165cm",
  bio: "노래와 연기 모두에 진심인 뮤지컬 배우",
  intro:
    "안녕하세요, 뮤지컬 배우 김하늘입니다. 무대에서의 진심을 가장 소중하게 생각하며, 작품 속 인물의 감정을 세밀하게 표현하기 위해 꾸준히 노력하고 있습니다. 다양한 장르에 열려 있으며 협업을 즐깁니다.",
  careers: [
    {
      id: "c1",
      title: "뮤지컬 별의 노래",
      kind: "뮤지컬",
      role: "앙상블",
      period: "2025.03 – 2025.06",
      producer: "스타라이트컴퍼니",
      detail: "메인 앙상블 및 커버 캐스팅",
    },
    {
      id: "c2",
      title: "연극 우리들의 계절",
      kind: "연극",
      role: "지우 역",
      period: "2024.08 – 2024.10",
      producer: "시선극단",
      detail: "여주인공, 전 회차 출연",
    },
    {
      id: "c3",
      title: "뮤지컬 시티라이트",
      kind: "뮤지컬",
      role: "스윙",
      period: "2024.02 – 2024.05",
      producer: "라이트스테이지",
      detail: "다역 스윙 및 안무 어시스트",
    },
  ],
  photos: [
    {
      id: "p1",
      fileName: "profile-front.jpg",
      image: "/images/profile/kim-haneul-front.png",
      type: "정면 프로필",
      createdAt: "2026.05.02",
      isDefault: true,
      color: "#171717",
    },
    {
      id: "p2",
      fileName: "profile-full.jpg",
      image: "/images/profile/kim-haneul-full.png",
      type: "전신 프로필",
      createdAt: "2026.05.02",
      color: "#6f7477",
    },
    {
      id: "p3",
      fileName: "profile-upper.jpg",
      image: "/images/profile/kim-haneul-upper.png",
      type: "상반신 프로필",
      createdAt: "2026.04.14",
      color: "#c7d228",
    },
    {
      id: "p4",
      fileName: "concept-moonlight.jpg",
      image: "/images/profile/kim-haneul-concept.png",
      type: "콘셉트 사진",
      createdAt: "2026.03.30",
      color: "#344054",
    },
  ],
  videos: [
    {
      id: "v1",
      title: "자유곡 뮤지컬 넘버",
      fileName: "자유곡_뮤지컬넘버.mp4",
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      type: "노래 자유곡 영상",
      duration: "1:48",
      createdAt: "2026.05.10",
      color: "#171717",
    },
    {
      id: "v2",
      title: "자유연기 독백",
      fileName: "자유연기_독백.mp4",
      type: "연기 자유 영상",
      duration: "1:25",
      createdAt: "2026.04.22",
      color: "#344054",
    },
    {
      id: "v3",
      title: "재즈 안무",
      fileName: "안무영상_재즈.mp4",
      type: "안무 영상",
      duration: "1:10",
      createdAt: "2026.03.18",
      color: "#c7d228",
    },
  ],
  docs: [
    { id: "d1", fileName: "김하늘_이력서_2026.pdf", type: "이력서", createdAt: "2026.05.01" },
    { id: "d2", fileName: "김하늘_포트폴리오.pdf", type: "포트폴리오", createdAt: "2026.04.20" },
  ],
};

type MockApplicantSeed = {
  id: string;
  name: string;
  stageName: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: "여성" | "남성";
  height: string;
  bio: string;
  intro: string;
  image: string;
  career: Omit<Career, "id">;
  videoType: Video["type"];
};

const createMockApplicant = (seed: MockApplicantSeed): Applicant => ({
  id: seed.id,
  name: seed.name,
  stageName: seed.stageName,
  phone: seed.phone,
  email: seed.email,
  birthDate: seed.birthDate,
  gender: seed.gender,
  height: seed.height,
  bio: seed.bio,
  intro: seed.intro,
  careers: [{ id: "c1", ...seed.career }],
  photos: [
    {
      id: "p1",
      fileName: `${seed.id}-profile.jpg`,
      image: seed.image,
      type: "정면 프로필",
      createdAt: "2026.07.20",
      isDefault: true,
      color: "#667085",
    },
  ],
  videos: [
    {
      id: "v1",
      title: seed.videoType,
      fileName: `${seed.id}-video.mp4`,
      type: seed.videoType,
      duration: "1:30",
      createdAt: "2026.07.21",
      color: "#344054",
    },
  ],
  docs: [],
});

const otherApplicants: Applicant[] = [
  {
    id: "a2",
    name: "이준호",
    stageName: "준",
    phone: "010-2222-3333",
    email: "junho@example.com",
    birthDate: "1995-09-01",
    gender: "남성",
    height: "178cm",
    bio: "탄탄한 발성의 남자 배우",
    intro: "무대 위 남자 주인공 역할을 다수 소화한 뮤지컬 배우 이준호입니다.",
    careers: [
      {
        id: "c1",
        title: "뮤지컬 바람의 언덕",
        kind: "뮤지컬",
        role: "주호 역",
        period: "2025.01 – 2025.04",
        producer: "라이트스테이지",
        detail: "남자 주인공",
      },
      {
        id: "c2",
        title: "연극 밤의 항해",
        kind: "연극",
        role: "선장 역",
        period: "2024.06 – 2024.08",
        producer: "밤바다극단",
        detail: "",
      },
    ],
    photos: [
      {
        id: "p1",
        fileName: "junho-front.jpg",
        image: "/images/applicants/lee-junho.jpg",
        type: "정면 프로필",
        createdAt: "2026.05.01",
        isDefault: true,
        color: "#242424",
      },
      {
        id: "p2",
        fileName: "junho-full.jpg",
        type: "전신 프로필",
        createdAt: "2026.05.01",
        color: "#62686c",
      },
    ],
    videos: [
      {
        id: "v1",
        title: "자유곡 발라드 넘버",
        fileName: "junho-song.mp4",
        type: "노래 자유곡 영상",
        duration: "1:55",
        createdAt: "2026.05.05",
        color: "#242424",
      },
      {
        id: "v2",
        title: "자유 독백",
        fileName: "junho-acting.mp4",
        type: "연기 자유 영상",
        duration: "1:30",
        createdAt: "2026.04.28",
        color: "#62686c",
      },
    ],
    docs: [],
  },
  {
    id: "a3",
    name: "박서연",
    stageName: "서연",
    phone: "010-4444-5555",
    email: "seoyeon@example.com",
    birthDate: "1999-12-08",
    gender: "여성",
    height: "162cm",
    bio: "밝고 다채로운 표현이 강점인 배우",
    intro: "다양한 캐릭터를 소화하는 것을 즐기는 뮤지컬 배우 박서연입니다.",
    careers: [
      {
        id: "c1",
        title: "뮤지컬 도시의 아침",
        kind: "뮤지컬",
        role: "서연 역",
        period: "2025.06 – 2025.09",
        producer: "선라이즈컴퍼니",
        detail: "",
      },
    ],
    photos: [
      {
        id: "p1",
        fileName: "seoyeon-front.jpg",
        image: "/images/applicants/park-seoyeon.jpg",
        type: "정면 프로필",
        createdAt: "2026.04.20",
        isDefault: true,
        color: "#6f7477",
      },
      {
        id: "p2",
        fileName: "seoyeon-full.jpg",
        type: "전신 프로필",
        createdAt: "2026.04.20",
        color: "#c7d228",
      },
      {
        id: "p3",
        fileName: "seoyeon-concept.jpg",
        type: "콘셉트 사진",
        createdAt: "2026.04.05",
        color: "#171717",
      },
    ],
    videos: [
      {
        id: "v1",
        title: "자유곡",
        fileName: "seoyeon-song.mp4",
        type: "노래 자유곡 영상",
        duration: "1:40",
        createdAt: "2026.05.02",
        color: "#6f7477",
      },
    ],
    docs: [],
  },
  {
    id: "a4",
    name: "정민재",
    stageName: "민재",
    phone: "010-6666-7777",
    email: "minjae@example.com",
    birthDate: "1997-03-22",
    gender: "남성",
    height: "182cm",
    bio: "댄스와 노래 모두 강점",
    intro: "안무 리드 경험이 풍부한 뮤지컬 배우 정민재입니다.",
    careers: [
      {
        id: "c1",
        title: "뮤지컬 나이트폴",
        kind: "뮤지컬",
        role: "댄스 캡틴",
        period: "2025.02 – 2025.05",
        producer: "블루스테이지",
        detail: "",
      },
      {
        id: "c2",
        title: "뮤지컬 별의 노래",
        kind: "뮤지컬",
        role: "앙상블",
        period: "2024.10 – 2024.12",
        producer: "스타라이트컴퍼니",
        detail: "",
      },
    ],
    photos: [
      {
        id: "p1",
        fileName: "minjae-front.jpg",
        image: "/images/applicants/jung-minjae.jpg",
        type: "정면 프로필",
        createdAt: "2026.04.15",
        isDefault: true,
        color: "#62686c",
      },
    ],
    videos: [
      {
        id: "v1",
        title: "안무 자유 영상",
        fileName: "minjae-dance.mp4",
        type: "안무 영상",
        duration: "1:20",
        createdAt: "2026.04.30",
        color: "#62686c",
      },
      {
        id: "v2",
        title: "자유곡",
        fileName: "minjae-song.mp4",
        type: "노래 자유곡 영상",
        duration: "1:50",
        createdAt: "2026.04.30",
        color: "#242424",
      },
    ],
    docs: [],
  },
  createMockApplicant({
    id: "a5",
    name: "한유진",
    stageName: "유진",
    phone: "010-7312-1048",
    email: "yujin.han@example.com",
    birthDate: "1997-02-14",
    gender: "여성",
    height: "166cm",
    bio: "따뜻한 에너지와 순발력이 강점인 연극 배우",
    intro: "인물의 일상적인 표정과 호흡에서 웃음과 감정을 발견하는 연극 배우 한유진입니다.",
    image: "/images/applicants/han-yujin.jpg",
    career: {
      title: "연극 오월의 식탁",
      kind: "연극",
      role: "서연 역",
      period: "2025.05 – 2025.08",
      producer: "라온극단",
      detail: "로맨틱 코미디 주연",
    },
    videoType: "연기 자유 영상",
  }),
  createMockApplicant({
    id: "a6",
    name: "최도현",
    stageName: "도현",
    phone: "010-4821-7365",
    email: "dohyun.choi@example.com",
    birthDate: "1993-11-03",
    gender: "남성",
    height: "181cm",
    bio: "생활 연기와 코미디 리듬에 강한 배우",
    intro:
      "과장되지 않은 생활 연기를 바탕으로 인물의 엉뚱함과 진심을 함께 보여주는 배우 최도현입니다.",
    image: "/images/applicants/choi-dohyun.jpg",
    career: {
      title: "연극 골목의 온도",
      kind: "연극",
      role: "정우 역",
      period: "2025.09 – 2025.11",
      producer: "오후극장",
      detail: "남자 주인공",
    },
    videoType: "연기 자유 영상",
  }),
  createMockApplicant({
    id: "a7",
    name: "서지원",
    stageName: "지원",
    phone: "010-9134-2750",
    email: "jiwon.seo@example.com",
    birthDate: "1992-06-22",
    gender: "여성",
    height: "168cm",
    bio: "창작 과정과 앙상블 호흡을 중시하는 배우",
    intro: "공동 창작과 긴 호흡의 훈련을 즐기며, 작품 밖의 제작 과정에도 책임감 있게 참여합니다.",
    image: "/images/applicants/seo-jiwon.jpg",
    career: {
      title: "연극 공동체",
      kind: "연극",
      role: "선영 역",
      period: "2025.03 – 2025.06",
      producer: "극단 마루",
      detail: "공동창작 및 주연",
    },
    videoType: "연기 자유 영상",
  }),
  createMockApplicant({
    id: "a8",
    name: "강민석",
    stageName: "민석",
    phone: "010-3652-8491",
    email: "minseok.kang@example.com",
    birthDate: "1990-10-18",
    gender: "남성",
    height: "179cm",
    bio: "안정적인 호흡과 리더십을 갖춘 연극 배우",
    intro: "꾸준한 훈련과 동료 간의 신뢰를 가장 중요하게 생각하는 배우 강민석입니다.",
    image: "/images/applicants/kang-minseok.jpg",
    career: {
      title: "연극 해안선",
      kind: "연극",
      role: "태식 역",
      period: "2024.10 – 2025.01",
      producer: "파도극단",
      detail: "조연 및 조연출",
    },
    videoType: "지정 연기 영상",
  }),
  createMockApplicant({
    id: "a9",
    name: "윤아라",
    stageName: "아라",
    phone: "010-5278-1934",
    email: "ara.yoon@example.com",
    birthDate: "2000-01-25",
    gender: "여성",
    height: "164cm",
    bio: "선명한 춤선과 밝은 보컬을 겸비한 배우",
    intro: "재즈와 현대무용을 기반으로 군무의 에너지를 살리는 뮤지컬 배우 윤아라입니다.",
    image: "/images/applicants/yoon-ara.jpg",
    career: {
      title: "뮤지컬 리듬시티",
      kind: "뮤지컬",
      role: "댄스 앙상블",
      period: "2025.04 – 2025.07",
      producer: "플레이온",
      detail: "댄스 브레이크 센터",
    },
    videoType: "안무 영상",
  }),
  createMockApplicant({
    id: "a10",
    name: "임태양",
    stageName: "태양",
    phone: "010-6483-5217",
    email: "taeyang.lim@example.com",
    birthDate: "1996-05-07",
    gender: "남성",
    height: "180cm",
    bio: "재즈 보컬과 섬세한 감정 표현이 강점인 배우",
    intro:
      "라이브 밴드와 호흡하는 무대를 좋아하며 재즈의 여백을 연기로 연결하는 배우 임태양입니다.",
    image: "/images/applicants/lim-taeyang.jpg",
    career: {
      title: "뮤지컬 재즈나이트",
      kind: "뮤지컬",
      role: "준호 역",
      period: "2025.08 – 2025.10",
      producer: "블루노트",
      detail: "주연 및 보컬 캡틴",
    },
    videoType: "노래 자유곡 영상",
  }),
  createMockApplicant({
    id: "a11",
    name: "오수아",
    stageName: "수아",
    phone: "010-2947-6803",
    email: "sua.oh@example.com",
    birthDate: "2001-08-12",
    gender: "여성",
    height: "163cm",
    bio: "절제된 표현으로 감정을 쌓아가는 배우",
    intro: "말보다 침묵에서 드러나는 인물의 감정을 오래 관찰하고 표현하는 배우 오수아입니다.",
    image: "/images/applicants/oh-sua.jpg",
    career: {
      title: "연극 파란 계절",
      kind: "연극",
      role: "수아 역",
      period: "2025.06 – 2025.08",
      producer: "느린극장",
      detail: "2인극 주연",
    },
    videoType: "연기 자유 영상",
  }),
  createMockApplicant({
    id: "a12",
    name: "배현우",
    stageName: "현우",
    phone: "010-8051-4372",
    email: "hyunwoo.bae@example.com",
    birthDate: "1997-12-30",
    gender: "남성",
    height: "181cm",
    bio: "차분한 호흡으로 깊은 감정을 전달하는 배우",
    intro: "상대 배우의 호흡을 듣고 작은 감정의 변화를 무대 위에 축적하는 배우 배현우입니다.",
    image: "/images/applicants/bae-hyunwoo.jpg",
    career: {
      title: "연극 남겨진 편지",
      kind: "연극",
      role: "현우 역",
      period: "2025.02 – 2025.05",
      producer: "새벽극단",
      detail: "남자 주연",
    },
    videoType: "지정 연기 영상",
  }),
  createMockApplicant({
    id: "a13",
    name: "채은서",
    stageName: "은서",
    phone: "010-1764-9285",
    email: "eunseo.chae@example.com",
    birthDate: "1998-03-09",
    gender: "여성",
    height: "167cm",
    bio: "맑은 음색과 신비로운 무대 분위기의 배우",
    intro:
      "판타지와 드라마 장르에서 인물의 단단한 내면을 노래와 연기로 표현하는 배우 채은서입니다.",
    image: "/images/applicants/chae-eunseo.jpg",
    career: {
      title: "뮤지컬 별의 문",
      kind: "뮤지컬",
      role: "이브 역",
      period: "2025.09 – 2025.12",
      producer: "루멘컴퍼니",
      detail: "여자 주연",
    },
    videoType: "노래 자유곡 영상",
  }),
];

const createLoginApplicant = (
  seed: MockApplicantSeed & { secondImage: string; documentName: string },
): Applicant => {
  const applicant = createMockApplicant(seed);
  return {
    ...applicant,
    photos: [
      applicant.photos[0],
      {
        id: "p2",
        fileName: `${seed.id}-upper.jpg`,
        image: seed.secondImage,
        type: "상반신 프로필",
        createdAt: "2026.07.22",
        color: "#475467",
      },
    ],
    videos: applicant.videos.map((video) => ({
      ...video,
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    })),
    docs: [
      {
        id: "d1",
        fileName: seed.documentName,
        type: "이력서",
        createdAt: "2026.07.23",
      },
    ],
  };
};

const loginApplicants: Applicant[] = [
  createLoginApplicant({
    id: "login-minjun",
    name: "강민준",
    stageName: "민준",
    phone: "010-1024-1837",
    email: "minjun.kang@example.com",
    birthDate: "1996-05-18",
    gender: "남성",
    height: "180cm",
    bio: "힘 있는 발성과 섬세한 호흡을 함께 갖춘 배우",
    intro: "작품의 리듬을 정확히 읽고 동료 배우와 장면을 함께 완성하는 배우 강민준입니다.",
    image: "/images/applicants/kang-minseok.jpg",
    secondImage: "/images/applicants/lee-junho.jpg",
    career: {
      title: "연극 뜨거운 오후",
      kind: "연극",
      role: "민수 역",
      period: "2025.04 – 2025.07",
      producer: "극단 초점",
      detail: "남자 주연",
    },
    videoType: "연기 자유 영상",
    documentName: "강민준_배우이력서.pdf",
  }),
  createLoginApplicant({
    id: "login-jihwan",
    name: "김지환",
    stageName: "지환",
    phone: "010-2471-6028",
    email: "jihwan.kim@example.com",
    birthDate: "1999-09-02",
    gender: "남성",
    height: "178cm",
    bio: "빠른 캐릭터 전환과 코미디 감각이 강점인 배우",
    intro: "일상적인 말투 안에서 인물의 웃음과 긴장을 발견하는 배우 김지환입니다.",
    image: "/images/applicants/choi-dohyun.jpg",
    secondImage: "/images/applicants/jung-minjae.jpg",
    career: {
      title: "연극 옆방 사람들",
      kind: "연극",
      role: "지호 역",
      period: "2025.08 – 2025.11",
      producer: "무대사이",
      detail: "코미디 연극 주연",
    },
    videoType: "지정 연기 영상",
    documentName: "김지환_프로필.pdf",
  }),
  createLoginApplicant({
    id: "login-donggun",
    name: "이동건",
    stageName: "동건",
    phone: "010-5683-4091",
    email: "donggun.lee@example.com",
    birthDate: "1997-01-26",
    gender: "남성",
    height: "182cm",
    bio: "묵직한 에너지와 안정적인 무대 집중력을 지닌 배우",
    intro: "인물의 선택에 설득력을 더하는 차분한 연기를 지향하는 배우 이동건입니다.",
    image: "/images/applicants/bae-hyunwoo.jpg",
    secondImage: "/images/applicants/lim-taeyang.jpg",
    career: {
      title: "뮤지컬 긴 밤의 노래",
      kind: "뮤지컬",
      role: "도윤 역",
      period: "2025.02 – 2025.05",
      producer: "블루문",
      detail: "남자 조연",
    },
    videoType: "노래 자유곡 영상",
    documentName: "이동건_이력서.pdf",
  }),
  meApplicant,
];

const allMockApplicants = [...loginApplicants, ...otherApplicants];

const commonRequired: RequirementItem[] = [
  { key: "profile", label: "기본 프로필", required: true },
  { key: "career", label: "최근 3년 이내 주요 경력", required: true },
  { key: "photo-front", label: "정면 프로필 사진", required: true },
  { key: "photo-full", label: "전신 프로필 사진", required: true },
  {
    key: "video-song",
    label: "2분 이내 자유곡 영상",
    required: true,
    note: "얼굴과 상반신이 보여야 함",
  },
  { key: "motivation", label: "지원 동기", required: true },
];

const shows: Show[] = [
  {
    id: "show-high-life-2026",
    performanceId: "performance-high-life",
    title: "연극 HIGH LIFE",
    postingTitle: "2026년 10월 공연 배우 오디션",
    recruitmentRound: 1,
    producer: "(주)나인진엔터테인먼트",
    posterColor: "#d00000",
    posterImage: "/images/editorial/high-life-audition-2026.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "Lee MacDougall의 희곡 〈HIGH LIFE〉를 정구진 연출로 선보이는 2026년 10월 공연입니다. 전과자와 모르핀 중독자들의 삶에서 영감을 받은 작품으로, 나인진홀 3관에서 한 달간 공연합니다.",
    detailText:
      "작: Lee MacDougall · 연출: 정구진 · 제작: NINEJIN ENT.\n\n1994~2004년생 남자 배우 1명과 여자 배우 1명을 더블 캐스팅으로 모집합니다. 자유 양식 지원 서류를 ninejin6485@naver.com으로 제출해주세요.\n\n서류 합격자에 한해 연기 오디션 일정과 장소를 개별 안내합니다.\n\n도라상(Dora Award) 중형 극장 부문 최우수 신작상 수상작이며, 캐나다 총독 문학상과 플로이드 S. 차머스상에 노미네이트된 작품입니다.",
    detailImages: [
      {
        id: "detail-high-life-audition-2026",
        name: "연극 HIGH LIFE 오디션 공고",
        image: "/images/editorial/high-life-audition-2026.jpg",
      },
    ],
    sourceUrl: "https://otr.co.kr/audition/?vid=21658",
    sourceLabel: "OTR 원문 공고",
    roles: [
      {
        id: "male-actor",
        name: "남자 배우",
        description: "연극 HIGH LIFE 남자 배역",
        requirements: "남성, 1994~2004년생 · 더블 캐스팅",
        allowMultiple: false,
      },
      {
        id: "female-actor",
        name: "여자 배우",
        description: "연극 HIGH LIFE 여자 배역",
        requirements: "여성, 1994~2004년생 · 더블 캐스팅",
        allowMultiple: false,
      },
    ],
    deadline: "2026.08.09 22:00",
    auditionDate: "서류 합격자에게 개별 안내",
    rehearsalPeriod: "개별 안내",
    showPeriod: "2026.10 (1개월)",
    venue: "나인진홀 3관",
    compensation: "협의",
    requiredItems: [
      {
        key: "application-form",
        label: "자유 양식 지원 서류",
        required: true,
        note: "프로필과 연락처를 포함해 이메일 제출",
      },
    ],
    optionalItems: [
      {
        key: "photo-profile",
        label: "프로필 사진",
        required: false,
      },
      {
        key: "video-acting",
        label: "연기 영상",
        required: false,
      },
    ],
    additionalQuestions: [
      {
        id: "q1",
        question: "2026년 10월 한 달간 공연 일정에 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 협의 필요", "불가"],
      },
      {
        id: "q2",
        question: "작품 또는 지원 배역과 관련된 경험을 작성해주세요.",
        type: "긴 답변",
      },
    ],
    status: "모집 중",
    publicationStatus: "게시됨",
    updatedAt: "2026-07-28T02:00:19.000Z",
    auditionStages: [
      {
        id: "document",
        name: "1차 서류 전형",
        order: 1,
        type: "서류",
        date: "2026.08.09 22:00 마감",
      },
      {
        id: "audition-1",
        name: "2차 연기 오디션",
        order: 2,
        type: "오디션",
        date: "서류 합격자에게 개별 안내",
        venue: "서류 합격자에게 개별 안내",
      },
      {
        id: "final",
        name: "최종 결과",
        order: 3,
        type: "최종",
      },
    ],
  },
  {
    id: "show-hangover-2026-second-half",
    performanceId: "performance-hangover",
    title: "연극 행오버",
    postingTitle: "2026 하반기 배우 오디션",
    recruitmentRound: 1,
    producer: "(주)나인진엔터테인먼트",
    posterColor: "#25162b",
    posterImage: "/images/editorial/hangover-audition-2026.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "코믹 추리 스릴러 연극 〈행오버〉의 2026년 하반기 공연을 함께할 배우를 모집합니다. 이벤트 회사 대표, 변호사, 살인 사건의 피해자, 기억을 읽는 유리병과 방화범까지 다섯 인물의 얽힌 기억과 진실을 다루는 작품입니다.",
    detailText:
      "제작·기획: (주)나인진엔터테인먼트\n작: 정구진 · 연출: 한호정 · 총괄프로듀서: 강지원\n\n1차 서류 전형은 지정 지원서를 작성해 ninejin6485@naver.com으로 접수하며, 서류 합격자에게 지정 대본과 2차 오디션 장소를 개별 안내합니다.\n\n2차 실기 오디션은 지정연기와 1분 이내 자유연기로 진행합니다. 최근 6개월 이내 촬영한 얼굴·상반신·전신 사진을 지원서에 포함해야 하며, 연습과 공연 기간에 성실히 참여할 수 있어야 합니다.",
    detailImages: [
      {
        id: "detail-hangover-audition-2026",
        name: "연극 행오버 2026 하반기 오디션 공고",
        image: "/images/editorial/hangover-audition-2026.jpg",
      },
    ],
    sourceUrl: "https://otr.co.kr/audition/?vid=20561",
    sourceLabel: "OTR 원문 공고",
    roles: [
      {
        id: "jang-taemin",
        name: "장태민",
        description: "이벤트 회사를 운영하는 장기 매매범",
        requirements: "남성, 20~30대",
        allowMultiple: true,
      },
      {
        id: "kang-cheolsu",
        name: "강철수",
        description: "아내 살해 용의자로 몰린 변호사",
        requirements: "남성, 20~30대",
        allowMultiple: true,
      },
      {
        id: "yoo-jiyeon",
        name: "유지연",
        description: "완벽해 보였던 이벤트의 끝에서 살해된 여자",
        requirements: "여성, 20~30대",
        allowMultiple: true,
      },
      {
        id: "kay",
        name: "케이",
        description: "타인의 기억을 읽는 유리병",
        requirements: "남성, 20~30대",
        allowMultiple: true,
      },
      {
        id: "emma",
        name: "엠마",
        description: "자살 시도를 실패한 방화범",
        requirements: "여성, 20~30대",
        allowMultiple: true,
      },
    ],
    deadline: "2026.08.03 22:00",
    auditionDate: "2026.08.05 – 2026.08.06",
    rehearsalPeriod: "2026.05 – 2026.06",
    showPeriod: "2026.07 – 2026.12",
    venue: "대학로 정극장",
    compensation: "협의",
    requiredItems: [
      {
        key: "application-form",
        label: "행오버 지정 지원서",
        required: true,
        note: "첨부 양식 작성",
      },
      {
        key: "photo-face",
        label: "최근 6개월 이내 얼굴 사진",
        required: true,
      },
      {
        key: "photo-upper",
        label: "최근 6개월 이내 상반신 사진",
        required: true,
      },
      {
        key: "photo-full",
        label: "최근 6개월 이내 전신 사진",
        required: true,
      },
    ],
    optionalItems: [],
    additionalQuestions: [
      {
        id: "q1",
        question: "2026년 5~6월 연습과 7~12월 공연 일정에 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 협의 필요", "불가"],
      },
      {
        id: "q2",
        question: "지원 배역과 해당 배역을 선택한 이유를 작성해주세요.",
        type: "긴 답변",
      },
    ],
    status: "모집 중",
    publicationStatus: "게시됨",
    updatedAt: "2026-04-07T07:03:00.000Z",
    resultAnnouncementDate: "2026.08.07 15:00",
    auditionStages: [
      {
        id: "document",
        name: "1차 서류 전형",
        order: 1,
        type: "서류",
        date: "2026.07.29 – 2026.08.03 22:00",
        resultAnnouncementDate: "2026.08.04 15:00",
      },
      {
        id: "audition-1",
        name: "2차 실기 오디션",
        order: 2,
        type: "오디션",
        date: "2026.08.05 – 2026.08.06",
        venue: "서류 합격자에게 개별 안내",
        resultAnnouncementDate: "2026.08.07 15:00",
      },
      {
        id: "final",
        name: "최종 결과",
        order: 3,
        type: "최종",
        resultAnnouncementDate: "2026.08.07 15:00",
      },
    ],
  },
  {
    id: "show-restaurant-christmas",
    performanceId: "performance-restaurant-christmas",
    title: "연극 식당: 매일이 크리스마스",
    postingTitle: "1차 주·조연 배우 모집",
    recruitmentRound: 1,
    producer: "컴퍼니 연결 × 남극장",
    posterColor: "#2c0907",
    posterImage: "/images/editorial/company-connect-restaurant.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "세상의 모든 숫자가 사라진 날, 자신의 식당을 매일 크리스마스로 꾸미는 남자와 크리스마스에 운명을 만날 것이라 믿는 여자가 서로의 하루가 되어가는 로맨틱 코미디입니다. 컴퍼니 연결과 남극장이 함께 제작하며 관객과의 직접적인 소통과 인터랙션이 포함됩니다.",
    detailText:
      "관객과 가까이 호흡하는 다이닝 씨어터 형식의 공연입니다.\n\n오디션에서는 자유연기와 간단한 즉흥 장면을 함께 진행하며, 세부 시간은 서류 합격자에게 개별 안내합니다.",
    detailImages: [
      {
        id: "detail-restaurant-1",
        name: "연극 식당 상세 공고",
        image: "/images/editorial/company-connect-restaurant.jpg",
      },
    ],
    sourceUrl:
      "https://otr.co.kr/audition/?board_name=audition&search_field=fn_user_pid&search_text=2444&list_type=list&lang=ko_KR&vid=21547",
    sourceLabel: "OTR 원문 공고",
    producerUrl: "https://eyongyeol.creatorlink.net/",
    roles: [
      {
        id: "r1",
        name: "남자 역",
        description: "숫자가 사라진 뒤 운영하던 레스토랑을 매일 크리스마스로 꾸미고 있는 사장",
        requirements: "진지하고 조금 너드스러운 인물을 표현할 수 있는 배우",
        allowMultiple: true,
      },
      {
        id: "r2",
        name: "여자 역",
        description: "크리스마스에 운명을 만나게 될 것이라고 믿는 밝고 시원시원한 인물",
        requirements: "쾌활한 에너지와 로맨틱 코미디 연기가 가능한 배우",
        allowMultiple: true,
      },
      {
        id: "r3",
        name: "멀티 역",
        description: "옆가게 사장, 단골손님, 배달기사, 구청 직원, 사진사, 뉴스 앵커 등 다수의 인물",
        requirements: "빠른 인물 전환과 다양한 캐릭터 표현이 가능한 배우",
        allowMultiple: true,
      },
    ],
    deadline: "2026.07.31 20:00",
    auditionDate: "2026.08.03 – 2026.08.05",
    rehearsalPeriod: "2026.08.24부터 평일 13:00–17:00",
    showPeriod: "2026.10.07 – 2027.01.10",
    venue: "남극장",
    compensation: "개별 협의",
    requiredItems: [
      {
        key: "profile",
        label: "사진·이력·연락처가 포함된 프로필",
        required: true,
      },
      {
        key: "video-acting",
        label: "연기 영상",
        required: true,
      },
    ],
    optionalItems: [
      {
        key: "video-song",
        label: "노래 영상 또는 음원",
        required: false,
        note: "2차 오디션 대상자는 MR 제출 안내 예정",
      },
    ],
    additionalQuestions: [
      {
        id: "q1",
        question: "지원 배역과 해당 배역을 선택한 이유를 작성해주세요.",
        type: "긴 답변",
      },
      {
        id: "q2",
        question: "전체 공연 및 연습 일정에 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 협의 필요", "불가"],
      },
      {
        id: "q3",
        question: "관객과 직접 소통하거나 즉흥적으로 연기한 경험이 있나요?",
        type: "긴 답변",
      },
    ],
    status: "모집 중",
    resultAnnouncementDate: "2026.08.10",
  },
  {
    id: "show-company-connect-ensemble",
    performanceId: "performance-company-connect-ensemble",
    title: "2026 컴퍼니 연결 배우단원 모집",
    postingTitle: "2026 배우단원 정기 모집",
    recruitmentRound: 1,
    producer: "컴퍼니 연결 × 남극장",
    posterColor: "#173a69",
    posterImage: "/images/editorial/company-connect-ensemble.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "2017년 창단한 컴퍼니 연결은 남극장을 기반으로 지속적인 훈련과 창작을 함께할 배우단원을 모집했습니다. 단원은 정기 활동과 기획·제작 프로덕션, 공연장 및 공동체 운영에 참여하며 장기적으로 성장하는 창작 공동체를 지향합니다.",
    detailText:
      "배우단원은 정기 훈련, 공동 창작, 남극장 운영 프로그램에 함께 참여합니다.\n\n지원서에서는 단체 활동 경험과 장기적인 창작 계획을 중점적으로 확인합니다.",
    detailImages: [
      {
        id: "detail-ensemble-1",
        name: "컴퍼니 연결 배우단원 모집 상세",
        image: "/images/editorial/company-connect-ensemble.jpg",
      },
    ],
    sourceUrl:
      "https://otr.co.kr/audition/?board_name=audition&search_field=fn_user_pid&search_text=2444&list_type=list&lang=ko_KR&vid=21441",
    sourceLabel: "OTR 원문 공고",
    producerUrl: "https://eyongyeol.creatorlink.net/",
    roles: [
      {
        id: "r1",
        name: "배우단원",
        description:
          "컴퍼니 연결의 정기 단원 활동과 기획·제작 프로덕션, 남극장 운영에 함께하는 구성원",
        requirements:
          "경력·학력·전공 제한 없음, 지속적인 훈련과 창작 활동 및 단체 활동에 책임감 있게 참여",
        allowMultiple: false,
      },
    ],
    deadline: "2026.08.05 18:00",
    auditionDate: "2026.08.07 – 2026.08.08, 13:00–18:00",
    rehearsalPeriod: "단원 활동 중 지속 훈련 및 창작",
    showPeriod: "1년 계약, 상호 협의로 연장",
    venue: "남극장 (서울 관악구 사로수길)",
    compensation: "작품 및 행사 건당 협의",
    requiredItems: [
      {
        key: "application-form",
        label: "컴퍼니 연결 배우단원 지원서",
        required: true,
        note: "지정 양식",
      },
    ],
    optionalItems: [
      {
        key: "video-acting",
        label: "연기 및 특기 영상",
        required: false,
      },
    ],
    additionalQuestions: [
      {
        id: "q1",
        question: "장기적인 단원 활동과 창작 공동체에 지원한 이유를 작성해주세요.",
        type: "긴 답변",
      },
    ],
    status: "모집 중",
    resultAnnouncementDate: "2026.08.10",
    auditionStages: [
      {
        id: "document",
        name: "1차 서류 전형",
        order: 1,
        type: "서류",
        date: "2026.08.05 18:00 마감",
      },
      {
        id: "audition-1",
        name: "2차 대면 오디션",
        order: 2,
        type: "오디션",
        date: "2026.08.07 – 2026.08.08, 13:00–18:00",
        venue: "남극장",
        resultAnnouncementDate: "2026.08.10",
      },
      {
        id: "final",
        name: "최종 결과",
        order: 3,
        type: "최종",
        resultAnnouncementDate: "2026.08.10",
      },
    ],
  },
  {
    id: "show-moonlight",
    performanceId: "performance-moonlight",
    title: "뮤지컬 달빛",
    postingTitle: "1차 주·조연 배우 모집",
    recruitmentRound: 1,
    producer: "컴퍼니연결",
    posterColor: "#344054",
    posterImage: "/images/editorial/poster-moonlight.jpg",
    kind: "뮤지컬",
    description:
      "잊혀진 도시의 밤을 배경으로, 서로 다른 시간을 살아온 두 사람의 만남과 이별을 그리는 창작 뮤지컬입니다. 감정선이 섬세한 넘버와 몰입감 있는 서사로 관객을 초대합니다.",
    roles: [
      {
        id: "r1",
        name: "민우",
        description: "낮에는 사서, 밤에는 거리의 음악가로 살아가는 20대 후반 남성",
        requirements: "발라드 톤 강점, 극 전체 출연",
        allowMultiple: false,
      },
      {
        id: "r2",
        name: "서연",
        description: "잃어버린 노트를 찾으러 도시를 헤매는 20대 여성",
        requirements: "고음 안정, 감정 연기",
        allowMultiple: false,
      },
      {
        id: "r3",
        name: "남성 앙상블",
        description: "군무와 코러스 중심",
        requirements: "안무 소화 필수",
        allowMultiple: true,
      },
      {
        id: "r4",
        name: "여성 앙상블",
        description: "군무와 코러스 중심",
        requirements: "안무 소화 필수",
        allowMultiple: true,
      },
    ],
    deadline: "2026.07.20",
    auditionDate: "2026.07.25",
    rehearsalPeriod: "2026.08.03 – 2026.09.10",
    showPeriod: "2026.09.12 – 2026.10.04",
    venue: "라이트홀 대극장",
    compensation: "회당 출연료 지급 (별도 협의)",
    requiredItems: commonRequired,
    optionalItems: [
      { key: "video-acting", label: "연기 자유 영상", required: false, note: "1분 30초 이내" },
      { key: "photo-concept", label: "콘셉트 사진", required: false },
      { key: "resume", label: "이력서", required: false },
    ],
    additionalQuestions: [
      { id: "q1", question: "이 작품에 지원한 이유를 작성해주세요.", type: "긴 답변" },
      { id: "q2", question: "지원 배역과 관련된 경험이 있다면 작성해주세요.", type: "긴 답변" },
      {
        id: "q3",
        question: "연습 일정(8/3~9/10)에 모두 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 불가", "불가"],
      },
      { id: "q4", question: "현재 참여 중이거나 예정된 다른 작품이 있나요?", type: "짧은 답변" },
    ],
    status: "모집 마감",
    resultAnnouncementDate: "2026.07.27",
  },
  {
    id: "show-moonlight-ensemble",
    performanceId: "performance-moonlight",
    title: "뮤지컬 달빛",
    postingTitle: "2차 앙상블 추가 모집",
    recruitmentRound: 2,
    producer: "컴퍼니연결",
    posterColor: "#344054",
    posterImage: "/images/editorial/poster-moonlight.jpg",
    kind: "뮤지컬",
    description: "뮤지컬 달빛의 군무와 코러스를 함께 완성할 남녀 앙상블 배우를 추가 모집합니다.",
    roles: [
      {
        id: "r3",
        name: "남성 앙상블",
        description: "군무와 코러스 중심",
        requirements: "안무 소화 필수",
        allowMultiple: true,
      },
      {
        id: "r4",
        name: "여성 앙상블",
        description: "군무와 코러스 중심",
        requirements: "안무 소화 필수",
        allowMultiple: true,
      },
    ],
    deadline: "2026.07.30",
    auditionDate: "2026.08.01",
    rehearsalPeriod: "2026.08.03 – 2026.09.10",
    showPeriod: "2026.09.12 – 2026.10.04",
    venue: "라이트홀 대극장",
    compensation: "회당 출연료 지급 (별도 협의)",
    requiredItems: commonRequired,
    optionalItems: [{ key: "video-dance", label: "안무 영상", required: false }],
    additionalQuestions: [
      {
        id: "q1",
        question: "앙상블 또는 댄스 캡틴 경험을 작성해주세요.",
        type: "긴 답변",
      },
    ],
    status: "모집 중",
    publicationStatus: "게시됨",
    updatedAt: "2026-07-26T09:00:00.000Z",
    resultAnnouncementDate: "2026.08.05",
  },
  {
    id: "show-cityrain",
    performanceId: "performance-cityrain",
    title: "뮤지컬 시티레인",
    postingTitle: "1차 배우 모집",
    recruitmentRound: 1,
    producer: "스타라이트컴퍼니",
    posterColor: "#242424",
    posterImage: "/images/editorial/poster-cityrain.jpg",
    kind: "뮤지컬",
    description:
      "비 오는 도시를 배경으로 한 세 청춘의 성장 뮤지컬. 재즈와 팝을 오가는 넘버가 특징입니다.",
    roles: [
      {
        id: "r1",
        name: "지호",
        description: "재즈 클럽에서 노래하는 청년",
        requirements: "재즈 톤 선호",
        allowMultiple: false,
      },
      {
        id: "r2",
        name: "유나",
        description: "빗속을 걷는 청춘",
        requirements: "감정 몰입",
        allowMultiple: false,
      },
      {
        id: "r3",
        name: "앙상블",
        description: "코러스와 안무",
        requirements: "",
        allowMultiple: true,
      },
    ],
    deadline: "2026.08.05",
    auditionDate: "2026.08.10",
    rehearsalPeriod: "2026.09.01 – 2026.10.15",
    showPeriod: "2026.10.20 – 2026.11.30",
    venue: "블루문 아트센터",
    compensation: "회당 출연료 지급",
    requiredItems: commonRequired,
    optionalItems: [{ key: "video-dance", label: "안무 영상", required: false }],
    additionalQuestions: [
      { id: "q1", question: "재즈 장르 경험을 알려주세요.", type: "긴 답변" },
      {
        id: "q2",
        question: "연습 일정에 참여할 수 있나요?",
        type: "참여 가능 여부",
        options: ["가능", "일부 불가", "불가"],
      },
    ],
    status: "모집 중",
    resultAnnouncementDate: "2026.08.15",
  },
  {
    id: "show-summerplay",
    performanceId: "performance-summerplay",
    title: "연극 여름의 끝",
    postingTitle: "1차 배우 모집",
    recruitmentRound: 1,
    producer: "시선극단",
    posterColor: "#171717",
    posterImage: "/images/editorial/poster-summerplay.jpg",
    kind: "연극",
    description: "여름의 끝자락, 헤어지는 두 사람의 마지막 하루를 그린 2인극.",
    detailText:
      "두 인물의 마지막 하루를 밀도 높은 호흡으로 완성하는 소극장 2인극입니다.\n\n오디션은 지정 장면 리딩과 자유연기로 진행하며, 상대 배우와의 호흡을 중요하게 평가합니다.",
    detailImages: [
      {
        id: "detail-summerplay-1",
        name: "연극 여름의 끝 상세 공고",
        image: "/images/editorial/poster-summerplay.jpg",
      },
    ],
    roles: [
      {
        id: "r1",
        name: "여자 1",
        description: "떠나는 사람",
        requirements: "감정 연기",
        allowMultiple: false,
      },
      {
        id: "r2",
        name: "남자 1",
        description: "남는 사람",
        requirements: "감정 연기",
        allowMultiple: false,
      },
    ],
    deadline: "2026.07.28 23:59",
    auditionDate: "2026.08.02",
    rehearsalPeriod: "2026.08.15 – 2026.09.20",
    showPeriod: "2026.09.25 – 2026.10.10",
    venue: "소극장 시선",
    compensation: "협의",
    requiredItems: commonRequired
      .filter((r) => r.key !== "video-song")
      .concat({ key: "video-acting", label: "연기 자유 영상 (2분 이내)", required: true }),
    optionalItems: [],
    additionalQuestions: [
      { id: "q1", question: "이 작품에 지원한 이유는 무엇인가요?", type: "긴 답변" },
    ],
    status: "모집 마감",
    resultAnnouncementDate: "2026.08.08",
  },
  {
    id: "show-nightfall",
    performanceId: "performance-nightfall",
    title: "뮤지컬 나이트폴",
    postingTitle: "1차 배우 모집",
    recruitmentRound: 1,
    producer: "블루스테이지",
    posterColor: "#2a4759",
    posterImage: "/images/editorial/poster-nightfall.jpg",
    kind: "뮤지컬",
    description: "밤에만 열리는 극장의 비밀을 다루는 판타지 뮤지컬.",
    roles: [
      {
        id: "r1",
        name: "루카스",
        description: "극장의 관리인",
        requirements: "",
        allowMultiple: false,
      },
      {
        id: "r2",
        name: "이브",
        description: "관객으로 찾아온 여인",
        requirements: "",
        allowMultiple: false,
      },
      { id: "r3", name: "앙상블", description: "", requirements: "", allowMultiple: true },
    ],
    deadline: "2026.06.30",
    auditionDate: "2026.07.05",
    rehearsalPeriod: "2026.07.20 – 2026.08.25",
    showPeriod: "2026.08.28 – 2026.09.15",
    venue: "나이트홀",
    compensation: "회당 지급",
    requiredItems: commonRequired,
    optionalItems: [],
    additionalQuestions: [],
    status: "모집 마감",
    resultAnnouncementDate: "2026.07.10",
  },
];

const bundledShowIdsAddedAfterWorkspaceV5 = new Set([
  "show-hangover-2026-second-half",
  "show-high-life-2026",
]);

type BundledShowMigration = {
  revision: number;
  fields: Array<keyof Show>;
};

const bundledShowMigrations: Record<string, BundledShowMigration> = {
  "show-hangover-2026-second-half": {
    revision: 1,
    fields: ["deadline", "auditionDate", "status", "resultAnnouncementDate", "auditionStages"],
  },
  "show-company-connect-ensemble": {
    revision: 2,
    fields: ["deadline", "auditionDate", "status", "resultAnnouncementDate", "auditionStages"],
  },
  "show-summerplay": {
    revision: 2,
    fields: ["deadline", "status"],
  },
};

const currentBundledShowRevisions = Object.fromEntries(
  Object.entries(bundledShowMigrations).map(([showId, migration]) => [showId, migration.revision]),
);

type MockApplicationSeed = {
  id: string;
  showId: string;
  roleIds: string[];
  applicantId: string;
  applicantName: string;
  submittedAt: string;
  reviewStatus?: ReviewStatus;
  currentStageId?: string;
  stageResult?: StageResult;
  motivation: string;
  answers?: Record<string, string>;
  memo?: string;
  shortlisted?: boolean;
  rating?: number;
};

const createMockApplication = (seed: MockApplicationSeed): Application => ({
  id: seed.id,
  showId: seed.showId,
  roleIds: seed.roleIds,
  applicantId: seed.applicantId,
  applicantName: seed.applicantName,
  submittedAt: seed.submittedAt,
  applyStatus: seed.reviewStatus === "합격" ? "오디션 예정" : "지원 완료",
  reviewStatus: seed.reviewStatus ?? "미확인",
  selectedCareerIds: ["c1"],
  selectedPhotoIds: ["p1"],
  selectedVideoIds: ["v1"],
  answers: seed.answers ?? {},
  availability: "가능",
  memo: seed.memo ?? "",
  motivation: seed.motivation,
  shortlisted: seed.shortlisted,
  rating: seed.rating,
  currentStageId: seed.currentStageId ?? "document",
  stageResult: seed.stageResult ?? "검토 대기",
  stageHistory: [],
});

// pre-existing applications (mine + others for producer view)
const initialApplications: Application[] = [
  {
    id: "app-1",
    showId: "show-cityrain",
    roleIds: ["r2"],
    applicantId: "me",
    applicantName: "김하늘",
    submittedAt: "2026.07.02 14:22",
    applyStatus: "지원 완료",
    reviewStatus: "검토 중",
    selectedCareerIds: ["c1", "c3"],
    selectedPhotoIds: ["p1", "p2"],
    selectedVideoIds: ["v1"],
    answers: { q1: "재즈 워크숍 3회 참여 경험이 있습니다.", q2: "가능" },
    availability: "가능",
    memo: "",
    motivation: "재즈 톤 도전",
  },
  {
    id: "app-2",
    showId: "show-nightfall",
    roleIds: ["r3"],
    applicantId: "me",
    applicantName: "김하늘",
    submittedAt: "2026.06.18 09:12",
    applyStatus: "오디션 예정",
    reviewStatus: "합격",
    selectedCareerIds: ["c1"],
    selectedPhotoIds: ["p1", "p2"],
    selectedVideoIds: ["v1", "v3"],
    answers: {},
    availability: "가능",
    memo: "안무 소화력 좋음",
    motivation: "",
  },
  createMockApplication({
    id: "app-login-minjun-company",
    showId: "show-company-connect-ensemble",
    roleIds: ["r1"],
    applicantId: "login-minjun",
    applicantName: "강민준",
    submittedAt: "2026.07.26 11:20",
    reviewStatus: "검토 중",
    stageResult: "진행 중",
    motivation: "꾸준히 훈련하며 장기적인 창작 과정에 참여하고 싶습니다.",
    answers: {
      q1: "배우로서의 활동과 함께 공연 제작 과정에도 적극적으로 참여하겠습니다.",
    },
    rating: 4,
  }),
  createMockApplication({
    id: "app-login-jihwan-high-life",
    showId: "show-high-life-2026",
    roleIds: ["male-actor"],
    applicantId: "login-jihwan",
    applicantName: "김지환",
    submittedAt: "2026.07.28 15:42",
    motivation: "거친 상황 속에서도 살아 움직이는 인물의 유머와 불안을 표현하고 싶습니다.",
    answers: {
      q1: "가능",
      q2: "블랙코미디와 빠른 대사 호흡의 공연 경험이 있습니다.",
    },
  }),
  createMockApplication({
    id: "app-login-donggun-hangover",
    showId: "show-hangover-2026-second-half",
    roleIds: ["jang-taemin"],
    applicantId: "login-donggun",
    applicantName: "이동건",
    submittedAt: "2026.07.28 18:05",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-1",
    stageResult: "진행 중",
    motivation: "추리극의 긴장과 코미디 리듬을 동시에 살려보고 싶습니다.",
    answers: {
      q1: "연습과 공연 전 일정 참여 가능합니다.",
    },
    shortlisted: true,
    rating: 4,
  }),
  // Others applied to 달빛
  {
    id: "app-3",
    showId: "show-moonlight",
    roleIds: ["r1"],
    applicantId: "a2",
    applicantName: "이준호",
    submittedAt: "2026.07.09 18:40",
    applyStatus: "지원 완료",
    reviewStatus: "미확인",
    selectedCareerIds: ["c1", "c2"],
    selectedPhotoIds: ["p1", "p2"],
    selectedVideoIds: ["v1", "v2"],
    answers: {
      q1: "민우 캐릭터의 이중적 삶에 깊이 공감했습니다.",
      q2: "주인공 경험 다수",
      q3: "가능",
      q4: "없음",
    },
    availability: "가능",
    memo: "",
    motivation: "민우 역할의 서사에 공감",
  },
  {
    id: "app-4",
    showId: "show-moonlight",
    roleIds: ["r2"],
    applicantId: "a3",
    applicantName: "박서연",
    submittedAt: "2026.07.10 11:05",
    applyStatus: "지원 완료",
    reviewStatus: "검토 중",
    selectedCareerIds: ["c1"],
    selectedPhotoIds: ["p1", "p2", "p3"],
    selectedVideoIds: ["v1"],
    answers: {
      q1: "서연 역할에 강한 이끌림을 느꼈습니다.",
      q2: "주연 경험",
      q3: "가능",
      q4: "없음",
    },
    availability: "가능",
    memo: "",
    motivation: "",
  },
  {
    id: "app-5",
    showId: "show-moonlight",
    roleIds: ["r3"],
    applicantId: "a4",
    applicantName: "정민재",
    submittedAt: "2026.07.11 20:30",
    applyStatus: "지원 완료",
    reviewStatus: "미확인",
    selectedCareerIds: ["c1", "c2"],
    selectedPhotoIds: ["p1"],
    selectedVideoIds: ["v1", "v2"],
    answers: {
      q1: "군무 리드 경험을 살리고 싶습니다.",
      q2: "댄스 캡틴 경험",
      q3: "가능",
      q4: "없음",
    },
    availability: "가능",
    memo: "",
    motivation: "",
  },
  createMockApplication({
    id: "app-restaurant-yujin",
    showId: "show-restaurant-christmas",
    roleIds: ["r2"],
    applicantId: "a5",
    applicantName: "한유진",
    submittedAt: "2026.07.27 10:35",
    motivation: "밝은 에너지 속에 진심이 숨어 있는 인물을 만들고 싶습니다.",
    answers: {
      q1: "여자 역의 솔직하고 시원한 에너지가 제 장점과 잘 맞습니다.",
      q2: "가능",
      q3: "소극장 장기 공연에서 관객 참여 장면을 진행한 경험이 있습니다.",
    },
  }),
  createMockApplication({
    id: "app-restaurant-dohyun",
    showId: "show-restaurant-christmas",
    roleIds: ["r1", "r3"],
    applicantId: "a6",
    applicantName: "최도현",
    submittedAt: "2026.07.28 16:10",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-1",
    stageResult: "진행 중",
    motivation: "생활 연기와 빠른 캐릭터 전환 경험을 모두 보여드리고 싶습니다.",
    answers: {
      q1: "남자 역을 우선 지원하며 멀티 역도 함께 검토받고 싶습니다.",
      q2: "가능",
      q3: "즉흥극 워크숍과 관객 참여 공연 경험이 있습니다.",
    },
    shortlisted: true,
    rating: 4,
  }),
  createMockApplication({
    id: "app-company-jiwon",
    showId: "show-company-connect-ensemble",
    roleIds: ["r1"],
    applicantId: "a7",
    applicantName: "서지원",
    submittedAt: "2026.07.03 13:48",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-1",
    stageResult: "합격",
    motivation: "한 작품을 넘어 지속적으로 훈련하고 창작하는 동료가 되고 싶습니다.",
    answers: {
      q1: "공동창작 경험을 바탕으로 장기적인 단원 활동에 참여하고 싶습니다.",
    },
    shortlisted: true,
    rating: 5,
  }),
  createMockApplication({
    id: "app-company-minseok",
    showId: "show-company-connect-ensemble",
    roleIds: ["r1"],
    applicantId: "a8",
    applicantName: "강민석",
    submittedAt: "2026.07.04 19:22",
    reviewStatus: "보류",
    stageResult: "보류",
    motivation: "배우와 제작진의 경계를 나누지 않는 창작 공동체를 찾고 있습니다.",
    answers: {
      q1: "조연출 경험을 살려 작품 제작과 극장 운영에도 책임감 있게 참여하겠습니다.",
    },
    memo: "조연출 경험 추가 확인",
    rating: 4,
  }),
  createMockApplication({
    id: "app-moonlight-ensemble-ara",
    showId: "show-moonlight-ensemble",
    roleIds: ["r4"],
    applicantId: "a9",
    applicantName: "윤아라",
    submittedAt: "2026.07.26 15:05",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-1",
    stageResult: "진행 중",
    motivation: "선명한 춤선과 코러스 밸런스로 달빛의 장면을 채우고 싶습니다.",
    answers: {
      q1: "댄스 앙상블과 센터 경험이 있으며 재즈 안무에 강점이 있습니다.",
    },
    shortlisted: true,
    rating: 4,
  }),
  createMockApplication({
    id: "app-cityrain-taeyang",
    showId: "show-cityrain",
    roleIds: ["r1"],
    applicantId: "a10",
    applicantName: "임태양",
    submittedAt: "2026.07.28 09:42",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-2",
    stageResult: "합격",
    motivation: "재즈 보컬 경험을 지호의 서사와 연결하고 싶습니다.",
    answers: {
      q1: "라이브 재즈 공연과 재즈 보컬 기반 창작 뮤지컬에 참여했습니다.",
      q2: "가능",
    },
    shortlisted: true,
    rating: 5,
  }),
  createMockApplication({
    id: "app-summerplay-sua",
    showId: "show-summerplay",
    roleIds: ["r1"],
    applicantId: "a11",
    applicantName: "오수아",
    submittedAt: "2026.07.28 17:18",
    motivation: "떠나는 사람의 마음을 설명보다 침묵과 호흡으로 보여주고 싶습니다.",
    answers: {
      q1: "2인극에서 상대 배우의 호흡으로 감정을 쌓는 작업을 다시 하고 싶습니다.",
    },
  }),
  createMockApplication({
    id: "app-summerplay-hyunwoo",
    showId: "show-summerplay",
    roleIds: ["r2"],
    applicantId: "a12",
    applicantName: "배현우",
    submittedAt: "2026.07.28 18:37",
    reviewStatus: "오디션 대상",
    currentStageId: "audition-1",
    stageResult: "진행 중",
    motivation: "남겨진 사람의 복합적인 감정을 담백하게 표현하고 싶습니다.",
    answers: {
      q1: "소극장 2인극 경험을 살려 밀도 높은 호흡을 만들겠습니다.",
    },
    rating: 4,
  }),
  createMockApplication({
    id: "app-nightfall-eunseo",
    showId: "show-nightfall",
    roleIds: ["r2"],
    applicantId: "a13",
    applicantName: "채은서",
    submittedAt: "2026.06.20 12:15",
    reviewStatus: "합격",
    currentStageId: "final",
    stageResult: "합격",
    motivation: "신비로운 분위기 속에서도 이브의 단단한 선택을 선명하게 보여주고 싶습니다.",
    memo: "최종 캐스팅 1순위",
    shortlisted: true,
    rating: 5,
  }),
];

type Store = {
  currentAccountId: string | null;
  applicant: Applicant;
  otherApplicants: Applicant[];
  shows: Show[];
  applications: Application[];
  favoriteShowIds: string[];
  notificationShowIds: string[];
  manualSchedules: ManualSchedule[];
  bundledShowIdsSeen: string[];
  bundledShowRevisions: Record<string, number>;

  login: (username: string, password: string) => TempAccount | null;
  logout: () => void;
  addPhoto: (file: File, type?: Photo["type"]) => Promise<void>;
  addVideo: (file: File, type?: Video["type"]) => Promise<void>;
  addDoc: (file: File, type?: Doc["type"]) => Promise<void>;
  removePhoto: (id: string) => void;
  removeVideo: (id: string) => void;
  removeDoc: (id: string) => void;
  addCareer: (career: Omit<Career, "id">) => void;
  updateApplicant: (patch: Partial<Applicant>) => void;
  saveShow: (show: Omit<Show, "id" | "updatedAt"> & { id?: string }) => string;
  removeShow: (id: string) => void;
  bumpShow: (id: string) => void;
  sendShowResults: (showId: string) => void;
  updateStageProgress: (appIds: string[], stageId: string, result: StageResult) => void;

  submitApplication: (
    app: Omit<
      Application,
      | "id"
      | "submittedAt"
      | "applyStatus"
      | "reviewStatus"
      | "applicantId"
      | "applicantName"
      | "currentStageId"
      | "stageResult"
      | "stageHistory"
    >,
  ) => string;
  updateReview: (appId: string, patch: Partial<Pick<Application, "reviewStatus" | "memo">>) => void;
  updateReviews: (
    appIds: string[],
    patch: Partial<Pick<Application, "reviewStatus" | "memo" | "shortlisted" | "rating">>,
  ) => void;
  toggleShortlist: (appId: string) => void;
  setRating: (appId: string, rating: number) => void;
  toggleFavoriteShow: (showId: string) => void;
  toggleShowNotification: (showId: string) => void;
  addManualSchedule: (schedule: Omit<ManualSchedule, "id">) => void;
  removeManualSchedule: (id: string) => void;

  getApplicantById: (id: string) => Applicant | undefined;
};

const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const todayLabel = () =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\s/g, "");

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const indexedDbStorage: StateStorage = {
  getItem: async (name) => {
    if (typeof indexedDB === "undefined") return null;
    return runIndexedDbRequest("readonly", (store) => store.get(name));
  },
  setItem: async (name, value) => {
    if (typeof indexedDB === "undefined") return;
    await runIndexedDbRequest("readwrite", (store) => store.put(value, name));
  },
  removeItem: async (name) => {
    if (typeof indexedDB === "undefined") return;
    await runIndexedDbRequest("readwrite", (store) => store.delete(name));
  },
};

function runIndexedDbRequest<T>(
  mode: IDBTransactionMode,
  requestFactory: (store: IDBObjectStore) => IDBRequest<T>,
) {
  return new Promise<T>((resolve, reject) => {
    const openRequest = indexedDB.open("yesulin-workspace", 1);
    openRequest.onupgradeneeded = () => {
      if (!openRequest.result.objectStoreNames.contains("state")) {
        openRequest.result.createObjectStore("state");
      }
    };
    openRequest.onerror = () => reject(openRequest.error);
    openRequest.onsuccess = () => {
      const transaction = openRequest.result.transaction("state", mode);
      const request = requestFactory(transaction.objectStore("state"));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => openRequest.result.close();
    };
  });
}

export function applyStatusForReview(status: ReviewStatus): ApplyStatus {
  if (status === "미확인") return "지원 완료";
  if (status === "검토 중" || status === "보류") return "서류 확인";
  if (status === "오디션 대상") return "오디션 예정";
  return status;
}

export function getAuditionStages(show: Show): AuditionStage[] {
  if (show.auditionStages?.length) {
    return [...show.auditionStages].sort((a, b) => a.order - b.order);
  }

  return [
    {
      id: "document",
      name: "서류 심사",
      order: 1,
      type: "서류",
    },
    {
      id: "audition-1",
      name: "1차 오디션",
      order: 2,
      type: "오디션",
      date: show.auditionDate,
      venue: show.venue,
    },
    {
      id: "audition-2",
      name: "2차 오디션",
      order: 3,
      type: "오디션",
      venue: show.venue,
    },
    {
      id: "final",
      name: "최종 결과",
      order: 4,
      type: "최종",
      resultAnnouncementDate: show.resultAnnouncementDate,
    },
  ];
}

export function getApplicationStageProgress(application: Application, show: Show) {
  const stages = getAuditionStages(show);
  const savedStage = stages.find((stage) => stage.id === application.currentStageId);
  if (savedStage && application.stageResult) {
    return { stage: savedStage, result: application.stageResult };
  }

  if (application.reviewStatus === "합격" || application.reviewStatus === "불합격") {
    return {
      stage: stages.at(-1) ?? stages[0],
      result: application.reviewStatus as StageResult,
    };
  }
  if (application.reviewStatus === "오디션 대상") {
    return {
      stage: stages.find((stage) => stage.type === "오디션") ?? stages[0],
      result: "진행 중" as StageResult,
    };
  }
  if (application.reviewStatus === "보류") {
    return { stage: stages[0], result: "보류" as StageResult };
  }
  if (application.reviewStatus === "검토 중") {
    return { stage: stages[0], result: "진행 중" as StageResult };
  }
  return { stage: stages[0], result: "검토 대기" as StageResult };
}

function reviewStatusForStage(
  stage: AuditionStage,
  result: StageResult,
  stages: AuditionStage[],
): ReviewStatus {
  if (result === "불합격" || result === "불참") return "불합격";
  if (result === "보류") return "보류";
  if (stage.type === "최종" && result === "합격") return "합격";
  if (stage.type === "서류") return result === "검토 대기" ? "미확인" : "검토 중";
  if (stage.id === stages.at(-1)?.id && result === "검토 대기") return "검토 중";
  return "오디션 대상";
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentAccountId: null,
      applicant: meApplicant,
      otherApplicants: allMockApplicants.filter((applicant) => applicant.id !== "me"),
      shows,
      applications: initialApplications,
      favoriteShowIds: [],
      notificationShowIds: [],
      manualSchedules: [],
      bundledShowIdsSeen: [...bundledShowIdsAddedAfterWorkspaceV5],
      bundledShowRevisions: currentBundledShowRevisions,

      login: (username, password) => {
        const normalizedUsername = username.trim().toLowerCase();
        const account = TEMP_ACCOUNTS.find(
          (item) => item.username === normalizedUsername && item.password === password,
        );
        if (!account) return null;

        if (account.role === "applicant" && account.applicantId) {
          const applicant = allMockApplicants.find((item) => item.id === account.applicantId);
          if (applicant) {
            set({
              currentAccountId: account.id,
              applicant: {
                ...applicant,
                careers: [...applicant.careers],
                photos: [...applicant.photos],
                videos: [...applicant.videos],
                docs: [...applicant.docs],
              },
            });
            return account;
          }
        }

        set({ currentAccountId: account.id });
        return account;
      },

      logout: () => set({ currentAccountId: null }),

      addPhoto: async (file, type = "정면 프로필") => {
        const image = await fileToDataUrl(file);
        const newPhoto: Photo = {
          id: newId("photo"),
          fileName: file.name,
          image,
          type,
          createdAt: todayLabel(),
          color: "#171717",
        };
        set((state) => ({
          applicant: {
            ...state.applicant,
            photos: [...state.applicant.photos, newPhoto],
          },
        }));
      },

      addVideo: async (file, type = "연기 자유 영상") => {
        const url = await fileToDataUrl(file);
        const newVideo: Video = {
          id: newId("video"),
          title: file.name.replace(/\.[^.]+$/, ""),
          fileName: file.name,
          url,
          type,
          duration: "업로드 영상",
          createdAt: todayLabel(),
          color: "#171717",
        };
        set((state) => ({
          applicant: {
            ...state.applicant,
            videos: [...state.applicant.videos, newVideo],
          },
        }));
      },

      addDoc: async (file, type = "기타 제출 문서") => {
        const url = await fileToDataUrl(file);
        const newDoc: Doc = {
          id: newId("doc"),
          fileName: file.name,
          url,
          type,
          createdAt: todayLabel(),
        };
        set((state) => ({
          applicant: {
            ...state.applicant,
            docs: [...state.applicant.docs, newDoc],
          },
        }));
      },

      removePhoto: (id) =>
        set((state) => ({
          applicant: {
            ...state.applicant,
            photos: state.applicant.photos.filter((photo) => photo.id !== id),
          },
        })),
      removeVideo: (id) =>
        set((state) => ({
          applicant: {
            ...state.applicant,
            videos: state.applicant.videos.filter((video) => video.id !== id),
          },
        })),
      removeDoc: (id) =>
        set((state) => ({
          applicant: {
            ...state.applicant,
            docs: state.applicant.docs.filter((doc) => doc.id !== id),
          },
        })),

      addCareer: (career) =>
        set((state) => ({
          applicant: {
            ...state.applicant,
            careers: [...state.applicant.careers, { ...career, id: newId("career") }],
          },
        })),

      updateApplicant: (patch) => set((state) => ({ applicant: { ...state.applicant, ...patch } })),

      saveShow: (show) => {
        const id = show.id ?? newId("show");
        const savedBase: Show = {
          ...show,
          id,
          updatedAt: new Date().toISOString(),
        };
        const saved: Show = {
          ...savedBase,
          auditionStages: show.auditionStages?.length
            ? show.auditionStages
            : getAuditionStages(savedBase),
        };
        set((state) => ({
          shows: state.shows.some((item) => item.id === id)
            ? state.shows.map((item) => (item.id === id ? saved : item))
            : [saved, ...state.shows],
        }));
        return id;
      },

      removeShow: (id) =>
        set((state) => ({
          shows: state.shows.filter((show) => show.id !== id),
          applications: state.applications.filter((application) => application.showId !== id),
          favoriteShowIds: state.favoriteShowIds.filter((showId) => showId !== id),
          notificationShowIds: state.notificationShowIds.filter((showId) => showId !== id),
        })),

      bumpShow: (id) =>
        set((state) => {
          const bumpedAt = new Date().toISOString();
          return {
            shows: state.shows.map((show) =>
              show.id === id ? { ...show, bumpedAt, updatedAt: bumpedAt } : show,
            ),
          };
        }),

      sendShowResults: (showId) =>
        set((state) => {
          const sentAt = new Date().toISOString();
          return {
            shows: state.shows.map((show) =>
              show.id === showId ? { ...show, resultsSentAt: sentAt } : show,
            ),
            applications: state.applications.map((application) =>
              application.showId === showId &&
              (application.reviewStatus === "합격" || application.reviewStatus === "불합격")
                ? {
                    ...application,
                    applyStatus: application.reviewStatus,
                    resultNotifiedAt: sentAt,
                  }
                : application,
            ),
          };
        }),

      updateStageProgress: (appIds, stageId, result) =>
        set((state) => {
          const changedAt = new Date().toISOString();
          return {
            applications: state.applications.map((application) => {
              if (!appIds.includes(application.id)) return application;
              const show = state.shows.find((item) => item.id === application.showId);
              if (!show) return application;
              const stages = getAuditionStages(show);
              const stage = stages.find((item) => item.id === stageId);
              if (!stage) return application;

              const previous = getApplicationStageProgress(application, show);
              if (previous.stage.id === stage.id && previous.result === result) return application;

              const reviewStatus = reviewStatusForStage(stage, result, stages);
              const historyEntry: StageHistoryEntry = {
                id: newId("stage-history"),
                stageId: stage.id,
                stageName: stage.name,
                result,
                changedAt,
              };

              return {
                ...application,
                currentStageId: stage.id,
                stageResult: result,
                stageHistory: [...(application.stageHistory ?? []), historyEntry],
                reviewStatus,
                applyStatus:
                  stage.type === "서류"
                    ? result === "검토 대기"
                      ? "지원 완료"
                      : "서류 확인"
                    : application.resultNotifiedAt &&
                        (reviewStatus === "합격" || reviewStatus === "불합격")
                      ? reviewStatus
                      : "오디션 예정",
              };
            }),
          };
        }),

      submitApplication: (application) => {
        const id = newId("application");
        const targetShow = get().shows.find((show) => show.id === application.showId);
        const firstStageId = targetShow ? getAuditionStages(targetShow)[0]?.id : "document";
        const submittedAt = new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
          .format(new Date())
          .replace(/\s/g, " ");
        const full: Application = {
          ...application,
          id,
          submittedAt,
          applyStatus: "지원 완료",
          reviewStatus: "미확인",
          applicantId: get().applicant.id,
          applicantName: get().applicant.name,
          shortlisted: false,
          rating: 0,
          currentStageId: firstStageId ?? "document",
          stageResult: "검토 대기",
          stageHistory: [],
        };
        set((state) => ({ applications: [full, ...state.applications] }));
        return id;
      },

      updateReview: (appId, patch) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === appId
              ? {
                  ...application,
                  ...patch,
                  applyStatus:
                    patch.reviewStatus &&
                    (!(patch.reviewStatus === "합격" || patch.reviewStatus === "불합격") ||
                      application.resultNotifiedAt)
                      ? applyStatusForReview(patch.reviewStatus)
                      : application.applyStatus,
                }
              : application,
          ),
        })),

      updateReviews: (appIds, patch) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            appIds.includes(application.id)
              ? {
                  ...application,
                  ...patch,
                  applyStatus:
                    patch.reviewStatus &&
                    (!(patch.reviewStatus === "합격" || patch.reviewStatus === "불합격") ||
                      application.resultNotifiedAt)
                      ? applyStatusForReview(patch.reviewStatus)
                      : application.applyStatus,
                }
              : application,
          ),
        })),

      toggleShortlist: (appId) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === appId
              ? { ...application, shortlisted: !application.shortlisted }
              : application,
          ),
        })),

      setRating: (appId, rating) =>
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === appId
              ? { ...application, rating: Math.max(0, Math.min(5, rating)) }
              : application,
          ),
        })),

      toggleFavoriteShow: (showId) =>
        set((state) => ({
          favoriteShowIds: state.favoriteShowIds.includes(showId)
            ? state.favoriteShowIds.filter((id) => id !== showId)
            : [...state.favoriteShowIds, showId],
        })),

      toggleShowNotification: (showId) =>
        set((state) => ({
          notificationShowIds: state.notificationShowIds.includes(showId)
            ? state.notificationShowIds.filter((id) => id !== showId)
            : [...state.notificationShowIds, showId],
        })),

      addManualSchedule: (schedule) =>
        set((state) => ({
          manualSchedules: [
            ...state.manualSchedules,
            {
              ...schedule,
              id: newId("schedule"),
            },
          ],
        })),

      removeManualSchedule: (id) =>
        set((state) => ({
          manualSchedules: state.manualSchedules.filter((schedule) => schedule.id !== id),
        })),

      getApplicantById: (id) => {
        if (id === get().applicant.id) return get().applicant;
        return allMockApplicants.find((applicant) => applicant.id === id);
      },
    }),
    {
      name: "yesulin-workspace-v5",
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        currentAccountId: state.currentAccountId,
        applicant: state.applicant,
        shows: state.shows,
        applications: state.applications,
        favoriteShowIds: state.favoriteShowIds,
        notificationShowIds: state.notificationShowIds,
        manualSchedules: state.manualSchedules,
        bundledShowIdsSeen: state.bundledShowIdsSeen,
        bundledShowRevisions: state.bundledShowRevisions,
      }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<Store>;
        const savedApplicant = saved.applicant;
        const savedShows = saved.shows ?? currentState.shows;
        const savedShowIds = new Set(savedShows.map((show) => show.id));
        const bundledShowIdsSeen = new Set(saved.bundledShowIdsSeen ?? []);
        const showsToMerge = [
          ...savedShows,
          ...currentState.shows.filter(
            (show) =>
              bundledShowIdsAddedAfterWorkspaceV5.has(show.id) &&
              !bundledShowIdsSeen.has(show.id) &&
              !savedShowIds.has(show.id),
          ),
        ];
        const mergedShows = showsToMerge.map((show) => {
          const bundledShow = currentState.shows.find((item) => item.id === show.id);
          const mergedShow: Show = {
            ...bundledShow,
            ...show,
            producer: show.producer === "라이트스테이지" ? "컴퍼니연결" : show.producer,
            performanceId:
              show.performanceId ?? bundledShow?.performanceId ?? `performance:${show.title}`,
            postingTitle: show.postingTitle ?? bundledShow?.postingTitle ?? "배우 모집 공고",
            recruitmentRound: show.recruitmentRound ?? bundledShow?.recruitmentRound ?? 1,
            resultAnnouncementDate:
              show.resultAnnouncementDate ?? bundledShow?.resultAnnouncementDate,
          };
          const migration = bundledShowMigrations[show.id];
          const shouldApplyMigration =
            migration &&
            bundledShow &&
            (saved.bundledShowRevisions?.[show.id] ?? 0) < migration.revision;
          const migratedShow: Show = shouldApplyMigration
            ? {
                ...mergedShow,
                ...(Object.fromEntries(
                  migration.fields.map((field) => [field, bundledShow[field]]),
                ) as Partial<Show>),
              }
            : mergedShow;
          return {
            ...migratedShow,
            auditionStages:
              migratedShow.auditionStages ??
              bundledShow?.auditionStages ??
              getAuditionStages(migratedShow),
          };
        });
        const applicationById = new Map(
          currentState.applications.map((application) => [application.id, application]),
        );
        saved.applications?.forEach((application) => {
          applicationById.set(application.id, {
            ...applicationById.get(application.id),
            ...application,
          });
        });
        const mergedApplications = Array.from(applicationById.values()).map((application) => {
          const show = mergedShows.find((item) => item.id === application.showId);
          if (!show) return application;
          const progress = getApplicationStageProgress(application, show);
          return {
            ...application,
            currentStageId: progress.stage.id,
            stageResult: progress.result,
            stageHistory: application.stageHistory ?? [],
            applyStatus:
              (application.reviewStatus === "합격" || application.reviewStatus === "불합격") &&
              !application.resultNotifiedAt
                ? "오디션 예정"
                : application.applyStatus,
          };
        });
        const photos = (savedApplicant?.photos ?? currentState.applicant.photos).map((photo) => {
          const bundledPhoto = currentState.applicant.photos.find((item) => item.id === photo.id);
          return {
            ...photo,
            image: photo.image ?? bundledPhoto?.image,
          };
        });
        const videos = (savedApplicant?.videos ?? currentState.applicant.videos).map((video) => {
          const bundledVideo = currentState.applicant.videos.find((item) => item.id === video.id);
          return {
            ...video,
            url: video.url ?? bundledVideo?.url,
          };
        });

        return {
          ...currentState,
          ...saved,
          shows: mergedShows,
          applications: mergedApplications,
          favoriteShowIds: saved.favoriteShowIds ?? [],
          notificationShowIds: saved.notificationShowIds ?? [],
          manualSchedules: saved.manualSchedules ?? [],
          bundledShowIdsSeen: Array.from(
            new Set([...(saved.bundledShowIdsSeen ?? []), ...currentState.bundledShowIdsSeen]),
          ),
          bundledShowRevisions: {
            ...(saved.bundledShowRevisions ?? {}),
            ...currentState.bundledShowRevisions,
          },
          applicant: {
            ...currentState.applicant,
            ...savedApplicant,
            photos,
            videos,
          },
        };
      },
    },
  ),
);

export function useProducerWorkspace() {
  const currentAccountId = useStore((state) => state.currentAccountId);
  const allShows = useStore((state) => state.shows);
  const allApplications = useStore((state) => state.applications);
  const shows = allShows.filter((show) => isShowOwnedByAccount(show, currentAccountId));
  const showIds = new Set(shows.map((show) => show.id));
  const applications = allApplications.filter((application) => showIds.has(application.showId));
  return { account: getAuthAccount(currentAccountId), shows, applications };
}

// helpers
export const findShow = (id: string) => useStore.getState().shows.find((s) => s.id === id);
export const findRole = (show: Show | undefined, id: string) =>
  show?.roles.find((r) => r.id === id);
export const getPerformanceId = (show: Show) => show.performanceId ?? `performance:${show.title}`;
export const getPostingTitle = (show: Show) =>
  show.postingTitle ?? `${show.recruitmentRound ?? 1}차 배우 모집`;
export const isFinalReviewStatus = (status: ReviewStatus) =>
  status === "합격" || status === "불합격";
export function getShowActivityTimestamp(show: Show) {
  const activityDate = show.bumpedAt ?? show.updatedAt;
  if (activityDate) {
    const timestamp = Date.parse(activityDate);
    if (Number.isFinite(timestamp)) return timestamp;
  }

  const match = show.deadline.match(/(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (!match) return 0;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])).getTime();
}

export function daysUntil(dateStr: string): number {
  const match = dateStr.match(/(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (!match) return 0;
  const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
