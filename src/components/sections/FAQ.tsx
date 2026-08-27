'use client'

import { FadeUp } from '@/components/ui/fade-up'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: "What is CreatorFlow?",
    answer: "CreatorFlow is an inbound creator marketing platform that lets brands post campaign briefs and receive applications from qualified UGC creators."
  },
  {
    question: "How does pricing work?",
    answer: "We offer a 7-day free trial with unlimited campaigns. After that, plans start at $99/month. No platform fees on creator payments."
  },
  {
    question: "How do creators get paid?",
    answer: "Creators receive payment directly through CreatorFlow within 48 hours of content approval. We support ACH, PayPal, and Stripe."
  },
  {
    question: "Can I review creator content before publishing?",
    answer: "Yes. All content goes through our built-in review workflow. You can approve, request revisions, or reject submissions from your dashboard."
  },
  {
    question: "How are creators vetted?",
    answer: "Every creator on CreatorFlow goes through an application process, portfolio review, and audience quality check before being approved to apply for campaigns."
  },
  {
    question: "What types of content can I request?",
    answer: "Any UGC format — product reviews, unboxings, tutorials, testimonials, social ads, TikToks, Reels, YouTube Shorts, and more."
  }
]

export default function FAQ() {
  return (
    <section className="py-20 px-4" style={{ background: '#F8FEFF' }}>
      <div className="mx-auto max-w-3xl">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#202020] md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[15px] leading-[145%]" style={{ color: 'rgba(32,32,32,0.55)' }}>
            Everything you need to know about the platform.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <Accordion>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-base font-semibold text-[#202020]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-[145%] text-[rgba(32,32,32,0.75)]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
