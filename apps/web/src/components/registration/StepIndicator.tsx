import { useLanguage } from "@/i18n/context";

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
};

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { t } = useLanguage();
  const reg = t.registration;

  const allLabels = [
    reg?.step1Title ?? "Step 1",
    reg?.step2Title ?? "Step 2",
    reg?.step3Title ?? "Step 3",
    reg?.step4Title ?? "Step 4",
  ];
  const labels = allLabels.slice(0, totalSteps);

  return (
    <div className="flex items-center justify-center gap-0" role="group" aria-label="Progress">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                  isCompleted
                    ? "border-[var(--rcb-primary)] bg-[var(--rcb-primary)] text-white"
                    : isActive
                      ? "border-[var(--rcb-navy)] bg-[var(--rcb-navy)] text-white"
                      : "border-[var(--rcb-border)] bg-[var(--rcb-bg)] text-[var(--rcb-text-muted)]"
                }`}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${labels[i]}${isCompleted ? " — complété" : isActive ? " — en cours" : ""}`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`mt-2 hidden text-xs font-medium sm:block ${
                  isActive || isCompleted
                    ? "text-[var(--rcb-text-strong)]"
                    : "text-[var(--rcb-text-muted)]"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`mx-3 mb-0 h-0.5 w-10 sm:mb-6 sm:w-24 ${
                  isCompleted
                    ? "bg-[var(--rcb-primary)]"
                    : "bg-[var(--rcb-border)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
