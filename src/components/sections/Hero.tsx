'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'
import Image from 'next/image'

const testimonials = [
  { quote: 'We got 60+ creator applications in under 12 hours.', highlight: '60+ creator applications', author: 'Sarah K., Brex' },
  { quote: 'The quality of UGC creators on CreatorFlow is unmatched.', highlight: 'quality of UGC creators', author: 'James M., Cursor' },
  { quote: 'Replaced our entire influencer agency in one week.', highlight: 'entire influencer agency', author: 'Priya L., Grammarly' },
]

function FloatingCard() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex-shrink-0"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#E0F5FF]">
          <Image src="/images/creator_maya.jpg" alt="Maya R." width={48} height={48} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#202020] leading-tight">Maya R. applied to your campaign</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="px-2 py-0.5 bg-[#E0F5FF] text-[#3C83F9] text-[10px] font-bold uppercase rounded-full">Beauty</span>
            <span className="px-2 py-0.5 bg-[#E0F5FF] text-[#3C83F9] text-[10px] font-bold uppercase rounded-full">UGC</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
        <span className="text-[11px] text-gray-400">2 min ago</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 text-xs font-bold py-2 rounded-lg bg-[#202020] text-white transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer">View Profile</button>
        <button className="flex-1 text-xs font-bold py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-150 cursor-pointer">Decline</button>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const { open: openRoleModal } = useRoleModal()

  useEffect(() => {
    const t = setInterval(() => setQuoteIndex(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const current = testimonials[quoteIndex]

  return (
    <section
      className="relative min-h-[92vh] flex items-center px-4 pt-20 pb-12 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)' }}
    >
      <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT: text content */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
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
            className="text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[58px] lg:text-[64px]"
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
            className="mt-5 max-w-lg text-[15px] leading-[145%] sm:text-lg"
            style={{ color: 'rgba(32,32,32,0.75)' }}
          >
            Post a brief, set your budget, and let the top UGC creators come to you.
            No cold outreach. No agencies. Just results.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex items-center gap-4"
          >
            <button
              onClick={openRoleModal}
              className="flex min-h-[54px] items-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-8 text-base font-bold leading-[140%] whitespace-nowrap transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
            >
              Launch my campaign <ArrowRight className="w-4 h-4" />
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

          {/* Rotating testimonial */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 w-full max-w-md"
          >
            <div className="relative h-14 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="text-[13px] text-[rgba(32,32,32,0.7)] leading-relaxed">
                    &ldquo;{current.quote.replace(current.highlight, '')}&rdquo;
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">{current.author}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-6 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {['/images/creator_maya.jpg', '/images/creator_james.jpg', '/images/creator_priya.jpg'].map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                  <Image src={src} alt="creator" width={32} height={32} className="w-full h-full object-cover" />
                </div>
              ))}
              {['D','E'].map((l, i) => (
                <div key={l} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white" style={{ background: ['#8b5cf6','#ef4444'][i] }}>{l}</div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className="text-[#f59e0b] text-sm">★</span>)}</div>
              <span className="text-[13px] font-medium text-[#202020]">Loved by 3,000+ brands</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: floating card - desktop only */}
        <div className="hidden md:flex items-center justify-center flex-shrink-0">
          <FloatingCard />
        </div>
      </div>
    </section>
  )
}