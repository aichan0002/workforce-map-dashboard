import type { ToggleKey } from "../types/geo";

type MetricToggleProps = {
  id: ToggleKey;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (key: ToggleKey, value: boolean) => void;
};

function MetricToggle({ id, label, description, checked, disabled, onChange }: MetricToggleProps) {
  return (
    <label className={`toggle-row ${disabled ? "is-disabled" : ""}`} title={description}>
      <span className="toggle-copy">
        <span className="toggle-label">{label}</span>
        <span className="toggle-description">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(id, event.currentTarget.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}

export default MetricToggle;
