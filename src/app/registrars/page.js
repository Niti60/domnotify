'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import { motion } from 'framer-motion';
import { registrars } from '@/data/domains';
import { Check, Star, TrendingUp } from 'lucide-react';

export default function RegistrarsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20">
              <TrendingUp className="w-6 h-6 text-pink-600 dark:text-rose-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Registrar Comparison
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Compare prices, features, and ratings from leading domain registrars
          </p>
        </motion.div>

        {/* Filter/Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-12 flex-wrap"
        >
          <Button variant="secondary" size="sm">All Registrars</Button>
          <Button variant="ghost" size="sm">Best Price</Button>
          <Button variant="ghost" size="sm">Best Rated</Button>
          <Button variant="ghost" size="sm">Best Support</Button>
        </motion.div>

        {/* Registrars Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {registrars.map((registrar) => (
            <motion.div key={registrar.id} variants={item}>
              <Card className="relative group border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-cyan-500/50">
                {registrar.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge variant="gradient">Most Popular</Badge>
                  </div>
                )}

                {/* Logo and Name */}
                <div className="mb-6">
                  <p className="text-4xl mb-3">{registrar.logo}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {registrar.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {registrar.bestFor}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    From
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    {registrar.price}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    per year
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  {registrar.features.map((feature, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </p>
                  ))}
                </div>

                {/* Rating */}
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(registrar.rating)
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
                    ({registrar.reviews})
                  </span>
                </div>

                {/* CTA */}
                <Button fullWidth>Get Domain</Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-4 px-4 font-bold text-slate-900 dark:text-white">
                    Registrar
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">
                    Pricing
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">
                    WHOIS Privacy
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">
                    SSL Certificate
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-slate-900 dark:text-white">
                    Support
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrars.slice(0, 4).map((registrar) => (
                  <tr
                    key={registrar.id}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-slate-900 dark:text-white font-semibold">
                      {registrar.name}
                    </td>
                    <td className="py-4 px-4 text-center text-blue-600 dark:text-cyan-400 font-bold">
                      {registrar.price}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Star className="w-5 h-5 text-yellow-500 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
