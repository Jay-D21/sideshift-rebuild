'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'

const testimonials = [
  {
    quote: 'We got 60+ creator applications in under 12 hours.',
    highlight: '60+ creator applications',
    author: 'Sarah K., Head of Marketing at Brex',
  },
  {
    quote: 'The quality of UGC creators on CreatorFlow is unmatched.',
    highlight: 'quality of UGC creators',
    author: 'James M., Cursor Growth Team',
  },
  {
    quote: 'Replaced our entire influencer agency in one week.',
    highlight: 'entire influencer agency',
    author: 'Priya L., Brand Director at Grammarly',
  },
]

function FloatingCard() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          M
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#202020] truncate">Maya R. applied to your campaign</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">Beauty</span>
            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded">UGC</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
        <span className="text-[11px] text-gray-400">2 min ago</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <button className="flex-1 text-xs font-bold py-1.5 rounded-lg bg-[#202020] text-white transition-all hover:opacity-90 cursor-pointer">View Profile</button>
        <button className="flex-1 text-xs font-bold py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Decline</button>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const { open: openRoleModal } = useRoleModal()

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(i => (i + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const current = testimonials[quoteIndex]

  return (
    <section
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)' }}
    >
      <FloatingCard />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#3C83F9]" />
        <span className="text-[13px] font-medium tracking-wide text-[#202020]">Live — 3,000+ brands hiring creators today</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mx-auto max-w-4xl text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[64px]"
      >
        Get 50+ qualified creator applications{' '}
        <span className="relative inline-block">
          <span className="relative z-10">for your brand</span>
          <span className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded" style={{ background: '#fdf1c7' }} />
        </span>
        {' '}in 24 hours
      </motion.h1>

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

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <button
          onClick={openRoleModal}
          className="flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-8 text-base font-bold leading-[140%] whitespace-nowrap transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
        >
          Launch my campaign
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-3 text-[12px] leading-tight"
        style={{ color: 'rgba(32,32,32,0.35)' }}
      >
        7 days free &middot; $0 today &middot; Cancel anytime
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="relative h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <p className="text-[13px] text-[rgba(32,32,32,0.7)] leading-relaxed">
                &ldquo;{current.quote.split(current.highlight).map((part, i) =>
                  i === 0
                    ? <span key={i}>{part}<mark className="bg-[#fdf1c7] text-[#202020] not-italic px-0.5 rounded-sm">{current.highlight}</mark></span>
                    : <span key={i}>{part}</span>
                )}&rdquo;
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">{current.author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-6 flex items-center justify-center gap-3"
      >
        <div className="flex -space-x-2">
          {['A','B','C','D','E'].map((letter, i) => (
            <div key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
              style={{ background: ['#3C83F9','#10b981','#f59e0b','#8b5cf6','#ef4444'][i] }}>
              {letter}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className="text-[#f59e0b] text-sm">★</span>)}</div>
          <span className="text-[13px] font-medium text-[#202020]">Loved by 3,000+ brands</span>
        </div>
      </motion.div>
    </section>
  )
}