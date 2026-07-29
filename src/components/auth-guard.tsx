import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAuthAccount, useStore, type AccountRole } from "@/lib/store";

export function AuthGuard({ role, children }: { role: AccountRole; children: ReactNode }) {
  const navigate = useNavigate();
  const currentAccountId = useStore((state) => state.currentAccountId);
  const [hydrated, setHydrated] = useState(() => useStore.persist.hasHydrated());
  const account = getAuthAccount(currentAccountId);
  const authorized = account?.role === role;

  useEffect(() => {
    if (hydrated) return;
    return useStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (hydrated && !authorized) {
      void navigate({ to: "/", replace: true });
    }
  }, [authorized, hydrated, navigate]);

  if (!hydrated || !authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        로그인 정보를 확인하고 있습니다.
      </div>
    );
  }

  return children;
}
