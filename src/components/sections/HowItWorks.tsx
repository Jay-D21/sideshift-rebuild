'use client'

import { FadeUp } from '@/components/ui/fade-up'
import { FileText, Users, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: FileText,
    title: 'Post a Brief',
    description:
      'Describe your campaign, set your budget, and list your deliverables. Takes under 5 minutes.',
  },
  {
    step: '02',
    icon: Users,
    title: 'Creators Apply',
    description:
      'Qualified UGC creators with relevant audiences discover your brief and submit tailored applications.',
  },
  {
    step: '03',
    icon: CheckCircle,
    title: 'Review & Hire',
    description:
      'Browse applications, review creator profiles and past work, then hire the best fit in one click.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="text-center mb-14">
          <span className="rounded-full border border-gray-200 bg-[#E0F5FF] px-3.5 py-1.5 text-[13px] font-medium tracking-wide text-[#202020]">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl font-bold text-[#202020] md:text-4xl">
            How CreatorFlow Works for Brands
          </h2>
          <p className="mt-3 text-[15px] leading-[145%] max-w-xl mx-auto" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Stop chasing creators. Let them come to you.
          </p>
        </FadeUp>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeUp key={step.step} delay={i * 0.1}>
                <div className="relative flex flex-col rounded-lg border-2 border-white bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5" style={{ boxShadow: '0 2px 12px rgba(32,32,32,0.06)' }}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0F5FF]">
                      <Icon className="h-5 w-5 text-[#3C83F9]" />
                    </div>
                    <span className="text-[13px] font-medium tracking-wide" style={{ color: 'rgba(32,32,32,0.35)' }}>
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#202020] mb-2">{step.title}</h3>
                  <p className="text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
                    {step.description}
                  </p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
