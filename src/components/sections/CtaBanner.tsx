'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CtaBanner() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="mx-auto max-w-3xl">
        <FadeUp className="flex flex-col items-center text-center">
          <div className="mb-5 rounded-full border border-gray-200 bg-[#E0F5FF] px-3.5 py-1.5">
            <span className="text-[13px] font-medium tracking-wide text-[#202020]">
              7 days, Unlimited Creators
            </span>
          </div>
          <h2 className="text-3xl font-bold text-[#202020] md:text-[44px] md:leading-[105%] md:tracking-[-0.03em]">
            Post a brief.
            <br />
            Creators apply to you.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.75)' }}>
            Join 3,000+ brands who run better creator campaigns with CreatorFlow.
            Start free — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-6 py-3 text-base font-bold leading-[140%] whitespace-nowrap transition-all active:scale-95 hover:opacity-90"
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-[rgba(32,32,32,0.18)] px-6 py-3 text-base font-bold text-[#202020] hover:bg-black/5 transition-colors"
            >
              Book a demo
            </Link>
          </div>
          <p className="mt-4 text-[12px] leading-tight" style={{ color: 'rgba(32,32,32,0.35)' }}>
            7 days free &middot; $0 today &middot; Cancel anytime
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
