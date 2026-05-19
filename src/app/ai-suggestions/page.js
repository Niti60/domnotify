'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check } from 'lucide-react';

export default function AISuggestionsPage() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const aiSuggestions = [
    {
      domain: 'nexthub.ai',
      availability: 'premium',
      price: '$1,299',
      relevance: 95,
    },
    {
      domain: 'quantum.dev',
      availability: 'available',
      price: '$45/year',
      relevance: 88,
    },
    {
      domain: 'echosphere.io',
      availability: 'premium',
      price: '$2,500',
      relevance: 82,
    },
    {
      domain: 'synthed.ai',
      availability: 'available',
      price: '$39/year',
      relevance: 79,
    },
  ];

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setSuggestions(aiSuggestions);
      setIsLoading(false);
    }, 2000);
  };

  const copyDomain = (domain) => {
    navigator.clipboard.writeText(domain);
    setCopied(domain);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Sparkles className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              AI Domain Suggestions
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Let AI generate creative domain names based on your ideas
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <form onSubmit={handleGenerate}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Describe your business or idea
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A AI-powered platform for real-time analytics and data processing..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isLoading || !prompt.trim()}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Suggestions
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Suggestions */}
        {suggestions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              AI Generated Suggestions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="group hover:border-blue-500/50 dark:hover:border-cyan-500/50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                          {suggestion.domain}
                        </h3>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <Badge variant={suggestion.availability === 'available' ? 'success' : 'gradient'}>
                            {suggestion.availability === 'available'
                              ? '✓ Available'
                              : 'Premium'}
                          </Badge>
                          <Badge variant="purple">
                            {suggestion.relevance}% match
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Price
                      </p>
                      <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        {suggestion.price}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        fullWidth
                        onClick={() => copyDomain(suggestion.domain)}
                      >
                        {copied === suggestion.domain ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button size="sm" fullWidth>
                        Register
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!suggestions && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Fill in the form above to get AI-powered domain suggestions
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
