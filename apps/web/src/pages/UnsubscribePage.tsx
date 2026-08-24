import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useLanguage } from "@/i18n/context";
import { apiRequest } from "@/lib/api-client";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";

export function UnsubscribePage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"working" | "done" | "error">(
    token ? "working" : "error",
  );

  // The unsubscribe itself is a POST: a GET would let a mail client's link
  // prefetcher opt someone out without them ever clicking.
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current || !token) return;
    ran.current = true;

    apiRequest(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
      method: "POST",
    })
      .then(() => setStatus("done"))
      .catch(() => setStatus("error"));
  }, [token]);

  const u = t.newsletter!.unsubscribe;

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[var(--rcb-white)] px-4 py-16">
      <title>{t.pages.unsubscribe.title}</title>
      <meta name="description" content={t.pages.unsubscribe.description} />

      <div className="w-full max-w-md text-center">
        {status === "working" && (
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--rcb-primary)] border-t-transparent" />
        )}

        {status === "done" && (
          <>
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
              {u.doneHeading}
            </h1>
            <p className="mt-3 leading-relaxed text-[var(--rcb-text-body)]">{u.doneBody}</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-[var(--rcb-text-strong)]">
              {u.errorHeading}
            </h1>
            <p className="mt-3 leading-relaxed text-[var(--rcb-text-body)]">{u.errorBody}</p>
          </>
        )}

        {status !== "working" && (
          <Link to={ROUTES.home} className={getButtonClasses("primary", "sm") + " mt-6"}>
            {u.backHome}
          </Link>
        )}
      </div>
    </section>
  );
}
export default UnsubscribePage;
