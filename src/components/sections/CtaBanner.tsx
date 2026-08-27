'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { ArrowRight } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'

export default function CtaBanner() {
  const { open: openRoleModal } = useRoleModal()
  return (
    <section className="py-24 px-4 bg-[#202020] relative overflow-hidden">
      {/* Blue radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(60,131,249,0.15), transparent 70%)' }}
      />
      <div className="mx-auto max-w-3xl relative z-10">
        <FadeUp className="flex flex-col items-center text-center">
          <div className="mb-5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5">
            <span className="text-[13px] font-medium tracking-wide text-white">7 days, Unlimited Creators</span>
          </div>
          <h2 className="text-3xl font-bold text-white md:text-[44px] md:leading-[105%] md:tracking-[-0.03em]">
            Post a brief.<br />Creators apply to you.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-[145%] text-white/70">
            Join 3,000+ brands who run better creator campaigns with CreatorFlow.
            Start free — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={openRoleModal}
              className="flex items-center gap-2 rounded-full bg-white text-[#202020] px-6 py-3 text-base font-bold leading-[140%] whitespace-nowrap transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </button>
            <a href="/demo" className="rounded-full border border-white/30 px-6 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors duration-150">
              Book a demo
            </a>
          </div>
          <p className="mt-4 text-[12px] leading-tight text-white/40">
            7 days free &middot; $0 today &middot; Cancel anytime
          </p>
        </FadeUp>
      </div>
    </section>
  )
}