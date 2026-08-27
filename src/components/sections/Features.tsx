'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { Megaphone, Search, FileCheck, Wallet } from 'lucide-react'

const features = [
  {
    icon: Megaphone,
    title: 'Campaign Management',
    description:
      'Create and manage unlimited UGC campaigns from one dashboard. Track applications, submissions, and ROI in real time.',
  },
  {
    icon: Search,
    title: 'Creator Discovery',
    description:
      'Search 1M+ vetted creators by niche, audience size, engagement rate, and content style. Filter by platform.',
  },
  {
    icon: FileCheck,
    title: 'Content Review',
    description:
      'Review, request revisions, and approve content submissions without leaving the platform. Built-in feedback tools.',
  },
  {
    icon: Wallet,
    title: 'Seamless Payouts',
    description:
      'Pay creators instantly on approval. Automated contracts, invoicing, and tax forms. No wire transfers.',
  },
]

export default function Features() {
  return (
    <section className="py-20 px-4" style={{ background: '#F8FEFF' }}>
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-14">
          <span className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium tracking-wide text-[#202020]">
            Platform Features
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#202020] md:text-4xl">
            One Platform for All Your UGC Campaigns
          </h2>
          <p className="mt-3 text-[15px] leading-[145%] max-w-xl mx-auto" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Everything you need to run creator campaigns at scale — no spreadsheets, no back-and-forth.
          </p>
        </FadeUp>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <FadeUp key={feat.title} delay={i * 0.08} className="h-full">
                <div
                  className="flex h-full flex-col sm:flex-row gap-4 rounded-lg border border-gray-100 bg-white p-6 transition-transform hover:-translate-y-0.5"
                  style={{ boxShadow: '0 2px 12px rgba(32,32,32,0.05)' }}
                >
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0F5FF]">
                    <Icon className="h-5 w-5 text-[#3C83F9]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#202020] mb-1.5">{feat.title}</h3>
                    <p className="text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
                      {feat.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
