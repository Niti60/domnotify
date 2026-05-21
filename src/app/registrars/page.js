'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{registrar.popularity}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{registrar.name}</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-900 dark:bg-white/10 dark:text-white">{registrar.price}</div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{registrar.bestFor}</p>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {registrar.features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Button fullWidth>View plan</Button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-600 dark:text-slate-300">
            <thead className="border-b border-white/10 dark:border-white/10 text-slate-900 dark:text-white">
              <tr>
                <th className="px-4 py-4 text-left">Registrar</th>
                <th className="px-4 py-4 text-left">Price</th>
                <th className="px-4 py-4 text-left">Privacy</th>
                <th className="px-4 py-4 text-left">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {registrarCards.map((registrar) => (
                <tr key={registrar.name} className="hover:bg-white/5 dark:hover:bg-white/10 transition">
                  <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{registrar.name}</td>
                  <td className="px-4 py-4">{registrar.price}</td>
                  <td className="px-4 py-4">Included</td>
                  <td className="px-4 py-4">Email support</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
