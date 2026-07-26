export type UserRole = "applicant" | "producer" | "unknown";

type AnalyticsEventMap = {
  role_selected: {
    user_role: Exclude<UserRole, "unknown">;
    entry_point: "landing";
  };
  show_detail_viewed: {
    show_id: string;
    show_status: string;
    has_existing_application: boolean;
  };
  application_started: {
    show_id: string;
    required_item_count: number;
  };
  application_step_completed: {
    show_id: string;
    step_number: number;
    step_name: string;
  };
  application_validation_failed: {
    show_id: string;
    step_number: number;
    step_name: string;
    missing_required_count: number;
  };
  application_submitted: {
    show_id: string;
    role_count: number;
    career_count: number;
    photo_count: number;
    video_count: number;
    used_saved_profile: boolean;
  };
  recruitment_create_started: {
    entry_point: "producer_console";
  };
  recruitment_previewed: {
    role_count: number;
    submission_item_count: number;
    additional_question_count: number;
  };
  applicant_detail_viewed: {
    show_id: string;
    review_status: string;
  };
  review_status_changed: {
    show_id: string;
    previous_status: string;
    review_status: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

type DataLayerMessage = Record<string, unknown> & {
  event: AnalyticsEventName | "page_view";
  app_environment: string;
  analytics_schema_version: 1;
};

declare global {
  interface Window {
    dataLayer?: DataLayerMessage[];
  }
}

const analyticsEnvironment =
  import.meta.env.VITE_ANALYTICS_ENVIRONMENT?.trim() ||
  (import.meta.env.PROD ? "production" : "prototype");
const analyticsDebug = import.meta.env.VITE_ANALYTICS_DEBUG === "true";
const gtmIdPattern = /^GTM-[A-Z0-9]+$/;

let lastPageViewPath: string | undefined;

export function getGoogleTagManagerId(): string | undefined {
  const candidate = import.meta.env.VITE_GTM_ID?.trim().toUpperCase();
  return candidate && gtmIdPattern.test(candidate) ? candidate : undefined;
}

export function inferUserRole(pathname: string): UserRole {
  if (pathname.startsWith("/applicant")) return "applicant";
  if (pathname.startsWith("/producer")) return "producer";
  return "unknown";
}

export function trackAnalyticsEvent<Name extends AnalyticsEventName>(
  event: Name,
  parameters: AnalyticsEventMap[Name],
): void {
  pushToDataLayer({
    event,
    ...parameters,
    app_environment: analyticsEnvironment,
    analytics_schema_version: 1,
  });
}

export function trackPageView({
  pagePath,
  pageTitle,
  userRole,
}: {
  pagePath: string;
  pageTitle: string;
  userRole: UserRole;
}): void {
  if (lastPageViewPath === pagePath) return;
  lastPageViewPath = pagePath;

  pushToDataLayer({
    event: "page_view",
    page_path: pagePath,
    page_title: pageTitle,
    user_role: userRole,
    app_environment: analyticsEnvironment,
    analytics_schema_version: 1,
  });
}

function pushToDataLayer(message: DataLayerMessage): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(message);

  if (analyticsDebug) {
    console.debug(`[analytics] ${message.event}`, message);
  }
}
