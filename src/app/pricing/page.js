'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { pricingPlans } from '@/data/dummyData';

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Pricing"
        subtitle="Choose the plan that matches your domain monitoring and portfolio needs."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={`${plan.highlight ? 'border-blue-300 shadow-lg dark:border-blue-700' : ''}`}>
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{plan.name}</p>
                <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">{plan.price}</p>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-white" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button fullWidth>{plan.highlight ? 'Most popular' : 'Select plan'}</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
