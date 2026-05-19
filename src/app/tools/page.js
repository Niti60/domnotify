'use client';

import ToolCard from '@/components/ToolCard';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { powerTools } from '@/data/tools';
import { Zap } from 'lucide-react';

export default function ToolsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20">
              <Zap className="w-6 h-6 text-orange-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Power Tools
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Professional-grade tools for advanced domain analysis and security
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {powerTools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <ToolCard icon={tool.icon} name={tool.name} description={tool.description} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl border border-blue-200 dark:border-blue-800 p-8 mb-12 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Need Advanced Features?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Get API access, batch operations, and dedicated support with our Pro plan
          </p>
          <Button>Explore Pro Plan</Button>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 max-w-3xl">
            {[
              {
                q: "How often is the data updated?",
                a: "All domain data is updated in real-time, with DNS records checked every 6 hours.",
              },
              {
                q: "Can I automate these tools?",
                a: "Yes, our API allows you to automate all tools and integrate them into your workflows.",
              },
              {
                q: "Do you offer bulk operations?",
                a: "Pro users can check up to 10,000 domains per month using our batch operations.",
              },
              {
                q: "Is there a rate limit?",
                a: "Free tier has a rate limit of 50 requests/hour. Pro users have unlimited access.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
