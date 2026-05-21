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
          <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 dark:opacity-25"></div>
          <div className="relative bg-(--surface) dark:bg-slate-950 rounded-2xl shadow-2xl">
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
                className="hidden sm:flex items-center gap-2 px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
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
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-(--surface) dark:bg-slate-950 border-2 transition-all ${
          isFocused
            ? 'border-blue-500 dark:border-cyan-500'
            : 'border-white/10 dark:border-white/10'
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
