import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Film, Users, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/producer")({
  component: ProducerLayout,
});

const nav = [
  { to: "/producer", label: "대시보드", icon: LayoutDashboard, exact: true },
  { to: "/producer/shows", label: "공연 관리", icon: Film },
  { to: "/producer/applicants", label: "지원자 관리", icon: Users },
  { to: "/producer/create", label: "모집 공고 만들기", icon: PlusCircle },
];

function ProducerLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="hidden border-r border-border bg-sidebar lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2.5 border-b border-border px-6 py-5">
          <BrandMark />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">공연 지원 플랫폼</span>
            <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              Producer Console
            </span>
          </div>
        </Link>
        <nav className="flex-1 space-y-0.5 p-3" aria-label="주요 메뉴">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elev-1)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30">
              라
            </div>
            <div className="text-xs leading-tight">
              <div className="font-semibold text-foreground">라이트스테이지</div>
              <div className="text-muted-foreground">캐스팅 담당</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 bg-background">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="text-sm font-semibold">공연사 콘솔</span>
          </Link>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border/70 bg-background/90 px-4 py-2 lg:hidden" aria-label="주요 메뉴">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="mx-auto max-w-[1400px] p-4 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(58,26,44,0.22)]">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 3v14c0 2.2 3.6 4 8 4s8-1.8 8-4V3" />
        <path d="M4 3c0 2.2 3.6 4 8 4s8-1.8 8-4" />
      </svg>
    </div>
  );
}
