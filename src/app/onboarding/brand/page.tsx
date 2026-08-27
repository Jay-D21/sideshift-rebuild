'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, Video, Users, Rocket, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const TOTAL_STEPS = 5

const goals = [
  { id: 'ugc', icon: Video, title: 'UGC Content', desc: 'Get authentic user-generated content for your brand' },
  { id: 'ads', icon: Megaphone, title: 'Ad Creatives', desc: 'Create high-performing video ads for paid channels' },
  { id: 'partnerships', icon: Users, title: 'Creator Partnerships', desc: 'Build long-term relationships with creators' },
  { id: 'launch', icon: Rocket, title: 'Product Launch', desc: 'Drive awareness for a new product or service' },
]

const experiences = [
  { id: 'regular', title: 'Regular', desc: 'I run creator campaigns every month' },
  { id: 'some', title: 'Some Experience', desc: "I've tried working with creators a few times" },
  { id: 'first', title: 'First Time', desc: 'This is my first time hiring UGC creators' },
]

const audiences = ['Gen Z', 'Millennials', 'Parents', 'Tech Enthusiasts', 'Beauty Lovers', 'Fitness Fans', 'Gamers', 'Foodies', 'Fashion Lovers', 'Business Professionals']

const industries = ['ecommerce', 'saas', 'mobile_app', 'food', 'beauty', 'fitness', 'finance', 'gaming', 'other']

export default function BrandOnboarding() {
  const router = useRouter()
  const { userId } = useAuth()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [saving, setSaving] = useState(false)

  const [data, setData] = useState({
    goal: '',
    experience: '',
    audiences: [] as string[],
    companyName: '',
    website: '',
    industry: '',
    description: '',
  })

  const go = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
  }

  const toggleAudience = (a: string) =>
    setData(d => ({ ...d, audiences: d.audiences.includes(a) ? d.audiences.filter(x => x !== a) : [...d.audiences, a] }))

  const handleFinish = async () => {
    if (!userId) return
    setSaving(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, brand_profiles(id)')
      .eq('user_id', userId)
      .single()

    if (profile) {
      if (profile.brand_profiles?.[0]?.id) {
        await (supabase as any).from('brand_profiles').update({
          company_name: data.companyName,
          website: data.website,
          industry: data.industry,
          description: data.description,
          goal: data.goal,
          experience: data.experience,
          target_audiences: data.audiences,
        }).eq('id', profile.brand_profiles[0].id)
      } else {
        await (supabase as any).from('brand_profiles').insert({
          profile_id: profile.id,
          company_name: data.companyName,
          website: data.website,
          industry: data.industry,
          description: data.description,
        })
      }
      await (supabase as any).from('profiles').update({ onboarding_completed: true }).eq('id', profile.id)
    }
    setSaving(false)
    router.push('/dashboard')
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  const RadioCard = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#F8FCFF] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i + 1 === step ? 'w-8 bg-[#202020]' : i + 1 < step ? 'w-4 bg-[#202020]' : 'w-4 bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="p-8"
            >
              {/* Step 1 — Goal */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">What's your main goal?</h1>
                  <p className="text-sm text-gray-500 mb-6">We'll tailor the experience to match.</p>
                  <div className="space-y-3">
                    {goals.map(g => (
                      <RadioCard key={g.id} selected={data.goal === g.id} onClick={() => setData(d => ({ ...d, goal: g.id }))}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${data.goal === g.id ? 'bg-[#202020] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <g.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#202020] text-sm">{g.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{g.desc}</p>
                          </div>
                          {data.goal === g.id && <CheckCircle className="h-5 w-5 text-[#202020] ml-auto shrink-0" />}
                        </div>
                      </RadioCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Experience */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Your experience with creators?</h1>
                  <p className="text-sm text-gray-500 mb-6">This helps us show you the right features.</p>
                  <div className="space-y-3">
                    {experiences.map(e => (
                      <RadioCard key={e.id} selected={data.experience === e.id} onClick={() => setData(d => ({ ...d, experience: e.id }))}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#202020] text-sm">{e.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{e.desc}</p>
                          </div>
                          {data.experience === e.id && <CheckCircle className="h-5 w-5 text-[#202020] shrink-0" />}
                        </div>
                      </RadioCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 — Audience */}
              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Who's your target audience?</h1>
                  <p className="text-sm text-gray-500 mb-6">Select all that apply.</p>
                  <div className="flex flex-wrap gap-2">
                    {audiences.map(a => (
                      <button
                        key={a}
                        onClick={() => toggleAudience(a)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          data.audiences.includes(a)
                            ? 'bg-[#202020] border-[#202020] text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — Company info */}
              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Tell us about your company</h1>
                  <p className="text-sm text-gray-500 mb-6">This info will appear on your brand profile.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Company Name *</label>
                      <input
                        value={data.companyName}
                        onChange={e => setData(d => ({ ...d, companyName: e.target.value }))}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Website URL</label>
                      <input
                        value={data.website}
                        onChange={e => setData(d => ({ ...d, website: e.target.value }))}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="https://acme.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Industry</label>
                      <select
                        value={data.industry}
                        onChange={e => setData(d => ({ ...d, industry: e.target.value }))}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white"
                      >
                        <option value="">Select industry</option>
                        {industries.map(ind => (
                          <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Brief Description</label>
                      <textarea
                        value={data.description}
                        onChange={e => setData(d => ({ ...d, description: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[80px] resize-none text-sm"
                        placeholder="What does your company do?"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 — Done */}
              {step === 5 && (
                <div className="text-center py-4">
                  <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#E0F5FF] flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-[#3C83F9]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">You're all set! 🎉</h1>
                  <p className="text-gray-500 text-sm mb-6">Your brand profile has been created. Let's launch your first campaign.</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                    {data.companyName && <div className="flex justify-between"><span className="text-gray-500">Company</span><span className="font-medium">{data.companyName}</span></div>}
                    {data.goal && <div className="flex justify-between"><span className="text-gray-500">Goal</span><span className="font-medium capitalize">{data.goal}</span></div>}
                    {data.industry && <div className="flex justify-between"><span className="text-gray-500">Industry</span><span className="font-medium capitalize">{data.industry}</span></div>}
                    {data.audiences.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Audience</span><span className="font-medium">{data.audiences.slice(0, 2).join(', ')}{data.audiences.length > 2 ? '...' : ''}</span></div>}
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-[#202020] text-white rounded-xl font-bold hover:bg-black/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Setting up...' : 'Go to Dashboard'} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          {step < 5 && (
            <div className="px-8 pb-6 flex justify-between items-center border-t border-gray-100 pt-5">
              {step > 1 ? (
                <button onClick={() => go(step - 1)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : <div />}
              <button
                onClick={() => go(step + 1)}
                disabled={(step === 1 && !data.goal) || (step === 2 && !data.experience) || (step === 4 && !data.companyName)}
                className="flex items-center gap-2 bg-[#202020] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors disabled:opacity-40"
              >
                {step === 4 ? 'Finish' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Step {step} of {TOTAL_STEPS}</p>
      </div>
    </div>
  )
}