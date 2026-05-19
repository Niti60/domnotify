'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Check, X } from 'lucide-react';

export default function DomainCard({
  domain,
  price,
  status,
  available = true,
  extra,
  details,
}) {
  const isAvailable = available === true || status === 'Available';
  const gradient = isAvailable
    ? 'from-green-500/20 to-emerald-500/20'
    : 'from-blue-500/20 to-cyan-500/20';
  const borderColor = isAvailable
    ? 'border-green-500/30'
    : 'border-blue-500/30';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br dark:bg-slate-900/50 ${gradient} border border-slate-200 dark:${borderColor} p-6 hover:shadow-xl transition-all`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-xl`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
              {domain}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {extra}
            </p>
          </div>
          {isAvailable ? (
            <div className="p-2 rounded-lg bg-green-500/20 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-400">
              <X className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Details */}
        {details && (
          <div className="mb-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            {details.map((detail, i) => (
              <div key={i} className="flex justify-between">
                <span>{detail.label}</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Price</p>
            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {price}
            </p>
          </div>
          <button className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 hover:bg-blue-500/20 transition-colors group-hover:translate-x-1 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
