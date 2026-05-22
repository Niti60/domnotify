'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { motion } from 'framer-motion';
import { Copy, Download, Share2, Globe } from 'lucide-react';

export default function WhoisPage() {
  const [whoisData, setWhoisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const sampleWhoisData = {
    domain: 'example.com',
    registrar: 'VeriSign Global Registry Services',
    createdDate: '1995-08-01',
    updatedDate: '2024-01-15',
    expiryDate: '2025-08-01',
    nameServers: [
      'ns1.example.com',
      'ns2.example.com',
      'ns3.example.com',
      'ns4.example.com',
    ],
    status: 'clientTransferProhibited',
    registrant: {
      name: 'Example Registrant',
      organization: 'Example Organization',
      country: 'US',
    },
  };

  const handleSearch = (domain) => {
    setIsLoading(true);
    setTimeout(() => {
      setWhoisData({ ...sampleWhoisData, domain });
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(whoisData, null, 2);
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-900 dark:bg-zinc-900 dark:text-slate-100">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              WHOIS Checker
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Lookup comprehensive domain registration and ownership information
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <SearchBar onSearch={handleSearch} placeholder="Enter domain to lookup..." />
        </motion.div>

        {/* Results */}
        {whoisData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 mb-8">
              {/* Terminal style header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10 dark:border-white/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <code className="text-sm text-slate-600 dark:text-slate-400">
                  whois {whoisData.domain}
                </code>
              </div>

              {/* Whois data */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Domain
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {whoisData.domain}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Registrar
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {whoisData.registrar}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Created Date
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {whoisData.createdDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Expiry Date
                    </p>
                    <Badge variant="success">{whoisData.expiryDate}</Badge>
                  </div>
                </div>

                {/* Name servers */}
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Name Servers
                  </p>
                  <div className="space-y-2 bg-slate-900/50 dark:bg-slate-950 p-4 rounded-lg">
                    {whoisData.nameServers.map((ns, i) => (
                      <code
                        key={i}
                        className="block text-sm text-slate-300 font-mono"
                      >
                        {ns}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Registrant info */}
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Registrant Information
                  </p>
                  <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Name:
                      </span>{' '}
                      {whoisData.registrant.name}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Organization:
                      </span>{' '}
                      {whoisData.registrant.organization}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Country:
                      </span>{' '}
                      {whoisData.registrant.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
