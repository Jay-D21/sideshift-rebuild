'use client'

import { FadeUp } from '@/components/ui/fade-up'
import Image from 'next/image'

const features = [
  {
    title: 'Campaign Management',
    description: 'Create and manage unlimited UGC campaigns from one dashboard.',
    img: '/images/feature_campaign.jpg'
  },
  {
    title: 'Creator Discovery',
    description: 'Search 1M+ vetted creators by niche, audience size, and content style.',
    img: '/images/feature_discovery.jpg'
  },
  {
    title: 'Content Review',
    description: 'Review, request revisions, and approve content submissions directly.',
    img: '/images/feature_review.jpg'
  },
  {
    title: 'Seamless Payouts',
    description: 'Pay creators instantly on approval with automated contracts and invoicing.',
    img: '/images/feature_payouts.jpg'
  },
]

export default function Features() {
  return (
    <section className="py-24 px-6 bg-[#F8FCFF]">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="text-center mb-16">
          <h2 className="text-[40px] md:text-[52px] font-bold tracking-[-0.03em] text-[#202020] leading-[1.1]">
            One Platform for UGC
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[rgba(32,32,32,0.6)] max-w-2xl mx-auto">
            Everything you need to run creator campaigns at scale.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feat, i) => (
            <FadeUp key={feat.title} delay={i * 0.1}>
              <div className="rounded-2xl bg-white border border-gray-100 p-8 flex flex-col overflow-hidden h-full min-h-[360px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="text-[18px] font-bold text-[#202020]">{feat.title}</h3>
                <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">{feat.description}</p>
                <div className="flex-1 mt-8 rounded-xl relative overflow-hidden shadow-sm border border-gray-100/50">
                   <Image src={feat.img} alt={feat.title} fill className="object-cover object-top" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}