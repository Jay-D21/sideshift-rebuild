'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const [email, setEmail] = useState('')

  return (
    <section
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center"
      style={{
        background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)',
      }}
    >
      {/* Live badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#3C83F9]" />
        <span className="text-[13px] font-medium tracking-wide text-[#202020]">
          Live — 3,000+ brands hiring creators today
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mx-auto max-w-4xl text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[64px]"
      >
        Get 50+ qualified creator applications{' '}
        <span className="relative inline-block">
          <span className="relative z-10">for your brand</span>
          <span
            className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded"
            style={{ background: '#fdf1c7' }}
          />
        </span>
        {' '}in 24 hours
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-5 max-w-xl text-[15px] leading-[145%] sm:text-lg"
        style={{ color: 'rgba(32,32,32,0.75)' }}
      >
        Post a brief, set your budget, and let the top UGC creators come to you.
        No cold outreach. No agencies. Just results.
      </motion.p>

      {/* Input + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          className="min-h-[54px] flex-1 rounded-full border border-[rgba(32,32,32,0.18)] bg-white px-5 text-[16px] text-[#202020] shadow-[0_1px_2px_rgba(32,32,32,0.05)] outline-none placeholder:text-[rgba(32,32,32,0.4)] focus:border-[rgba(32,32,32,0.4)]"
        />
        <button
          className="flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-6 text-base font-bold leading-[140%] whitespace-nowrap transition-all active:scale-95 hover:opacity-90 cursor-pointer"
        >
          Launch my campaign
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Fine print */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-3 text-[12px] leading-tight"
        style={{ color: 'rgba(32,32,32,0.35)' }}
      >
        7 days free &middot; $0 today &middot; Cancel anytime
      </motion.p>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-3"
      >
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
            <div
              key={letter}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
              style={{
                background: ['#3C83F9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i],
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className="text-[#f59e0b] text-sm">★</span>
            ))}
          </div>
          <span className="text-[13px] font-medium text-[#202020]">
            Loved by 3,000+ brands
          </span>
        </div>
      </motion.div>
    </section>
  )
}
