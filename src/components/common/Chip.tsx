interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
  variant?: 'food' | 'supplement';
}

const variantStyles = {
  food: {
    active: 'bg-green-100 text-green-700 border-green-300',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:border-green-300',
  },
  supplement: {
    active: 'bg-purple-100 text-purple-700 border-purple-300',
    inactive: 'bg-white text-gray-600 border-gray-300 hover:border-purple-300',
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
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${colorClass}`}
    >
      {label}
    </button>
  );
}
