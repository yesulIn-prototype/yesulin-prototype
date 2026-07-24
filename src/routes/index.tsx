import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CalendarCheck2, Check, Files, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "지원 준비는 한 번, 무대의 기회는 계속 · 공연 지원 플랫폼" },
      {
        name: "description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토합니다.",
      },
      {
        property: "og:title",
        content: "지원 준비는 한 번, 무대의 기회는 계속 · 공연 지원 플랫폼",
      },
      {
        property: "og:description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토합니다.",
      },
    ],
  }),
  component: RoleSelect,
});

function RoleSelect() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-none">
              <div className="text-sm font-semibold tracking-tight">공연 지원 플랫폼</div>
              <div className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Audition Workspace
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#workflow"
              className="hidden px-3 text-xs font-medium text-muted-foreground transition hover:text-foreground md:inline-flex"
            >
              이용 흐름
            </a>
            <Link
              to="/applicant"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:-translate-y-0.5"
            >
              화면 둘러보기
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:px-8 md:py-16 lg:grid-cols-[minmax(0,0.88fr)_minmax(500px,1.12fr)] lg:items-center lg:gap-16 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 text-[11px] font-semibold text-gold-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              공연 오디션 통합 워크스페이스
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.055em] text-foreground">
              지원 준비는 한 번,
              <br />
              무대의 기회는 계속.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              지원자는 프로필과 자료를 반복해서 준비하지 않고, 공연사는 흩어진 지원 정보를 동일한
              구조에서 빠르게 검토합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/applicant"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elev-2)]"
              >
                지원자로 시작
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/producer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-background px-6 py-3 text-sm font-semibold transition hover:border-foreground hover:bg-secondary"
              >
                공연사로 시작
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {["프로필 재사용", "지원 일정 통합", "표준화된 검토 화면"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-success" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <figure className="relative overflow-hidden rounded-[1.75rem] bg-primary shadow-[var(--shadow-elev-3)]">
            <img
              src="/images/editorial/home-hero.jpg"
              alt="어두운 공연장에서 홀로 연습하는 배우"
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover object-[75%_center] lg:aspect-[6/5] lg:object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white md:p-7">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                  One profile, every stage
                </div>
                <div className="mt-1 text-sm font-medium md:text-base">
                  준비의 반복을 줄이고, 무대에 집중하세요.
                </div>
              </div>
              <span className="h-3 w-3 shrink-0 rounded-full bg-gold shadow-[0_0_24px_rgba(247,255,84,0.8)]" />
            </figcaption>
          </figure>
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-7xl divide-y divide-border px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:px-8">
            <ValueStat
              value="1회"
              label="프로필·자료 등록"
              description="공고마다 반복 입력하지 않습니다."
            />
            <ValueStat
              value="한 화면"
              label="지원 현황·일정 관리"
              description="다음 행동을 놓치지 않습니다."
            />
            <ValueStat
              value="동일 구조"
              label="지원자 검토"
              description="비교와 판단에 집중합니다."
            />
          </div>
        </section>

        <section id="roles" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Choose your workspace
              </div>
              <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
                지금 필요한 화면으로
                <br />
                바로 시작하세요.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground md:text-right">
              역할에 따라 정보의 우선순위와 주요 행동을 다르게 구성했습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <RoleCard
              to="/applicant"
              number="01"
              eyebrow="For Performers"
              title="공연 지원자"
              subtitle="배우 · 공연예술 종사자"
              description="저장된 프로필과 파일을 재사용해 공연을 찾고, 지원서와 다음 일정을 한곳에서 관리합니다."
              bullets={[
                "프로필과 파일 한 번 등록",
                "공연별 지원서 빠른 제출",
                "지원 현황과 일정 통합 관리",
              ]}
              cta="지원자 워크스페이스"
              image="/images/editorial/role-applicant.jpg"
              icon={Users}
              accent="dark"
            />
            <RoleCard
              to="/producer"
              number="02"
              eyebrow="For Casting"
              title="공연사 담당자"
              subtitle="제작사 · 캐스팅 담당"
              description="공연별 지원자를 동일한 구조로 검토하고, 팀의 판단 상태와 내부 메모를 함께 관리합니다."
              bullets={[
                "공연별 지원자 자동 분류",
                "프로필·사진·영상 한 화면",
                "검토 상태와 내부 메모",
              ]}
              cta="공연사 워크스페이스"
              image="/images/editorial/role-producer.jpg"
              icon={Building2}
              accent="lime"
            />
          </div>
        </section>

        <section id="workflow" className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                  Simple workflow
                </div>
                <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">
                  준비보다
                  <br />
                  선택에 집중합니다.
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl bg-white/15 sm:grid-cols-3">
                <WorkflowStep
                  number="01"
                  icon={Files}
                  title="자료 준비"
                  description="프로필·경력·사진·영상을 한 번 등록합니다."
                />
                <WorkflowStep
                  number="02"
                  icon={CalendarCheck2}
                  title="공고 지원"
                  description="필요한 자료만 선택해 빠르게 제출합니다."
                />
                <WorkflowStep
                  number="03"
                  icon={Users}
                  title="검토·일정"
                  description="지원 상태와 다음 일정을 한 흐름으로 관리합니다."
                />
              </div>
            </div>
            <p className="mt-12 text-xs text-white/45">
              현재 프로토타입에서는 회원가입·실제 파일 업로드·이메일 발송을 제공하지 않습니다.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function ValueStat({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl">{value}</span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path d="M4 3v14c0 2.2 3.6 4 8 4s8-1.8 8-4V3" />
        <path d="M4 3c0 2.2 3.6 4 8 4s8-1.8 8-4" />
      </svg>
    </div>
  );
}

function RoleCard({
  to,
  number,
  eyebrow,
  title,
  subtitle,
  description,
  bullets,
  cta,
  image,
  icon: Icon,
  accent,
}: {
  to: "/applicant" | "/producer";
  number: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  cta: string;
  image: string;
  icon: React.ElementType;
  accent: "dark" | "lime";
}) {
  return (
    <Link
      to={to}
      className="group overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[var(--shadow-elev-1)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elev-3)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 text-foreground shadow backdrop-blur">
          <Icon className="h-5 w-5" />
        </div>
        <span className="absolute right-5 top-5 text-xs font-semibold tracking-[0.2em] text-white/80">
          {number}
        </span>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </span>
          <span className="text-[11px] text-muted-foreground">{subtitle}</span>
        </div>
        <h3 className="mt-3 font-display text-3xl">{title}</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-3">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2 text-xs leading-5 text-foreground/80"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  accent === "dark" ? "bg-primary" : "bg-gold"
                }`}
              />
              {bullet}
            </li>
          ))}
        </ul>
        <div
          className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all group-hover:gap-3 ${
            accent === "dark"
              ? "bg-primary text-primary-foreground"
              : "bg-gold text-gold-foreground"
          }`}
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

function WorkflowStep({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-primary p-6 sm:min-h-56 md:p-8">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-gold" />
        <span className="text-[10px] font-semibold tracking-[0.2em] text-white/40">{number}</span>
      </div>
      <h3 className="mt-12 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}
