'use client';

import { motion } from 'framer-motion';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { registrars } from '@/data/domains';
import { Star } from 'lucide-react';

export default function RegistrarComparison() {
  const popularRegistrars = registrars.filter((r) => r.popular);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400"></span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Registrar Compare
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white"
        >
          Find Your Perfect Registrar
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
        >
          Compare pricing, features, and reviews from top domain registrars
        </motion.p>
      </div>

      {/* Registrars Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {popularRegistrars.map((registrar, i) => (
          <motion.div
            key={registrar.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="relative group border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-cyan-500/50">
              {registrar.popular && (
                <div className="absolute -top-3 left-4">
                  <Badge variant="gradient">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <p className="text-4xl mb-3">{registrar.logo}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {registrar.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {registrar.bestFor}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                  From
                </p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {registrar.price}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  per year
                </p>
              </div>

              <div className="mb-6 space-y-2">
                {registrar.features.map((feature, idx) => (
                  <p
                    key={idx}
                    className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {feature}
                  </p>
                ))}
              </div>

              <div className="mb-6 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <
                        Math.floor(registrar.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {registrar.rating}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  ({registrar.reviews} reviews)
                </span>
              </div>

              <Button fullWidth>Get Domain</Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button variant="outline">View All Registrars</Button>
      </motion.div>
    </section>
  );
}
