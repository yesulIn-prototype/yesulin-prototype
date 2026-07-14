import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Search, FileStack, User, FolderOpen, Sparkles, ChevronLeft } from "lucide-react";
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
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold">공연 지원 플랫폼</span>
            </Link>
            <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground md:inline-flex">
              지원자
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs sm:block">
              <div className="font-medium">{applicant.name}</div>
              <div className="text-muted-foreground">{applicant.stageName}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {applicant.name.charAt(0)}
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 md:px-6">
          {nav.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
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

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <Outlet />
      </main>
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
