'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { registrarCards } from '@/data/dummyData';

export default function RegistrarsPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Registrars"
        subtitle="Compare registrar renewal pricing, privacy features, and transfer readiness."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {registrarCards.map((registrar) => (
          <Card key={registrar.name} className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                  {registrar.popularity}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{registrar.name}</h2>
              </div>
              <div className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground">
                {registrar.price}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{registrar.bestFor}</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              {registrar.features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button
              fullWidth
              onClick={() => window.open(registrar.url, '_blank', 'noopener,noreferrer')}
            >
              View plan
            </Button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-muted-foreground">
            <thead className="border-b border-border text-foreground">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">Registrar</th>
                <th className="px-4 py-4 text-left font-semibold">Price</th>
                <th className="px-4 py-4 text-left font-semibold">Privacy</th>
                <th className="px-4 py-4 text-left font-semibold">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {registrarCards.map((registrar) => (
                <tr
                  key={registrar.name}
                  className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <td className="px-4 py-4 font-semibold text-foreground">{registrar.name}</td>
                  <td className="px-4 py-4">{registrar.price}</td>
                  <td className="px-4 py-4">Included</td>
                  <td className="px-4 py-4">{registrar.supportEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
