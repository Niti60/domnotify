'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBar({ onSearch, placeholder = 'Enter domain name...', large = false }) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value);
    }
  };

  if (large) {
    return (
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative max-w-2xl mx-auto"
      >
        <div className="relative group">
          <div className="relative rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-zinc-950 dark:border-zinc-800">
            <div className="flex items-center gap-3 px-6 py-4">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-lg font-medium placeholder-slate-400 dark:text-white outline-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all"
              >
                Search
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-zinc-950 border-2 transition-all ${
          isFocused
            ? 'border-blue-500 dark:border-cyan-500'
            : 'border-slate-200 dark:border-zinc-800'
        }`}
      >
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm placeholder-slate-400 dark:text-white outline-none"
        />
      </div>
    </form>
  );
}
