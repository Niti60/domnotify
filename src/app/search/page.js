'use client';

import { useState, Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import DomainCard from '@/components/DomainCard';
import Button from '@/components/Button';
import Skeleton, { SkeletonCard } from '@/components/Skeleton';
import { motion } from 'framer-motion';

function SearchResults({ query }) {
  const [isLoading, setIsLoading] = useState(false);

  const results = [
    {
      domain: 'nexthub.ai',
      price: '$1,299',
      available: true,
      extra: 'Premium domain',
      details: [
        { label: 'Domain Age', value: '2 years' },
        { label: 'Registrar', value: 'Namecheap' },
        { label: 'SSL', value: 'Active' },
      ],
    },
    {
      domain: 'quantum.dev',
      price: '$2,950',
      available: true,
      extra: 'Tech startup',
      details: [
        { label: 'Domain Age', value: '1 year' },
        { label: 'Registrar', value: 'Google Domains' },
        { label: 'SSL', value: 'Active' },
      ],
    },
    {
      domain: 'cloudify.io',
      price: '$899',
      available: false,
      extra: 'Cloud services',
      details: [
        { label: 'Domain Age', value: '3 years' },
        { label: 'Registrar', value: 'GoDaddy' },
        { label: 'SSL', value: 'Active' },
      ],
    },
  ];

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <DomainCard {...result} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Domain Search
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Search for domain availability and get detailed information
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <SearchBar onSearch={setSearchQuery} placeholder="Search domains..." />
        </motion.div>

        {/* Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Results for "{searchQuery}"
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Found 3 relevant results
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <SearchResults query={searchQuery} />
            </Suspense>
          </motion.div>
        )}

        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Start searching for domains to see results
            </p>
            <Button>Try a Search</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
