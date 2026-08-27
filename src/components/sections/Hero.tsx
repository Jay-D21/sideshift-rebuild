'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Hero() {
  const { open: openRoleModal } = useRoleModal()
  const { userId } = useAuth()
  const router = useRouter()
  const [url, setUrl] = useState('')

  const handleLaunch = () => {
    if (!userId) {
      openRoleModal()
    } else if (url.trim()) {
      router.push('/dashboard/campaigns/new?url=' + encodeURIComponent(url.trim()))
    } else {
      openRoleModal()
    }
  }

  return (
    <section
      className="relative flex items-center pt-32 pb-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E0F5FF 0%, #F4FAFF 60%, #F8FCFF 100%)' }}
    >
      <div className="mx-auto max-w-6xl w-full">
        <div className="mx-auto max-w-[680px] text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex items-center justify-center gap-2 rounded-full border border-[rgba(32,32,32,0.1)] bg-white/60 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#3C83F9]" />
            <span className="text-[13px] font-medium tracking-wide text-[#202020]">Live — 3,000+ brands hiring creators today</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[48px] md:text-[68px] font-bold tracking-[-0.03em] text-[#202020] leading-[1.1]"
          >
            Get 50+ qualified creator applications in 24 hours
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[rgba(32,32,32,0.6)]"
          >
            Drop your website URL and AI builds your entire campaign in 60 seconds.
            Post a brief, set your budget, and let top UGC creators come to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 w-full"
          >
            <div className="mx-auto flex max-w-[540px] items-center rounded-full border border-[rgba(32,32,32,0.15)] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] p-1.5 pl-4">
              <Globe className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLaunch()}
                placeholder="Enter your website URL..."
                className="flex-1 bg-transparent px-3 text-[#202020] outline-none placeholder:text-[rgba(32,32,32,0.4)] text-[15px]"
              />
              <button
                onClick={handleLaunch}
                className="rounded-full bg-[#202020] px-5 py-2.5 text-[14px] font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Launch campaign
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[rgba(32,32,32,0.4)] text-center">
              ✨ AI scans your site and auto-generates a campaign brief in seconds
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-4 text-[13px] text-[rgba(32,32,32,0.4)]"
          >
            7 days free &middot; $0 today &middot; Cancel anytime
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <div className="flex">
              {[1, 2, 3, 4, 5].map((num, i) => (
                <div key={num} className={`relative h-7 w-7 rounded-full border-2 border-white overflow-hidden ${i !== 0 ? '-ml-2' : ''}`}>
                  <Image src={`https://picsum.photos/400/300?random=${num}`} alt={`Avatar ${num}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="text-[13px] font-medium text-[#202020]">
              Loved by 3,000+ top brands
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}