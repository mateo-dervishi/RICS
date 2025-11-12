import type { CostBreakdownItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface CostBreakdownProps {
  costs: CostBreakdownItem[];
}

export function CostBreakdown({ costs }: CostBreakdownProps) {
  const total = costs.reduce((sum, cost) => sum + cost.amount, 0);

  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-muted-foreground">Estimated journey investment</p>
        <p className="text-2xl font-bold">{formatCurrency(total)}</p>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {costs.map((cost) => (
          <div key={cost.label} className="flex items-start justify-between">
            <div>
              <dt className="font-medium">{cost.label}</dt>
              {cost.description ? <dd className="text-muted-foreground">{cost.description}</dd> : null}
            </div>
            <span>{formatCurrency(cost.amount)}</span>
          </div>
        ))}
      </dl>
    </div>
  );
}
