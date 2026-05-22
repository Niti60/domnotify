'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export function SearchBar({ onSearch, placeholder = 'Search...', large = false }) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch?.(value.trim());
    }
  };

  const fieldClasses = cn(
    'flex items-center gap-3 rounded-lg border bg-background px-4 transition-colors duration-200',
    large ? 'py-3' : 'py-2',
    isFocused ? 'border-blue-600 ring-1 ring-blue-600/20' : 'border-border',
  );

  if (large) {
    return (
      <form onSubmit={handleSearch} className="relative">
        <div className={fieldClasses}>
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
          >
            Search
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={fieldClasses}>
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </form>
  );
}
