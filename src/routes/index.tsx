import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "무대 위 다음 순서를 준비합니다 · 공연 지원 플랫폼" },
      {
        name: "description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토합니다.",
      },
      { property: "og:title", content: "무대 위 다음 순서를 준비합니다 · 공연 지원 플랫폼" },
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
      <header className="border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="text-sm font-semibold tracking-tight">공연 지원 플랫폼</span>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Audition Workspace
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold-foreground">
            <Sparkles className="h-3 w-3" />
            공연 오디션 통합 지원
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            무대 위 다음 순서를,
            <br />
            <span className="text-primary">단 한 번의 준비로.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            지원자는 저장된 프로필·경력·사진·영상을 재사용해 지원서를 제출하고, 공연사는 지원자의
            자료를 동일한 구조의 한 화면에서 검토합니다.
          </p>
          <div className="mt-6 h-px w-24 rule-accent" />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <RoleCard
            to="/applicant"
            eyebrow="For Performers"
            title="공연 지원자"
            subtitle="배우 · 공연예술 종사자"
            description="저장된 프로필과 파일을 재사용해 공연에 지원하고 지원 현황을 관리합니다."
            bullets={[
              "프로필과 파일 한 번 등록",
              "공연별 지원서 재사용",
              "지원 현황과 일정 통합 관리",
            ]}
            cta="지원자 화면 시작하기"
            variant="primary"
          />
          <RoleCard
            to="/producer"
            eyebrow="For Casting"
            title="공연사 담당자"
            subtitle="제작사 · 캐스팅 담당"
            description="공연별로 접수된 지원자를 동일한 구조의 화면에서 빠르게 검토합니다."
            bullets={["공연별 지원자 분류", "프로필·사진·영상 한 화면", "검토 상태와 내부 메모"]}
            cta="공연사 화면 시작하기"
            variant="gold"
          />
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          현재 미리보기에서는 회원가입·로그인·실제 파일 업로드·이메일 발송을 제공하지 않습니다.
        </p>
      </main>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(58,26,44,0.25)]">
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
  eyebrow,
  title,
  subtitle,
  description,
  bullets,
  cta,
  variant,
}: {
  to: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  cta: string;
  variant: "primary" | "gold";
}) {
  const Icon = variant === "primary" ? Users : Sparkles;
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elev-1)] transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elev-3)]"
    >
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
            variant === "primary"
              ? "bg-primary text-primary-foreground"
              : "bg-gold text-gold-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </span>
      </div>
      <div className="mt-8">
        <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          {subtitle}
        </div>
        <h2 className="mt-1.5 font-display text-3xl leading-tight text-foreground">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ul className="mt-6 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                variant === "primary" ? "bg-primary" : "bg-gold"
              }`}
            />
            <span className="text-foreground/85">{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-primary transition-all group-hover:gap-3">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
