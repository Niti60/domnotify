'use client';

import { useState } from 'react';
import Hero from '@/sections/Hero';
import ToolsGrid from '@/sections/ToolsGrid';
import TrendingDomains from '@/sections/TrendingDomains';
import DomainStats from '@/sections/DomainStats';
import RegistrarComparison from '@/sections/RegistrarComparison';
import PowerToolsSection from '@/sections/PowerToolsSection';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Would navigate to search page in a real app
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="w-full">
      <Hero onSearch={handleSearch} />
      <DomainStats />
      <ToolsGrid />
      <TrendingDomains />
      <RegistrarComparison />
      <PowerToolsSection />
    </div>
  );
}
