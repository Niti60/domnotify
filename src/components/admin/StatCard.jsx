'use client';

import { Card } from '@/components/ui/Card';

export function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <Card className="flex items-start justify-between p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
      </div>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
          <Icon size={24} className="text-muted-foreground" />
        </div>
      )}
    </Card>
  );
}
