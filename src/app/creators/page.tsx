'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FadeUp } from '@/components/ui/fade-up'
import { ArrowRight, DollarSign, Zap, Clock, CreditCard, Star } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'
import Image from 'next/image'

const features = [
  { icon: DollarSign, title: 'Choose Your Niches', desc: 'Tell us what you create — Tech, Beauty, Fitness, Gaming, and more. We surface campaigns that match your style.' },
  { icon: Zap, title: 'Set Your Rate', desc: 'You control your pricing. Set a minimum per-video rate and only see campaigns that meet your threshold.' },
  { icon: Clock, title: 'Apply in Minutes', desc: 'Browse active campaigns, write a quick pitch, and hit Apply. No lengthy onboarding. No gatekeeping.' },
  { icon: CreditCard, title: 'Get Paid Fast', desc: 'Once your content is approved, payment is released automatically. No chasing invoices. No net-30 delays.' },
]

const steps = [
  { num: 1, title: 'Browse Jobs', desc: 'Filter campaigns by niche, rate, and brand. Apply to the ones that excite you.' },
  { num: 2, title: 'Create Content', desc: 'Make your best video following the brief. Submit for review directly in the app.' },
  { num: 3, title: 'Get Paid', desc: 'Payment releases automatically when your content is approved. No delays.' },
]

export default function CreatorsPage() {
  const { open: openRoleModal } = useRoleModal()

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        {/* Hero */}
        <section
          className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center"
          style={{ background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)' }}
        >
          <FadeUp>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#3C83F9]" />
              <span className="text-[13px] font-medium text-[#202020]">1,000,000+ creators earning monthly</span>
            </div>
            <h1 className="mx-auto max-w-4xl text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[64px] mt-4">
              Earn{' '}
              <span className="relative inline-block">
                <span className="relative z-10">$200&ndash;$2,000</span>
                <span className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded" style={{ background: '#fdf1c7' }} />
              </span>
              {' '}per campaign
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[145%] sm:text-lg" style={{ color: 'rgba(32,32,32,0.75)' }}>
              Get paid to make TikToks, Reels, and Shorts for brands you love. Keep 100% of your rate. No platform fees.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={openRoleModal}
                className="flex items-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-8 py-4 text-base font-bold leading-[140%] whitespace-nowrap transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
              >
                Join Free <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </FadeUp>

          {/* Creator collage */}
          <FadeUp delay={0.2} className="mt-12 flex items-end justify-center gap-4">
            {['/images/creator_maya.jpg','/images/creator_james.jpg','/images/creator_priya.jpg'].map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl border-2 border-white shadow-lg ${ i === 1 ? 'h-48 w-36' : 'h-36 w-28' }`}>
                <Image src={src} alt="Creator" fill className="object-cover" />
              </div>
            ))}
          </FadeUp>
        </section>

        {/* Earnings stats */}
        <section className="py-12 px-4 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: '$200–$2,000', label: 'Per campaign' },
                { value: '1M+', label: 'Active creators' },
                { value: '$100M+', label: 'Paid out to date' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-bold text-[#202020]">{s.value}</div>
                  <div className="text-sm mt-1" style={{ color: 'rgba(32,32,32,0.55)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-[#FAFAFA]">
          <div className="mx-auto max-w-4xl">
            <FadeUp className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#202020]">How it works for creators</h2>
            </FadeUp>
            <div className="relative grid md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t-2 border-dashed border-gray-200" />
              {steps.map((step, i) => (
                <FadeUp key={step.num} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#E0F5FF] flex items-center justify-center mb-6 shadow-sm">
                      <span className="text-lg font-bold text-[#202020]">{step.num}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#202020] mb-2">{step.title}</h3>
                    <p className="text-[14px] leading-[155%]" style={{ color: 'rgba(32,32,32,0.6)' }}>{step.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-white">
          <div className="mx-auto max-w-5xl">
            <FadeUp className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#202020]">Everything you need to earn</h2>
            </FadeUp>
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="w-10 h-10 rounded-xl bg-[#E0F5FF] flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-[#202020]" />
                    </div>
                    <h3 className="text-base font-bold text-[#202020] mb-1.5">{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(32,32,32,0.6)' }}>{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 px-4 bg-[#FAFAFA]">
          <div className="mx-auto max-w-2xl">
            <FadeUp>
              <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="text-[80px] font-bold text-[#E0F5FF] leading-none absolute top-2 left-6 select-none">&ldquo;</div>
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[16px] leading-[165%] italic text-[#202020] relative z-10 pt-2">
                  I made $1,400 in my first month on CreatorFlow. The brands are real, the briefs are clear, and payment hit my account within 48 hours of approval.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                    <Image src="/images/creator_maya.jpg" alt="Alicia T." width={40} height={40} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#202020]">Alicia T.</div>
                    <div className="text-xs" style={{ color: 'rgba(32,32,32,0.55)' }}>Beauty & Lifestyle Creator, 80K followers</div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-[#202020] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(60,131,249,0.15), transparent 70%)' }} />
          <div className="mx-auto max-w-xl text-center relative z-10">
            <FadeUp>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Join 1M+ creators earning on CreatorFlow</h2>
              <p className="mt-4 text-white/70 text-[15px] leading-relaxed">Free to join. No platform fees. Get paid for content you love making.</p>
              <button
                onClick={openRoleModal}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-[#202020] px-8 py-4 text-base font-bold transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
              >
                Get started free <ArrowRight className="w-5 h-5" />
              </button>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}