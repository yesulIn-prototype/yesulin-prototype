import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  FileStack,
  FolderOpen,
  Search,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BrandWordmark } from "@/components/brand-wordmark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "지원 준비는 한 번, 무대의 기회는 계속 · 예술IN" },
      {
        name: "description",
        content: "지원자와 공연사를 하나의 흐름으로 연결하는 공연 오디션 워크스페이스",
      },
    ],
  }),
  component: LandingPage,
});

const benefits = [
  {
    icon: FolderOpen,
    title: "프로필과 자료를 한 번만",
    description: "사진·영상·이력서를 보관하고 여러 공고에 필요한 자료만 골라 제출합니다.",
  },
  {
    icon: CalendarCheck2,
    title: "마감부터 결과까지 한눈에",
    description: "지원 마감, 오디션 일정과 단계별 결과를 하나의 흐름으로 확인합니다.",
  },
  {
    icon: Users,
    title: "지원자를 같은 기준으로",
    description: "공연사는 흩어진 지원 자료를 모아 단계별로 검토하고 결과를 관리합니다.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="landing-header sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-none">
              <BrandWordmark />
              <div className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Audition workspace
              </div>
            </div>
          </Link>
          <Link
            to="/login"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
          >
            로그인
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate mx-auto grid max-w-7xl overflow-hidden px-5 py-12 md:grid-cols-[1.08fr_0.92fr] md:items-center md:gap-8 md:px-8 md:py-20 lg:gap-12">
          <div className="landing-orb pointer-events-none absolute -left-28 top-12 -z-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="landing-orb landing-orb-secondary pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-information/10 blur-3xl" />

          <div className="relative z-10">
            <div className="landing-enter inline-flex items-center gap-2 rounded-full border border-gold/70 bg-gold/90 px-3 py-1.5 text-[11px] font-semibold text-gold-foreground shadow-sm">
              공연 오디션 통합 워크스페이스
            </div>
            <h1 className="landing-enter landing-delay-1 mt-6 font-display text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.98] tracking-[-0.06em] md:text-[clamp(3.25rem,6vw,5rem)]">
              지원 준비는 한 번,
              <br />
              무대의 기회는 계속.
            </h1>
            <p className="landing-enter landing-delay-2 mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              지원자는 반복되는 자료 준비를 줄이고, 공연사는 지원자 검토부터 오디션 결과까지 한
              곳에서 관리합니다.
            </p>
            <div className="landing-enter landing-delay-3 mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elev-2)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev-3)]"
              >
                워크스페이스 시작하기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-12 items-center rounded-full border border-border-strong bg-background/80 px-6 text-sm font-semibold backdrop-blur transition hover:bg-secondary"
              >
                주요 기능 보기
              </a>
            </div>
            <div className="landing-enter landing-delay-4 mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {["프로필 재사용", "지원 일정 통합", "단계별 심사 관리"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <figure className="landing-visual relative mt-10 overflow-hidden rounded-[2rem] bg-primary shadow-[var(--shadow-elev-3)] md:mt-0">
            <img
              src="/images/editorial/home-hero.jpg"
              alt="공연을 준비하는 배우"
              className="landing-hero-image aspect-[5/4] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
            <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[10px] font-semibold text-white/85 shadow-lg backdrop-blur-md md:left-6 md:top-6">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_12px_rgba(247,255,84,0.9)]" />
              ONE PROFILE · EVERY STAGE
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <div className="text-lg font-semibold md:text-xl">
                준비의 반복을 줄이고, 무대에 집중하세요.
              </div>
              <div className="mt-3 h-px w-16 bg-gold" />
            </figcaption>
          </figure>
        </section>

        <section id="features" className="border-y border-border bg-surface">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Why YesulIN
              </div>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] md:text-5xl">
                지원과 캐스팅의 흐름을
                <br />더 짧고 명확하게
              </h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-elev-2)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <WorkspaceCard
            eyebrow="For applicants"
            title="지원자가 기회를 놓치지 않을 수 있도록"
            description="공고 탐색, 자료 선택, 지원 현황과 다음 일정을 개인 워크스페이스에서 이어갑니다."
            items={["공고 검색과 마감 알림", "사진·영상 자료 보관", "지원 상태와 오디션 일정"]}
            icon={Search}
          />
          <WorkspaceCard
            eyebrow="For producers"
            title="공연사가 결정에 집중할 수 있도록"
            description="공연별 공고와 지원자를 분리하고 서류부터 최종 결과까지 단계적으로 관리합니다."
            items={["공연별 다회차 공고 관리", "지원자 비교와 숏리스트", "단계별 결과 저장·발송"]}
            icon={FileStack}
          />
        </section>

        <section className="border-t border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h2 className="font-display text-3xl tracking-[-0.04em]">
                준비된 계정으로 둘러보세요.
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/65">
                지원자와 공연사 테스트 계정을 로그인 화면에서 바로 선택할 수 있습니다.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-background px-6 text-sm font-semibold text-foreground"
            >
              로그인 화면으로
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function WorkspaceCard({
  eyebrow,
  title,
  description,
  items,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  icon: typeof Search;
}) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-card p-6 md:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </div>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{title}</h3>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
      <ul className="mt-6 grid gap-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
