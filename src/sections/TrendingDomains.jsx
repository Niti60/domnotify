'use client';

import { motion } from 'framer-motion';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { trendingDomains } from '@/data/domains';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function TrendingDomains() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400"></span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Trending Now
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-2 text-slate-900 dark:text-white"
        >
          Hot Domains Today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-600 dark:text-slate-400"
        >
          Most searched and premium domains this week
        </motion.p>
      </div>

      {/* Domains Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {trendingDomains.map((domain) => (
          <motion.div key={domain.id} variants={item}>
            <Card className="group cursor-pointer hover:border-blue-500/50 dark:hover:border-cyan-500/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {domain.searches} searches
                  </p>
                </div>
                <Badge variant={domain.badge === 'Hot' ? 'danger' : 'gradient'}>
                  {domain.badge}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {domain.status}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {domain.price}
                  </p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 hover:bg-blue-500/20 transition-colors text-sm font-semibold">
                  View
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
