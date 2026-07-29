import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Building2, LockKeyhole, UserRound } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { BrandWordmark } from "@/components/brand-wordmark";
import { getAuthAccount, TEMP_ACCOUNTS, useStore, type AccountRole } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "로그인 · 예술IN" },
      {
        name: "description",
        content: "지원자와 공연사를 위한 예술IN 임시 로그인",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const currentAccountId = useStore((state) => state.currentAccountId);
  const currentAccount = getAuthAccount(currentAccountId);
  const [role, setRole] = useState<AccountRole>("applicant");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const accounts = TEMP_ACCOUNTS.filter((account) => account.role === role);

  function submit(event: FormEvent) {
    event.preventDefault();
    const account = login(username, password);
    if (!account) {
      setError("아이디 또는 비밀번호를 확인해주세요.");
      return;
    }
    setError("");
    void navigate({ to: account.role === "producer" ? "/producer" : "/applicant" });
  }

  function chooseRole(nextRole: AccountRole) {
    setRole(nextRole);
    setUsername("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-6xl items-center px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-none">
              <BrandWordmark />
              <div className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Audition workspace
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 px-5 py-10 md:px-8 lg:grid-cols-[1fr_460px]">
        <section>
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Temporary sign in
          </div>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-[-0.045em] md:text-6xl">
            계정별로 분리된
            <br />
            오디션 워크스페이스
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
            공연사는 소속 공고와 지원자만 확인하고, 지원자는 자신의 프로필·제출 자료·지원 내역으로
            접속합니다.
          </p>

          <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
            <InfoCard icon={UserRound} title="지원자" description="개인 프로필과 지원 내역 분리" />
            <InfoCard icon={Building2} title="공연사" description="회사별 공고와 지원자 분리" />
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-card p-5 shadow-[var(--shadow-elev-2)] md:p-7">
          {currentAccount && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-success/10 px-4 py-3 text-sm">
              <div>
                <div className="font-semibold text-success">{currentAccount.name} 로그인 중</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {currentAccount.role === "producer" ? "공연사" : "지원자"} 계정
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold"
              >
                로그아웃
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 rounded-xl bg-secondary p-1">
            {(
              [
                ["applicant", "지원자"],
                ["producer", "공연사"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => chooseRole(value)}
                className={`min-h-11 rounded-lg text-sm font-semibold transition ${
                  role === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-semibold">
              아이디
              <input
                autoFocus
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="아이디 입력"
                className="min-h-12 rounded-xl border border-input bg-background px-4 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              비밀번호
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="비밀번호 입력"
                  className="min-h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </label>
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5"
            >
              로그인
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-7 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold">테스트 계정</div>
              <div className="text-[11px] text-muted-foreground">비밀번호 1234</div>
            </div>
            <div className="mt-3 grid gap-2">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => {
                    setUsername(account.username);
                    setPassword(account.password);
                    setError("");
                  }}
                  className="flex min-h-10 items-center justify-between rounded-lg border border-border bg-background px-3 text-left text-xs transition hover:border-primary hover:bg-secondary"
                >
                  <span className="flex min-w-0 items-center gap-2 font-semibold">
                    {account.role === "producer" &&
                      (account.logo ? (
                        <img
                          src={account.logo}
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-full border border-border bg-white object-contain"
                        />
                      ) : (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {account.name.slice(0, 1)}
                        </span>
                      ))}
                    <span className="truncate">{account.name}</span>
                  </span>
                  <span className="font-mono text-muted-foreground">{account.username}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <Icon className="h-5 w-5" />
      <div className="mt-3 text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
