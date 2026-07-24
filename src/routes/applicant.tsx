import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Search, FileStack, User, FolderOpen, ChevronLeft } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/applicant")({
  component: ApplicantLayout,
});

const nav = [
  { to: "/applicant", label: "홈", icon: Home, exact: true },
  { to: "/applicant/shows", label: "공연 찾기", icon: Search },
  { to: "/applicant/applications", label: "내 지원 현황", icon: FileStack },
  { to: "/applicant/profile", label: "내 프로필", icon: User },
  { to: "/applicant/files", label: "파일 보관함", icon: FolderOpen },
];

function ApplicantLayout() {
  const applicant = useStore((s) => s.applicant);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <BrandMark />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight">공연 지원 플랫폼</span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Applicant
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-medium leading-tight">{applicant.name}</div>
              <div className="text-muted-foreground">{applicant.stageName}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-primary/15">
              {applicant.name.charAt(0)}
            </div>
          </div>
        </div>
        <nav
          className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-4 pb-2 md:flex md:px-6"
          aria-label="주요 메뉴"
        >
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elev-1)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 md:px-6 md:py-10">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(35,20,30,0.08)] backdrop-blur md:hidden"
        aria-label="모바일 주요 메뉴"
      >
        {nav.map((item) => {
          const active = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "stroke-[2.4]" : ""}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(58,26,44,0.22)]">
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

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
