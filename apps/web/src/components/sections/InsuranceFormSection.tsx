import { useState } from "react";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { INSURERS, INSURER_EMAILS } from "@rnbp/shared";

export function InsuranceFormSection() {
  const { t } = useLanguage();
  const [selectedInsurer, setSelectedInsurer] = useState("");
  const [copied, setCopied] = useState(false);

  const ins = t.insurance;
  if (!ins) return null;

  const message = selectedInsurer
    ? ins.messageTemplate.replace("{{insurer}}", selectedInsurer)
    : "";

  const insurerEmail = selectedInsurer
    ? INSURER_EMAILS[selectedInsurer] ?? null
    : null;

  const mailtoHref = insurerEmail
    ? `mailto:${insurerEmail}?subject=${encodeURIComponent(ins.emailSubject)}&body=${encodeURIComponent(message).replace(/%0A/g, "%0D%0A")}`
    : null;

  async function handleCopy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <section className="bg-[var(--rcb-bg)]">
      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold text-[var(--rcb-text)] sm:text-5xl">
            {ins.heading}
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-[var(--rcb-text-muted)]">
            {ins.description}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <label
            htmlFor="insurer-select"
            className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
          >
            {ins.selectLabel}
          </label>
          <select
            id="insurer-select"
            value={selectedInsurer}
            onChange={(e) => {
              setSelectedInsurer(e.target.value);
              setCopied(false);
            }}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          >
            <option value="">{ins.selectPlaceholder}</option>
            {INSURERS.map((insurer) => (
              <option key={insurer} value={insurer}>
                {insurer}
              </option>
            ))}
          </select>

          {selectedInsurer && (
            <div className="mt-6">
              <label
                htmlFor="insurance-message"
                className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
              >
                {ins.messageLabel}
              </label>
              <textarea
                id="insurance-message"
                readOnly
                value={message}
                rows={4}
                className="w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-white)] px-4 py-3 text-[var(--rcb-text-body)] focus:outline-none"
              />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {mailtoHref && (
                  <a
                    href={mailtoHref}
                    className="inline-block rounded-xl bg-[var(--rcb-primary)] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)]"
                  >
                    {ins.emailButton}
                  </a>
                )}
                <Button
                  onClick={handleCopy}
                  variant={mailtoHref ? "outline" : "primary"}
                  size="sm"
                  className="cursor-pointer"
                >
                  {ins.sendButton}
                </Button>
                {copied && (
                  <span className="text-sm font-medium text-green-600">
                    {ins.copiedToast}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
