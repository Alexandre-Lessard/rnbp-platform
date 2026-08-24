import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/routes/routes";
import {
  getConsent,
  setConsent,
  onConsentChange,
  hasDecided,
  onOpenPreferences,
} from "@/lib/consent";

/**
 * Law 25 consent banner.
 *
 * Three rules shape this component, and none of them are cosmetic:
 * refusing must be exactly as easy as accepting (so both are plain buttons,
 * side by side, same weight); consent must be granular (hence the preferences
 * panel); and it must be withdrawable later (hence the footer entry point,
 * which opens the same panel through `openCookiePreferences`).
 */

export function CookieConsent() {
  const { t } = useLanguage();
  const c = t.consent!;

  // localStorage is an external store, so React reads it through the API meant
  // for that. The server snapshot is `true` — "already decided" — so a
  // prerendered page never ships the banner and never flashes it to someone
  // who answered months ago.
  const decided = useSyncExternalStore(onConsentChange, hasDecided, () => true);

  const [panelOpen, setPanelOpen] = useState(false);
  const [measurement, setMeasurement] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(
    () =>
      onOpenPreferences(() => {
        const now = getConsent();
        setMeasurement(now?.measurement ?? false);
        setAdvertising(now?.advertising ?? false);
        setPanelOpen(true);
      }),
    [],
  );

  function acceptAll() {
    setConsent({ measurement: true, advertising: true });
    setPanelOpen(false);
  }

  function refuseAll() {
    setConsent({ measurement: false, advertising: false });
    setPanelOpen(false);
  }

  function saveChoice() {
    setConsent({ measurement, advertising });
    setPanelOpen(false);
  }

  return (
    <>
      {!decided && !panelOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={c.bannerTitle}
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-[var(--rcb-border)] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="section-shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[var(--rcb-text-strong)]">
                {c.bannerTitle}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--rcb-text-body)]">
                {c.bannerBody}{" "}
                <Link
                  to={ROUTES.privacy}
                  className="font-medium text-[var(--rcb-primary)] hover:underline"
                >
                  {c.privacyLink}
                </Link>
              </p>
            </div>
            {/* Refuse sits first and carries the same visual weight as accept:
                a banner that nudges toward acceptance is not free consent. */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" onClick={refuseAll} style={{ minWidth: 150 }}>
                {c.refuseAll}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPanelOpen(true)} style={{ minWidth: 150 }}>
                {c.customize}
              </Button>
              <Button size="sm" onClick={acceptAll} style={{ minWidth: 150 }}>
                {c.acceptAll}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={panelOpen} onClose={() => setPanelOpen(false)} title={c.panelTitle}>
        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-[var(--rcb-text-body)]">{c.panelIntro}</p>

          <ConsentRow
            title={c.necessaryTitle}
            body={c.necessaryBody}
            checked
            disabled
            note={c.alwaysOn}
          />
          <ConsentRow
            title={c.measurementTitle}
            body={c.measurementBody}
            checked={measurement}
            onChange={setMeasurement}
          />
          <ConsentRow
            title={c.advertisingTitle}
            body={c.advertisingBody}
            checked={advertising}
            onChange={setAdvertising}
          />

          <div className="flex flex-col gap-2 border-t border-[var(--rcb-border)] pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" size="sm" onClick={refuseAll} style={{ minWidth: 150 }}>
              {c.refuseAll}
            </Button>
            <Button size="sm" onClick={saveChoice} style={{ minWidth: 150 }}>
              {c.save}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ConsentRow({
  title,
  body,
  checked,
  onChange,
  disabled,
  note,
}: {
  title: string;
  body: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--rcb-border)] p-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[var(--rcb-primary)] disabled:cursor-not-allowed"
        aria-label={title}
      />
      <div>
        <p className="text-sm font-semibold text-[var(--rcb-text-strong)]">
          {title}
          {note && (
            <span className="ml-2 font-normal text-xs text-[var(--rcb-text-muted)]">{note}</span>
          )}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--rcb-text-body)]">{body}</p>
      </div>
    </div>
  );
}
