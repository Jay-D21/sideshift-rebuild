'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { FadeUp } from '@/components/ui/fade-up'
import { Check, Info } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const tiers = [
  {
    name: 'Starter',
    price: { monthly: '$199', annual: '$1,910' },
    desc: 'Perfect for small brands running their first UGC campaigns.',
    features: [
      'Post 1 active campaign',
      'Receive up to 50 applications',
      'Basic creator filtering',
      'Standard email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    price: { monthly: '$399', annual: '$3,830' },
    desc: 'For growing brands scaling their content production.',
    features: [
      'Post up to 5 active campaigns',
      'Unlimited applications',
      'Advanced creator search & filters',
      'Content revision requests',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Scale',
    price: { monthly: '$999', annual: '$9,590' },
    desc: 'For enterprises and agencies managing multiple brands.',
    features: [
      'Unlimited campaigns',
      'Unlimited applications',
      'Dedicated account manager',
      'Custom contracting & invoicing',
      'API access (coming soon)',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes, all plans are month-to-month and can be canceled at any time from your billing dashboard. No hidden cancellation fees.',
  },
  {
    q: 'Do you charge a fee on creator payouts?',
    a: 'No! Unlike other platforms that take a 20% cut of what you pay creators, CreatorFlow charges 0% commission on creator payouts. The subscription fee is your only cost.',
  },
  {
    q: 'What happens if I need a revision?',
    a: 'Growth and Scale plans include built-in revision requests. If a creator misses the brief, you can request edits directly through the platform before releasing payment.',
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { open: openRoleModal } = useRoleModal()

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-24 pb-20 bg-white">
        
        {/* Header */}
        <section className="px-4 text-center max-w-3xl mx-auto mb-12">
          <FadeUp>
            <h1 className="text-4xl md:text-6xl font-bold text-[#202020] tracking-tight mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg" style={{ color: 'rgba(32,32,32,0.75)' }}>
              No platform fees on creator payouts. Pay a flat rate and scale your UGC production.
            </p>
          </FadeUp>
        </section>

        {/* Toggle */}
        <section className="flex justify-center mb-16">
          <FadeUp>
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-[#202020]' : 'text-gray-500'}`}>Monthly</span>
              <button 
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#202020] transition-colors"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${isAnnual ? 'text-[#202020]' : 'text-gray-500'}`}>
                Annually <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Save 20%</span>
              </span>
            </div>
          </FadeUp>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 max-w-6xl mx-auto mb-24 w-full">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {tiers.map((tier, i) => (
              <FadeUp key={tier.name} delay={i * 0.1} className="h-full">
                <div className={`relative flex flex-col h-full bg-white rounded-2xl p-8 border ${tier.popular ? 'border-[#202020] shadow-xl' : 'border-gray-200 shadow-sm'}`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#202020] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-[#202020] mb-2">{tier.name}</h3>
                  <p className="text-sm h-10 mb-6" style={{ color: 'rgba(32,32,32,0.55)' }}>{tier.desc}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-[#202020]">
                      {isAnnual ? tier.price.annual : tier.price.monthly}
                    </span>
                    <span className="text-gray-500">
                      {isAnnual ? '/yr' : '/mo'}
                    </span>
                  </div>
                  <button
                    onClick={openRoleModal}
                    className={`block text-center w-full rounded-full py-3 font-bold transition-all ${
                      tier.popular 
                        ? 'bg-[#202020] text-white hover:bg-black/80' 
                        : 'bg-gray-50 text-[#202020] border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {tier.cta}
                  </button>
                  
                  <div className="mt-8 flex-1">
                    <p className="text-sm font-bold text-[#202020] mb-4">What's included:</p>
                    <ul className="space-y-3">
                      {tier.features.map(f => (
                        <li key={f} className="flex gap-3 text-sm text-[#202020]">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Creator Pro */}
        <section className="px-4 max-w-4xl mx-auto mb-24 w-full">
          <FadeUp>
            <div className="bg-[#E0F5FF] rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-100">
              <div>
                <h3 className="text-2xl font-bold text-[#202020] mb-2">Creator Pro</h3>
                <p className="text-[15px]" style={{ color: 'rgba(32,32,32,0.75)' }}>
                  Are you a creator? Upgrade to Pro to get early access to campaigns, advanced analytics, and portfolio customization.
                </p>
              </div>
              <div className="flex-shrink-0 text-center md:text-right">
                <div className="text-3xl font-bold text-[#202020] mb-3">
                  {isAnnual ? '$190' : '$19.99'}
                  <span className="text-base font-normal text-gray-500">
                    {isAnnual ? '/yr' : '/mo'}
                  </span>
                </div>
                <button 
                  onClick={openRoleModal}
                  className="inline-block bg-white text-[#202020] font-bold py-2.5 px-6 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* FAQ */}
        <section className="px-4 max-w-3xl mx-auto w-full">
          <FadeUp>
            <h2 className="text-3xl font-bold text-[#202020] mb-8 text-center">Pricing FAQs</h2>
            <Accordion>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-base font-semibold text-[#202020]">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-[145%] text-[rgba(32,32,32,0.75)]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </section>

      </main>
      <Footer />
    </>
  )
}