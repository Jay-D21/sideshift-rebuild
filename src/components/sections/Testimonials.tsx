'use client'

import { FadeUp } from '@/components/ui/fade-up'
import Image from 'next/image'

const quotes = [
  {
    text: 'We ran a campaign with 12 creators in the first week. Content quality blew us away.',
    author: 'Priya L.',
    role: 'Brand Director, Grammarly',
    img: '/images/creator_priya.jpg',
    stars: 5,
  },
  {
    text: 'CreatorFlow replaced our entire outbound influencer process. Creators apply to us now.',
    author: 'James M.',
    role: 'Growth Lead, Cursor',
    img: '/images/creator_james.jpg',
    stars: 5,
  },
  {
    text: 'Within 24 hours we had 60+ applications from creators who matched our exact niche.',
    author: 'Sarah K.',
    role: 'Head of Marketing, Brex',
    img: '/images/creator_maya.jpg',
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section
      className="py-20 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg,#FFFFFF 0%,#E0F5FF 30%,#D0EDFF 50%,#E0F5FF 70%,#FFFFFF 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">Brands love CreatorFlow</h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Real results from real campaigns.
          </p>
        </FadeUp>

        <div className="flex flex-col md:flex-row items-end justify-center gap-6">
          {quotes.map((q, i) => {
            const isCenter = i === 1
            return (
              <FadeUp key={q.author} delay={i * 0.1}>
                <div
                  className={`relative overflow-hidden rounded-[2rem] border border-white/40 shadow-xl transition-transform duration-200 ${
                    isCenter ? 'scale-105 md:scale-110 z-10' : 'hover:-translate-y-1'
                  }`}
                  style={{ aspectRatio: '9/16', width: '200px', maxWidth: '220px' }}
                >
                  {/* Full-card creator photo */}
                  <Image
                    src={q.img}
                    alt={q.author}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Stars */}
                  <div className="absolute top-4 left-4 flex gap-0.5">
                    {Array.from({ length: q.stars }).map((_, si) => (
                      <span key={si} className="text-amber-400 text-xs">★</span>
                    ))}
                  </div>
                  {/* Glassmorphism quote box at bottom */}
                  <div className="absolute bottom-4 left-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3">
                    <p className="text-white text-[11px] leading-relaxed font-medium mb-2">&ldquo;{q.text}&rdquo;</p>
                    <div>
                      <div className="text-white text-[11px] font-bold">{q.author}</div>
                      <div className="text-white/70 text-[10px]">{q.role}</div>
                    </div>
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