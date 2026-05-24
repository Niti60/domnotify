'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetch, statusToVariant } from '@/lib/apiClient';
import { Eye } from 'lucide-react';

export default function WatchlistPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    domainName: '',
    registrar: '',
    expiryDate: '',
    renewalPrice: '',
  });

  const loadWatchlist = useCallback(() => {
    setLoading(true);
    apiFetch('/api/watchlist')
      .then((res) => setDomains(res.domains || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await apiFetch('/api/watchlist', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({ domainName: '', registrar: '', expiryDate: '', renewalPrice: '' });
      setShowForm(false);
      loadWatchlist();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this domain from your watchlist?')) return;
    try {
      await apiFetch(`/api/watchlist/${id}`, { method: 'DELETE' });
      setDomains((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Watchlist"
        subtitle="Track domains you want to monitor closely."
        action={
          <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : 'Add domain'}
          </Button>
        }
      />

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Domain name"
              placeholder="example.com"
              value={form.domainName}
              onChange={(e) => setForm({ ...form, domainName: e.target.value })}
              required
            />
            <Input
              label="Registrar"
              placeholder="Namecheap"
              value={form.registrar}
              onChange={(e) => setForm({ ...form, registrar: e.target.value })}
            />
            <Input
              label="Expiry date"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
            <Input
              label="Renewal price"
              placeholder="12.99"
              value={form.renewalPrice}
              onChange={(e) => setForm({ ...form, renewalPrice: e.target.value })}
            />
            {formError && <p className="text-sm text-destructive sm:col-span-2">{formError}</p>}
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Adding…' : 'Add to watchlist'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Unified list of your tracked domains and statuses.
          </p>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : domains.length === 0 ? (
          <EmptyState
            icon={Eye}
            title="Your watchlist is empty"
            description="Add a domain to start tracking expiry dates and status."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Domain</th>
                  <th className="px-4 py-3 font-semibold">Registrar</th>
                  <th className="px-4 py-3 font-semibold">Expiry date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {domains.map((row) => {
                  const expired = row.status === 'Expired';
                  return (
                    <tr
                      key={row._id}
                      className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-foreground">{row.domain}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.registrar}</td>
                      <td className="px-4 py-4 text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{row.expiry}</span>
                          {expired && (
                            <span className="mt-1 text-xs font-medium text-destructive">
                              Already expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge variant={statusToVariant(row.status)}>{row.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleRemove(row._id)}
                          className={`text-sm font-medium transition-colors underline-offset-4 hover:underline ${
                            expired
                              ? 'text-destructive'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
