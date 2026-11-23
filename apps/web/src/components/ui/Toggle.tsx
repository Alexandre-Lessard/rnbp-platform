type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  /** Shown next to the switch; defaults to `label`. */
  stateLabel?: string;
  id?: string;
};

/** On/off switch with the same look as the product page's "Active" switch. */
export function Toggle({ checked, onChange, label, stateLabel, id }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors"
        style={{ backgroundColor: checked ? "var(--rcb-primary)" : "#d1d5db" }}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-[var(--rcb-text-strong)]">
        {stateLabel ?? label}
      </span>
    </div>
  );
}
