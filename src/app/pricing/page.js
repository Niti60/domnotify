'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { pricingPlans } from '@/data/dummyData';
import { cn } from '@/lib/cn';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Pricing"
        subtitle="Choose the plan that matches your domain monitoring and portfolio needs."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(plan.highlight && 'border-blue-600 ring-1 ring-blue-600/20')}
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">{plan.name}</p>
                <p className="mt-4 text-4xl font-semibold text-foreground">{plan.price}</p>
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button fullWidth variant={plan.highlight ? 'primary' : 'secondary'}>
                {plan.highlight ? 'Most popular' : 'Select plan'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
