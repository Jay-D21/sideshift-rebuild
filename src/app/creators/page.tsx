import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FadeUp } from '@/components/ui/fade-up'
import { CheckCircle, DollarSign, Search, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CreatorsPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-0">
        {/* Hero */}
        <section
          className="relative flex min-h-[75vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center"
          style={{
            background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)',
          }}
        >
          <FadeUp>
            <h1 className="mx-auto max-w-4xl text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[64px]">
              Earn money creating content for top brands
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-[15px] leading-[145%] sm:text-lg"
              style={{ color: 'rgba(32,32,32,0.75)' }}
            >
              Get paid to make TikToks, Reels, and Shorts for brands you love. 
              Keep 100% of your rate. No platform fees.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/signup/creator"
                className="flex items-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-8 py-4 text-base font-bold leading-[140%] whitespace-nowrap transition-all active:scale-95 hover:opacity-90"
              >
                Join Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-white">
          <div className="mx-auto max-w-5xl">
            <FadeUp className="text-center mb-14">
              <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">
                How it works for creators
              </h2>
            </FadeUp>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Search, title: 'Browse Jobs', desc: 'Find hundreds of new campaign briefs posted daily by top brands.' },
                { icon: Star, title: 'Create Content', desc: 'Shoot the content from your phone following the brand\'s creative guidelines.' },
                { icon: DollarSign, title: 'Get Paid', desc: 'Get paid directly to your bank account within 48 hours of approval.' },
              ].map((step, i) => {
                const Icon = step.icon
                return (
                  <FadeUp key={step.title} delay={i * 0.1}>
                    <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0F5FF]">
                        <Icon className="h-6 w-6 text-[#3C83F9]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#202020] mb-2">{step.title}</h3>
                      <p className="text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
                        {step.desc}
                      </p>
                    </div>
                  </FadeUp>
                )
              })}
            </div>
          </div>
        </section>

        {/* Earnings */}
        <section className="py-20 px-4 bg-[#F8FEFF]">
          <div className="mx-auto max-w-5xl text-center">
            <FadeUp>
              <h2 className="text-3xl font-bold text-[#202020] md:text-4xl mb-4">
                Creators earn $200-$2,000 per campaign
              </h2>
              <p className="text-[15px] max-w-2xl mx-auto mb-10" style={{ color: 'rgba(32,32,32,0.55)' }}>
                Set your own rates. No negotiation needed. Here is what active creators earned last month.
              </p>
            </FadeUp>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { name: 'Jessica T.', niche: 'Beauty', earnings: '$4,500' },
                { name: 'David M.', niche: 'Tech', earnings: '$6,200' },
                { name: 'Sarah K.', niche: 'Lifestyle', earnings: '$3,800' },
              ].map((creator, i) => (
                <FadeUp key={creator.name} delay={i * 0.1}>
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="font-bold text-[#202020] text-lg">{creator.name}</div>
                    <div className="text-[13px] text-gray-500 mb-4">{creator.niche} Creator</div>
                    <div className="text-3xl font-bold text-emerald-600">{creator.earnings}</div>
                    <div className="text-[12px] text-gray-400 uppercase tracking-wider mt-1">Last 30 Days</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { quote: "I replaced my full-time income in 3 months just doing UGC on CreatorFlow. The brands are amazing and payouts are super fast.", author: "Emily R.", handle: "@emilycreates" },
                { quote: "Finally a platform that respects creators. No agency fees taking 20% of my cut. What I bid is exactly what I get paid.", author: "James W.", handle: "@jamesugc" },
              ].map((t, i) => (
                <FadeUp key={t.author} delay={i * 0.1}>
                  <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                    <p className="text-lg text-[#202020] italic mb-6">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                        {t.author[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[#202020]">{t.author}</div>
                        <div className="text-sm text-gray-500">{t.handle}</div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-2xl text-center">
            <FadeUp>
              <h2 className="text-3xl font-bold text-[#202020] md:text-5xl mb-6">
                Join 1M+ creators
              </h2>
              <Link
                href="/signup/creator"
                className="inline-flex items-center gap-2 rounded-full bg-[#202020] text-white px-8 py-4 text-lg font-bold transition-all hover:opacity-90 hover:scale-105"
              >
                Start earning today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
