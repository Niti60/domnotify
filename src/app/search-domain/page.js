'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { domainSearchResults, searchTlds } from '@/data/dummyData';

export default function SearchDomainPage() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    return domainSearchResults.filter((item) => item.domain.includes(query.toLowerCase().replace(/\s+/g, '')));
  }, [searched, query]);

  const handleSearch = (value) => {
    setQuery(value);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Search Domain"
        subtitle="Find available domains, compare registrar pricing, and discover smart alternatives."
        action={
          <div className="hidden sm:block">
            <Badge variant="info">Instant availability</Badge>
          </div>
        }
      />

      <Card className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">Type a keyword or brand name to search domain availability.</p>
          <SearchBar placeholder="example" onSearch={handleSearch} large />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {searchTlds.map((tld) => (
            <Badge key={tld} variant="neutral" className="justify-center">
              {tld}
            </Badge>
          ))}
        </div>
      </Card>

      {searched ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Search results</p>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{results.length} domains found</h2>
            </div>
            <Button variant="secondary">Refine search</Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {results.length > 0 ? (
              results.map((result) => (
                <Card key={result.domain} className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{result.domain}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{result.registrar}</p>
                    </div>
                    <Badge variant={result.available ? 'success' : 'neutral'}>{result.available ? 'Available' : 'Taken'}</Badge>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{result.price}</p>
                    <Button size="sm" variant={result.available ? 'primary' : 'secondary'} disabled={!result.available}>
                      {result.available ? 'Register' : 'View alternatives'}
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="rounded-3xl border-dashed border-white/10 text-center text-slate-500 dark:border-white/10 dark:text-slate-400">
                No matching domains were found for "{query}".
              </Card>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="Ready to find a domain"
          description="Start your search with a keyword and review availability across suggested registrars."
        />
      )}
    </div>
  );
}
