import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/context";
import { apiRequest, type ApiError } from "@/lib/api-client";

type FormState = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactPage() {
  const { t } = useLanguage();
  const c = t.contact!;

  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const emailValid = email === "" || EMAIL_RE.test(email);
  const showEmailError = emailTouched && !emailValid;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "loading") return;

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
          phone: phone || undefined,
          type: "other",
          message,
          website: honeypot || undefined,
        },
      });
      setFormState("success");
      setName("");
      setEmail("");
      setEmailTouched(false);
      setPhone("");
      setMessage("");
    } catch (err) {
      const apiErr = err as ApiError;
      setErrorMsg(apiErr.message || c.errorMessage);
      setFormState("error");
    }
  }

  const inputBase =
    "h-12 w-full rounded-xl border bg-[var(--rcb-white)] px-4 text-[var(--rcb-text-body)] transition-colors focus:outline-none";
  const inputOk = `${inputBase} border-[var(--rcb-border-muted)] focus:border-[var(--rcb-primary)]`;
  const inputErr = `${inputBase} border-[var(--rcb-primary)] focus:border-[var(--rcb-primary)]`;

  const textareaBase =
    "w-full rounded-xl border bg-[var(--rcb-white)] px-4 py-3 text-[var(--rcb-text-body)] transition-colors focus:outline-none";
  const textareaOk = `${textareaBase} border-[var(--rcb-border-muted)] focus:border-[var(--rcb-primary)]`;

  return (
    <section className="min-h-[70vh] bg-[var(--rcb-bg)]">
      <Helmet>
        <title>{t.pages.contact.title}</title>
        <meta name="description" content={t.pages.contact.description} />
      </Helmet>

      <div className="section-shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--rcb-text-strong)]">
              {c.heading}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-[var(--rcb-text-muted)]">
              {c.description}
            </p>
          </div>

          {formState === "success" ? (
            <div className="mt-12 rounded-2xl border border-[var(--rcb-gray-dark)] bg-[var(--rcb-gray-light)] p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--rcb-white)]">
                <svg className="h-7 w-7 text-[var(--rcb-dark-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-[var(--rcb-text-strong)]">{c.successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-[var(--rcb-text-strong)]">
                  {c.nameLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputOk}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-[var(--rcb-text-strong)]">
                  {c.emailLabel} <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={showEmailError ? inputErr : inputOk}
                />
                {showEmailError && (
                  <p className="mt-1.5 text-sm text-[var(--rcb-red-medium)]">{c.emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-[var(--rcb-text-strong)]">
                  {c.phoneLabel}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={c.phonePlaceholder}
                  className={inputOk}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-[var(--rcb-text-strong)]">
                  {c.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={textareaOk}
                />
              </div>

              {formState === "error" && (
                <div className="rounded-xl bg-[var(--rcb-red-light)] p-4 text-[var(--rcb-red-dark)]">
                  {errorMsg || c.errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading" || showEmailError}
                className="w-full cursor-pointer rounded-xl bg-[var(--rcb-primary)] py-3.5 text-center font-semibold text-[var(--rcb-white)] transition-colors hover:bg-[var(--rcb-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
              >
                {formState === "loading" ? c.submitting : c.submitButton}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
