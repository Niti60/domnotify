'use client';

import { motion } from 'framer-motion';
import Card from '@/components/Card';
import AnimatedNumber from '@/components/AnimatedNumber';
import { domainStats } from '@/data/domains';

export default function DomainStats() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Massive Scale, Real-time Data
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Powered by the world's largest domain intelligence network
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domainStats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                  ↑ {stat.trend}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
