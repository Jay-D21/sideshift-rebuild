import { FadeUp } from '@/components/ui/fade-up'
import { Megaphone, Users, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    num: 1,
    icon: Megaphone,
    title: 'Post Your Brief',
    desc: 'Describe your campaign, set your budget per creator, and choose your target niche. Takes less than 5 minutes.',
  },
  {
    num: 2,
    icon: Users,
    title: 'Creators Apply to You',
    desc: 'Qualified creators from our vetted network discover your brief and pitch themselves. You receive 50+ applications in 24 hours.',
  },
  {
    num: 3,
    icon: CheckCircle2,
    title: 'Review, Hire & Pay',
    desc: 'Browse profiles, watch sample videos, hire your picks, and pay securely — all in one dashboard.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-[#FAFAFA]">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">How CreatorFlow works</h2>
          <p className="mt-3 text-[15px] leading-[145%] max-w-xl mx-auto" style={{ color: 'rgba(32,32,32,0.55)' }}>
            From brief to published content in days, not months.
          </p>
        </FadeUp>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Dashed connector line on desktop */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px border-t-2 border-dashed border-gray-200" />

          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center">
                {/* Numbered circle */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#E0F5FF] flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-lg font-bold text-[#202020]">{step.num}</span>
                </div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-[#202020]" />
                </div>
                <h3 className="text-lg font-bold text-[#202020] mb-2">{step.title}</h3>
                <p className="text-[14px] leading-[155%]" style={{ color: 'rgba(32,32,32,0.6)' }}>{step.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}