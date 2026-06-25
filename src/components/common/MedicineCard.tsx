import { X, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import type { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
  onSelect?: (medicine: Medicine) => void;
  onRemove?: (id: string) => void;
  selected?: boolean;
}

export function MedicineCard({
  medicine,
  onSelect,
  onRemove,
  selected = false,
}: MedicineCardProps) {
  const mainIngredient = medicine.ingredients.find((i) => i.isMain);

  return (
    <div
      className={`rounded-2xl p-3.5 transition-all ${
        selected
          ? 'bg-primary/[0.06] shadow-[var(--shadow-xs)]'
          : 'bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">
            {medicine.productName}
          </p>
          <p className="text-sm text-muted-foreground">{medicine.manufacturer}</p>
          {mainIngredient && (
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {mainIngredient.ingredient.nameKo} {mainIngredient.amount}
              {mainIngredient.unit}
            </p>
          )}
        </div>
        <div className="ml-2 shrink-0">
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(medicine.id)}
              aria-label="제거"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {onSelect && !selected && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSelect(medicine)}
              aria-label="추가"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
