import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import { AnalyticsPageView } from "@/components/analytics-page-view";
import { getGoogleTagManagerId } from "@/lib/analytics";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">404</div>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          주소가 변경되었거나 더 이상 제공되지 않는 페이지입니다.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          페이지를 불러오지 못했습니다
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도하거나 홈으로 돌아가 주세요.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "예술IN" },
      {
        name: "description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토하는 통합 오디션 플랫폼",
      },
      { name: "author", content: "예술IN" },
      { property: "og:title", content: "예술IN" },
      {
        property: "og:description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토합니다.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "예술IN" },
      {
        name: "twitter:description",
        content:
          "한 번 등록한 프로필과 자료로 여러 공연에 지원하고, 공연사는 지원자를 한 화면에서 검토합니다.",
      },
      {
        property: "og:image",
        content: "/og.png",
      },
      {
        name: "twitter:image",
        content: "/og.png",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const gtmId = getGoogleTagManagerId();

  return (
    <html lang="ko">
      <head>
        <HeadContent />
        {gtmId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      {hydrated ? (
        <>
          <AnalyticsPageView />
          <Outlet />
        </>
      ) : (
        <div style={{ minHeight: "100vh", background: "var(--background)" }} />
      )}
    </QueryClientProvider>
  );
}
