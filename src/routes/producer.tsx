import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Film, Users, PlusCircle, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-sidebar lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2 border-b border-border px-6 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">공연 지원 플랫폼</span>
            <span className="text-[10px] text-muted-foreground">공연사 콘솔</span>
          </div>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          <div className="font-medium text-foreground">라이트스테이지</div>
          <div>캐스팅 담당</div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold">공연사 콘솔</span>
          </Link>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-border/70 px-4 py-2 lg:hidden">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`inline-flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
