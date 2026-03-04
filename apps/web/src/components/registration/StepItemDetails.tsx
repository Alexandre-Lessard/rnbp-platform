import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { Button } from "@/components/ui/Button";
import { ITEM_CATEGORIES } from "@rcbp/shared";

type ItemData = {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  estimatedValue: string;
  description: string;
};

type StepItemDetailsProps = {
  data: ItemData;
  onChange: (data: ItemData) => void;
  onNext: () => void;
  termsAccepted: boolean;
  onTermsChange: (v: boolean) => void;
};

export function StepItemDetails({
  data,
  onChange,
  onNext,
  termsAccepted,
  onTermsChange,
}: StepItemDetailsProps) {
  const { t } = useLanguage();
  const reg = t.registration!;

  // Map category slugs to display names from allCategories
  const categoryLabels = t.allCategories.items;
  const categoryOptions = ITEM_CATEGORIES.map((slug, i) => ({
    value: slug,
    label: categoryLabels[i] ?? slug,
  }));

  function update(field: keyof ItemData, value: string) {
    onChange({ ...data, [field]: value });
  }

  const canContinue =
    data.name.trim() !== "" &&
    data.category !== "" &&
    termsAccepted;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-5">
        <div>
          <label htmlFor="reg-category" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {reg.categoryLabel} *
          </label>
          <select
            id="reg-category"
            value={data.category}
            onChange={(e) => update("category", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          >
            <option value="">{reg.categoryPlaceholder}</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {reg.nameLabel} *
          </label>
          <input
            id="reg-name"
            type="text"
            required
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="reg-brand" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg.brandLabel}
            </label>
            <input
              id="reg-brand"
              type="text"
              value={data.brand}
              onChange={(e) => update("brand", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="reg-model" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
              {reg.modelLabel}
            </label>
            <input
              id="reg-model"
              type="text"
              value={data.model}
              onChange={(e) => update("model", e.target.value)}
              className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-serial" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {reg.serialLabel}
          </label>
          <input
            id="reg-serial"
            type="text"
            value={data.serialNumber}
            onChange={(e) => update("serialNumber", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="reg-value" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {reg.valueLabel}
          </label>
          <input
            id="reg-value"
            type="number"
            min="1000"
            value={data.estimatedValue}
            onChange={(e) => update("estimatedValue", e.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="reg-description" className="mb-1 block text-sm font-medium text-[var(--rcb-text-strong)]">
            {reg.descriptionLabel}
          </label>
          <textarea
            id="reg-description"
            rows={3}
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-lg border border-[var(--rcb-border)] bg-[var(--rcb-bg)] px-4 py-3 text-[var(--rcb-text-body)] focus:border-[var(--rcb-primary)] focus:outline-none"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="reg-terms"
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[var(--rcb-border)] accent-[var(--rcb-primary)]"
          />
          <label htmlFor="reg-terms" className="text-sm text-[var(--rcb-text-body)]">
            {reg.termsCheckbox}{" "}
            <Link to="/conditions" className="text-[var(--rcb-primary)] hover:underline" target="_blank">
              &rarr;
            </Link>
          </label>
        </div>

        <Button
          onClick={onNext}
          disabled={!canContinue}
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {reg.continueButton}
        </Button>
      </div>

      <div className="hidden items-start justify-center lg:flex">
        <img
          src="/assets/hero-items.png"
          alt=""
          className="w-full max-w-md rounded-2xl"
        />
      </div>
    </div>
  );
}
