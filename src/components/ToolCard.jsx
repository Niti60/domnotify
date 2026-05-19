'use client';

import { motion } from 'framer-motion';
import Button from './Button';

export default function ToolCard({ icon: Icon, name, description, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 transition-colors">
          <Icon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {description}
        </p>

        {/* Arrow indicator */}
        <div className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
          Explore →
        </div>
      </div>
    </motion.div>
  );
}
