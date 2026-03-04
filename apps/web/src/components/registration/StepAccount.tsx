import type { FormEvent } from "react";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";

type AccountData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type StepAccountProps = {
  data: AccountData;
  onChange: (data: AccountData) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
};

export function StepAccount({
  data,
  onChange,
  onSubmit,
  onBack,
  loading,
  error,
}: StepAccountProps) {
  const { t } = useLanguage();
  const reg = t.registration!;
  const auth = t.auth!;

  function update(field: keyof AccountData, value: string) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  const canSubmit =
    data.email.trim() !== "" &&
    data.password.length >= 8 &&
    data.firstName.trim() !== "" &&
    data.lastName.trim() !== "";

  return (
    <div className="mx-auto max-w-md">
      <h3 className="text-xl font-bold text-[var(--rcb-text-strong)]">
        {reg.step3Title}
      </h3>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="acc-firstName" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {auth.firstNameLabel} *
            </label>
            <input
              id="acc-firstName"
              type="text"
              required
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="acc-lastName" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {auth.lastNameLabel} *
            </label>
            <input
              id="acc-lastName"
              type="text"
              required
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="acc-email" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {auth.emailLabel} *
          </label>
          <input
            id="acc-email"
            type="email"
            required
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="acc-password" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {auth.passwordLabel} *
          </label>
          <input
            id="acc-password"
            type="password"
            required
            minLength={8}
            value={data.password}
            onChange={(e) => update("password", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
          <p className="mt-1 text-xs text-[var(--rcb-text-muted)]">
            {auth.passwordHint}
          </p>
        </div>

        <div>
          <label htmlFor="acc-phone" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {auth.phoneLabel}{" "}
            <span className="text-[var(--rcb-text-muted)]">({auth.optional})</span>
          </label>
          <input
            id="acc-phone"
            type="tel"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="cursor-pointer text-sm font-medium text-[var(--rcb-text-muted)] transition-colors hover:text-[var(--rcb-primary)]"
          >
            &larr; {reg.backButton}
          </button>
          <Button
            type="submit"
            disabled={!canSubmit || loading}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? (auth.registering ?? "...")
              : reg.confirmButton}
          </Button>
        </div>
      </form>
    </div>
  );
}
