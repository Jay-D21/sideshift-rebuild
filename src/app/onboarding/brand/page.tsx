'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { ArrowLeft, ArrowRight, Building, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function BrandOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    goal: '',
    experience: '',
    audiences: [] as string[],
    companyName: '',
    website: '',
    industry: '',
    description: '',
  })

  const goals = ['UGC Content', 'Ad Creatives', 'Find Creators', 'Product Launch']
  const experiences = ['Regularly work with creators', 'Worked with a few', 'First time']
  const audienceOptions = ['Gen Z', 'Millennials', 'Parents', 'Tech', 'Beauty', 'Fitness', 'Gaming', 'Finance', 'Lifestyle']

  const handleNext = () => setStep(s => Math.min(s + 1, 5))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const toggleAudience = (aud: string) => {
    setFormData(prev => ({
      ...prev,
      audiences: prev.audiences.includes(aud) 
        ? prev.audiences.filter(a => a !== aud)
        : [...prev.audiences, aud]
    }))
  }

  const handleComplete = async () => {
    setLoading(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Update brand profile
    await (supabase as any).from('brand_profiles').update({
      company_name: formData.companyName || user.user_metadata?.full_name || '',
      website: formData.website,
      industry: formData.industry,
      description: formData.description,
    }).eq('user_id', user.id)

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#202020]">CreatorFlow</Link>
        <div className="text-sm font-medium text-gray-500">Step {step} of 5</div>
      </header>

      {/* Progress */}
      <div className="h-1 w-full bg-gray-100">
        <div 
          className="h-full bg-[#3C83F9] transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">What's your main goal?</h1>
                  <p className="text-gray-500 mb-6">This helps us tailor your experience.</p>
                  <div className="grid gap-3">
                    {goals.map(goal => (
                      <button
                        key={goal}
                        onClick={() => setFormData({ ...formData, goal })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.goal === goal 
                            ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-[#202020]">{goal}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Experience with creators?</h1>
                  <p className="text-gray-500 mb-6">Don't worry, we're here to help either way.</p>
                  <div className="grid gap-3">
                    {experiences.map(exp => (
                      <button
                        key={exp}
                        onClick={() => setFormData({ ...formData, experience: exp })}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.experience === exp 
                            ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-[#202020]">{exp}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Target audience?</h1>
                  <p className="text-gray-500 mb-6">Select all that apply.</p>
                  <div className="flex flex-wrap gap-2">
                    {audienceOptions.map(aud => {
                      const isSelected = formData.audiences.includes(aud)
                      return (
                        <button
                          key={aud}
                          onClick={() => toggleAudience(aud)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-[#202020] border-[#202020] text-white' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {aud}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Company info</h1>
                  <p className="text-gray-500 mb-6">Tell creators about your brand.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Company Name</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Website</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white"
                      >
                        <option value="">Select industry</option>
                        <option value="tech">Technology</option>
                        <option value="beauty">Beauty & Cosmetics</option>
                        <option value="fashion">Fashion & Apparel</option>
                        <option value="food">Food & Beverage</option>
                        <option value="health">Health & Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[100px] resize-none"
                        placeholder="What does your company do?"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="h-16 w-16 bg-[#E0F5FF] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#3C83F9]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">You're all set!</h1>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Your profile is ready. Let's head to the dashboard and launch your first campaign.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer actions */}
          <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
            {step > 1 && step < 5 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 flex items-center gap-1"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="px-6 py-2.5 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 w-full disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Go to Dashboard'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
