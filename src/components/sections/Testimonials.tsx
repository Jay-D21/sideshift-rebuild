'use client'

import { FadeUp } from '@/components/ui/fade-up'
import Image from 'next/image'

export default function Testimonials() {
  return (
    <section
      className="py-24 px-6 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#F8FCFF 0%,#E8F5FF 40%,#DCF0FF 50%,#E8F5FF 60%,#F8FCFF 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center mb-16">
          <h2 className="text-[40px] md:text-[52px] font-bold tracking-[-0.03em] text-[#202020] leading-[1.1]">
            Brands love CreatorFlow
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[rgba(32,32,32,0.6)] max-w-2xl mx-auto">
            Real results from real campaigns across the globe.
          </p>
        </FadeUp>

        <div className="relative h-[480px] w-full max-w-4xl mx-auto flex items-center justify-center">
          {/* Left Card */}
          <div className="absolute z-10 w-[200px] h-[360px] rounded-[24px] overflow-hidden opacity-50 scale-[0.85] -translate-x-[180px] md:-translate-x-[220px] shadow-lg">
            <Image src="/images/creator_priya.jpg" alt="Priya" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs font-medium mb-2 opacity-80 leading-relaxed">&ldquo;Quality blew us away.&rdquo;</p>
              <div className="text-white text-xs font-bold">Priya L.</div>
            </div>
          </div>

          {/* Center Card */}
          <div className="absolute z-20 w-[260px] h-[420px] rounded-[24px] overflow-hidden ring-4 ring-white/80 shadow-2xl">
            <Image src="/images/creator_maya.jpg" alt="Maya" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4 flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-amber-400 text-sm">★</span>)}
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4">
              <p className="text-white text-[13px] leading-relaxed font-medium mb-3">
                &ldquo;Within 24 hours we had 60+ applications from creators who matched our exact niche.&rdquo;
              </p>
              <div>
                <div className="text-white text-[12px] font-bold">Sarah K.</div>
                <div className="text-white/70 text-[11px]">Head of Marketing, Brex</div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="absolute z-10 w-[200px] h-[360px] rounded-[24px] overflow-hidden opacity-50 scale-[0.85] translate-x-[180px] md:translate-x-[220px] shadow-lg">
            <Image src="/images/creator_james.jpg" alt="James" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs font-medium mb-2 opacity-80 leading-relaxed">&ldquo;Creators apply to us now.&rdquo;</p>
              <div className="text-white text-xs font-bold">James M.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}