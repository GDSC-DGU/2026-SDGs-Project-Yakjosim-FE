interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  variant?: 'food' | 'supplement';
}

const variantStyles = {
  food: {
    active: 'bg-risk-safe-bg text-risk-safe-fg shadow-[var(--shadow-xs)]',
    inactive: 'bg-muted text-foreground hover:bg-accent',
  },
  supplement: {
    active: 'bg-risk-consult-bg text-risk-consult-fg shadow-[var(--shadow-xs)]',
    inactive: 'bg-muted text-foreground hover:bg-accent',
  },
};

export function Chip({
  label,
  selected,
  onToggle,
  variant = 'food',
}: ChipProps) {
  const styles = variantStyles[variant];
  const colorClass = selected ? styles.active : styles.inactive;

  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${colorClass}`}
    >
      {label}
    </button>
  );
}
