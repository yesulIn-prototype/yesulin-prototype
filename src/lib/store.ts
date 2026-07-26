import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type ReviewStatus = "미확인" | "검토 중" | "오디션 대상" | "보류" | "합격" | "불합격";
export type ApplyStatus = "작성 중" | "지원 완료" | "서류 확인" | "오디션 예정" | "합격" | "불합격";
export type ScheduleKind = "지원 마감" | "오디션" | "연습" | "공연";
export type PublicationStatus = "임시 저장" | "게시됨";

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

export type Show = {
  id: string;
  title: string;
  producer: string;
  posterColor: string;
  posterImage: string;
  posterPosition?: "center" | "top";
  kind: string;
  description: string;
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
};

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
];

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
    id: "show-restaurant-christmas",
    title: "연극 식당: 매일이 크리스마스",
    producer: "컴퍼니 연결 × 남극장",
    posterColor: "#2c0907",
    posterImage: "/images/editorial/company-connect-restaurant.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "세상의 모든 숫자가 사라진 날, 자신의 식당을 매일 크리스마스로 꾸미는 남자와 크리스마스에 운명을 만날 것이라 믿는 여자가 서로의 하루가 되어가는 로맨틱 코미디입니다. 컴퍼니 연결과 남극장이 함께 제작하며 관객과의 직접적인 소통과 인터랙션이 포함됩니다.",
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
  },
  {
    id: "show-company-connect-ensemble",
    title: "2026 컴퍼니 연결 배우단원 모집",
    producer: "컴퍼니 연결 × 남극장",
    posterColor: "#173a69",
    posterImage: "/images/editorial/company-connect-ensemble.jpg",
    posterPosition: "top",
    kind: "연극",
    description:
      "2017년 창단한 컴퍼니 연결은 남극장을 기반으로 지속적인 훈련과 창작을 함께할 배우단원을 모집했습니다. 단원은 정기 활동과 기획·제작 프로덕션, 공연장 및 공동체 운영에 참여하며 장기적으로 성장하는 창작 공동체를 지향합니다.",
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
    deadline: "2026.07.05 18:00",
    auditionDate: "2026.07.07 – 2026.07.08, 13:00–18:00",
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
    status: "모집 마감",
  },
  {
    id: "show-moonlight",
    title: "뮤지컬 달빛",
    producer: "라이트스테이지",
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
  },
  {
    id: "show-cityrain",
    title: "뮤지컬 시티레인",
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
  },
  {
    id: "show-summerplay",
    title: "연극 여름의 끝",
    producer: "시선극단",
    posterColor: "#171717",
    posterImage: "/images/editorial/poster-summerplay.jpg",
    kind: "연극",
    description: "여름의 끝자락, 헤어지는 두 사람의 마지막 하루를 그린 2인극.",
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
    deadline: "2026.07.30",
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
    status: "모집 중",
  },
  {
    id: "show-nightfall",
    title: "뮤지컬 나이트폴",
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
  },
];

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
    applyStatus: "합격",
    reviewStatus: "합격",
    selectedCareerIds: ["c1"],
    selectedPhotoIds: ["p1", "p2"],
    selectedVideoIds: ["v1", "v3"],
    answers: {},
    availability: "가능",
    memo: "안무 소화력 좋음",
    motivation: "",
  },
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
];

type Store = {
  applicant: Applicant;
  otherApplicants: Applicant[];
  shows: Show[];
  applications: Application[];
  favoriteShowIds: string[];
  manualSchedules: ManualSchedule[];

  addPhoto: (file: File, type?: Photo["type"]) => Promise<void>;
  addVideo: (file: File, type?: Video["type"]) => Promise<void>;
  addDoc: (file: File, type?: Doc["type"]) => Promise<void>;
  removePhoto: (id: string) => void;
  removeVideo: (id: string) => void;
  removeDoc: (id: string) => void;
  addCareer: (career: Omit<Career, "id">) => void;
  updateApplicant: (patch: Partial<Applicant>) => void;
  saveShow: (show: Omit<Show, "id" | "updatedAt"> & { id?: string }) => string;

  submitApplication: (
    app: Omit<
      Application,
      "id" | "submittedAt" | "applyStatus" | "reviewStatus" | "applicantId" | "applicantName"
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

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      applicant: meApplicant,
      otherApplicants,
      shows,
      applications: initialApplications,
      favoriteShowIds: [],
      manualSchedules: [],

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
        const saved: Show = {
          ...show,
          id,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          shows: state.shows.some((item) => item.id === id)
            ? state.shows.map((item) => (item.id === id ? saved : item))
            : [saved, ...state.shows],
        }));
        return id;
      },

      submitApplication: (application) => {
        const id = newId("application");
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
          applicantId: "me",
          applicantName: get().applicant.name,
          shortlisted: false,
          rating: 0,
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
                  applyStatus: patch.reviewStatus
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
                  applyStatus: patch.reviewStatus
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
        if (id === "me") return get().applicant;
        return get().otherApplicants.find((applicant) => applicant.id === id);
      },
    }),
    {
      name: "yesulin-workspace-v5",
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({
        applicant: state.applicant,
        shows: state.shows,
        applications: state.applications,
        favoriteShowIds: state.favoriteShowIds,
        manualSchedules: state.manualSchedules,
      }),
      merge: (persistedState, currentState) => {
        const saved = persistedState as Partial<Store>;
        const savedApplicant = saved.applicant;
        const photos = (savedApplicant?.photos ?? currentState.applicant.photos).map((photo) => {
          const bundledPhoto = currentState.applicant.photos.find((item) => item.id === photo.id);
          return {
            ...photo,
            image: photo.image ?? bundledPhoto?.image,
          };
        });

        return {
          ...currentState,
          ...saved,
          favoriteShowIds: saved.favoriteShowIds ?? [],
          manualSchedules: saved.manualSchedules ?? [],
          applicant: {
            ...currentState.applicant,
            ...savedApplicant,
            photos,
          },
        };
      },
    },
  ),
);

// helpers
export const findShow = (id: string) => useStore.getState().shows.find((s) => s.id === id);
export const findRole = (show: Show | undefined, id: string) =>
  show?.roles.find((r) => r.id === id);

export function daysUntil(dateStr: string): number {
  const match = dateStr.match(/(\d{4})[.-](\d{1,2})[.-](\d{1,2})/);
  if (!match) return 0;
  const target = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
