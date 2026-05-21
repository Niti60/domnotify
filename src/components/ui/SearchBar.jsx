'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export function SearchBar({ onSearch, placeholder = 'Search...', large = false }) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  };

  if (large) {
    return (
      <form onSubmit={handleSearch} className="relative">
        <div className="relative rounded-3xl border border-slate-200 bg-(--surface) px-4 py-3 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:border-white/10 dark:bg-slate-950 dark:focus-within:ring-blue-900/40">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full bg-transparent text-base text-slate-900 placeholder-slate-400 outline-none dark:text-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/95 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`flex items-center gap-3 rounded-3xl border px-4 py-3 transition-all duration-200 ${isFocused ? 'border-blue-500 ring-1 ring-blue-200 dark:ring-blue-900/50' : 'border-slate-200 dark:border-white/10'} bg-(--surface) dark:bg-slate-950`}>
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-white"
        />
      </div>
    </form>
  );
}
