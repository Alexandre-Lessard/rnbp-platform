import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/context";
import { apiRequest, type ApiError } from "@/lib/api-client";

type FormState = "idle" | "loading" | "success" | "error";

export function PartnerPage() {
  const { t } = useLanguage();
  const p = t.partners!;

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

        <div className="mt-16 rounded-2xl border border-[var(--rcb-border)] bg-[var(--rcb-surface)] p-8 lg:p-12">
          <h2 className="text-2xl font-semibold text-[var(--rcb-text-strong)]">
            {p.formHeading}
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--rcb-text-muted)]">
            {p.ctaDescription}
          </p>

          {formState === "success" ? (
            <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">
              {p.successMessage}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
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

              <button
                type="submit"
                disabled={formState === "loading"}
                className="inline-block cursor-pointer rounded-xl bg-[var(--rcb-primary)] px-8 py-3 font-medium text-white transition-colors hover:bg-[var(--rcb-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === "loading" ? p.submitting : p.submitButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
