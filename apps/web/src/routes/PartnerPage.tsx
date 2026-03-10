import { type ReactNode, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/context";
import { apiRequest, type ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

type FormState = "idle" | "loading" | "success" | "error";

function renderBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

export function PartnerPage() {
  const { t } = useLanguage();
  const p = t.partners!;

  const [openAccordion, setOpenAccordion] = useState<"police" | "insurer" | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "loading") return;

    // Honeypot check
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value;

    setFormState("loading");
    setErrorMsg("");

    try {
      await apiRequest("/contact", {
        method: "POST",
        body: {
          name,
          email,
          company: company || undefined,
          type,
          message,
          website: honeypot || undefined,
        },
      });
      setFormState("success");
      setName("");
      setEmail("");
      setCompany("");
      setType("");
      setMessage("");
    } catch (err) {
      const apiErr = err as ApiError;
      setErrorMsg(apiErr.message || p.errorMessage);
      setFormState("error");
    }
  }

  const inputClasses =
    "h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none";

  return (
    <section className="min-h-[70vh] bg-[var(--rcb-white)]">
      <Helmet>
        <title>{t.pages.partners.title}</title>
        <meta name="description" content={t.pages.partners.description} />
      </Helmet>
      <div className="section-shell py-16">
        <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
          {p.heading}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--rcb-text-muted)]">
          {p.description}
        </p>

        <h2 className="mt-12 text-2xl font-semibold text-[var(--rcb-text-strong)]">
          {p.whyPartner}
        </h2>
        <ul className="mt-6 max-w-3xl space-y-4">
          {p.benefits.map((benefit, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[var(--rcb-text-body)]"
            >
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--rcb-primary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* ── Accordéons Police / Assureurs ──────────────────────────── */}
        <div className="mt-16 space-y-4">
          {/* Police */}
          <div className="rounded-2xl border border-[var(--rcb-border)] bg-[var(--rcb-bg)]">
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === "police" ? null : "police")}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left"
              aria-expanded={openAccordion === "police"}
            >
              <span className="text-lg font-semibold text-[var(--rcb-text-strong)]">
                {p.policeAccordion.title}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-[var(--rcb-primary)] transition-transform ${openAccordion === "police" ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {openAccordion === "police" && (
              <div className="border-t border-[var(--rcb-border)] px-6 pb-6 pt-4">
                {p.policeAccordion.intro.split("\n").map((line, i) => (
                  <p key={i} className="mt-2 text-[var(--rcb-text-body)] first:mt-0">
                    {renderBold(line)}
                  </p>
                ))}
                <h3 className="mt-6 text-lg font-semibold text-[var(--rcb-text-strong)]">
                  {p.policeAccordion.subheading}
                </h3>
                <ul className="mt-4 space-y-4">
                  {p.policeAccordion.advantages.map((adv) => (
                    <li key={adv.title}>
                      <p className="font-medium text-[var(--rcb-text-strong)]">{adv.title}</p>
                      <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">{adv.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Assureurs */}
          <div className="rounded-2xl border border-[var(--rcb-border)] bg-[var(--rcb-bg)]">
            <button
              type="button"
              onClick={() => setOpenAccordion(openAccordion === "insurer" ? null : "insurer")}
              className="flex w-full cursor-pointer items-center justify-between gap-4 p-6 text-left"
              aria-expanded={openAccordion === "insurer"}
            >
              <span className="text-lg font-semibold text-[var(--rcb-text-strong)]">
                {p.insurerAccordion.title}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-[var(--rcb-primary)] transition-transform ${openAccordion === "insurer" ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {openAccordion === "insurer" && (
              <div className="border-t border-[var(--rcb-border)] px-6 pb-6 pt-4">
                {p.insurerAccordion.intro.split("\n").map((line, i) => (
                  <p key={i} className="mt-2 text-[var(--rcb-text-body)] first:mt-0">
                    {renderBold(line)}
                  </p>
                ))}
                <h3 className="mt-6 text-lg font-semibold text-[var(--rcb-text-strong)]">
                  {p.insurerAccordion.subheading}
                </h3>
                <ul className="mt-4 space-y-4">
                  {p.insurerAccordion.advantages.map((adv) => (
                    <li key={adv.title}>
                      <p className="font-medium text-[var(--rcb-text-strong)]">{adv.title}</p>
                      <p className="mt-1 text-sm text-[var(--rcb-text-muted)]">{adv.text}</p>
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-8 rounded-xl bg-[var(--rcb-surface)] border-l-4 border-[var(--rcb-primary)] px-6 py-5">
                  <p className="text-lg font-medium italic text-[var(--rcb-text-strong)]">
                    {`«\u00a0${p.insurerAccordion.quote}\u00a0»`}
                  </p>
                </blockquote>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-8 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold text-[var(--rcb-text-strong)]">
              {p.formHeading}
            </h2>
            <p className="mt-3 text-[var(--rcb-text-muted)]">
              {p.ctaDescription}
            </p>
          </div>

          {formState === "success" ? (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
              {p.successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl space-y-5">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
                  >
                    {p.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
                  >
                    {p.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-company"
                    className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
                  >
                    {p.companyLabel}
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    maxLength={255}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-type"
                    className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
                  >
                    {p.typeLabel}
                  </label>
                  <select
                    id="contact-type"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">{p.typePlaceholder}</option>
                    {(Object.entries(p.typeOptions) as [string, string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-medium text-[var(--rcb-text-strong)]"
                >
                  {p.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 py-3 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
                />
              </div>

              {formState === "error" && (
                <div className="rounded-lg bg-red-50 p-4 text-red-800">
                  {errorMsg || p.errorMessage}
                </div>
              )}

              <Button type="submit" disabled={formState === "loading"}>
                {formState === "loading" ? p.submitting : p.submitButton}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
