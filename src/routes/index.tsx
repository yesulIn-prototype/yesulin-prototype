import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: RoleSelect,
});

function RoleSelect() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">공연 지원 플랫폼</span>
          </div>
          <span className="text-xs text-muted-foreground">MVP 프로토타입</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-foreground">
            핵심 가설 검증용 데모
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight lg:text-5xl">
            한 번 등록한 프로필과 자료로
            <br />
            <span className="text-primary">여러 공연에 반복 없이 지원합니다</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground lg:text-lg">
            지원자는 저장된 프로필·경력·사진·영상을 재사용해 지원서를 제출하고,
            공연사는 지원자의 자료를 동일한 구조의 한 화면에서 검토합니다.
            역할을 선택해 프로토타입을 체험해보세요.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <RoleCard
            to="/applicant"
            title="공연 지원자"
            subtitle="배우·공연예술 종사자"
            description="저장된 프로필과 파일을 재사용해 공연에 지원하고 지원 현황을 관리합니다."
            bullets={["프로필과 파일 한 번 등록", "공연별 지원서 재사용", "지원 현황과 일정 통합 관리"]}
            cta="지원자로 체험하기"
            variant="primary"
          />
          <RoleCard
            to="/producer"
            title="공연사 담당자"
            subtitle="제작사 · 캐스팅 담당"
            description="공연별로 접수된 지원자를 동일한 구조의 화면에서 빠르게 검토합니다."
            bullets={["공연별 지원자 분류", "프로필·사진·영상 한 화면", "검토 상태와 내부 메모"]}
            cta="공연사로 체험하기"
            variant="gold"
          />
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          실제 회원가입·로그인·파일 업로드·이메일 발송은 구현되지 않은 프로토타입입니다.
        </p>
      </main>
    </div>
  );
}

function RoleCard({
  to,
  title,
  subtitle,
  description,
  bullets,
  cta,
  variant,
}: {
  to: string;
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
          variant === "primary" ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-6">
        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{subtitle}</div>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ul className="mt-6 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${variant === "primary" ? "bg-primary" : "bg-gold"}`} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
        {cta}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
