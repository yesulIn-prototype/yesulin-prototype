import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { inferUserRole, trackPageView } from "@/lib/analytics";

export function AnalyticsPageView() {
  const location = useLocation();

  useEffect(() => {
    trackPageView({
      pagePath: location.href,
      pageTitle: document.title,
      userRole: inferUserRole(location.pathname),
    });
  }, [location.href, location.pathname]);

  return null;
}
