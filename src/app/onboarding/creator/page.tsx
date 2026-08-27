'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const TOTAL_STEPS = 7

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5 justify-center flex-wrap">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const done = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done
                  ? 'bg-[#202020] text-white'
                  : active
                  ? 'bg-white border-2 border-[#3C83F9] text-[#202020]'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? '✓' : step}
            </div>
            {step < total && (
              <div className={`w-6 h-0.5 ${step < current ? 'bg-[#202020]' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function CreatorOnboarding() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    experience: '',
    niches: [] as string[],
    contentTypes: [] as string[],
    bio: '',
    country: '',
    city: '',
    tiktok: '',
    instagram: '',
    youtube: '',
    avatarUrl: ''
  })

  const experiences = ['Just getting started', 'Worked with a few brands', 'Full-time UGC creator']
  const nicheOptions = ['Tech', 'Beauty', 'Fitness', 'Gaming', 'Lifestyle', 'Food', 'Fashion', 'Travel']
  const contentOptions = ['UGC Ads', 'Reviews', 'Tutorials', 'Unboxings', 'Testimonials']

  const handleNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const toggleArray = (field: 'niches' | 'contentTypes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }))
  }

  const handleComplete = async () => {
    setLoading(true)
    if (!user) { router.push('/login'); return }

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      await supabase.from('creator_profiles').update({
        bio: formData.bio,
        categories: formData.niches,
        avatar_url: formData.avatarUrl,
        social_links: {
          tiktok: formData.tiktok,
          instagram: formData.instagram,
          youtube: formData.youtube,
        },
      }).eq('profile_id', profile.id)
    }

    router.push('/creator/explore')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#202020]">CreatorFlow</Link>
        <div className="text-sm font-medium text-gray-500">Step {step} of {TOTAL_STEPS}</div>
      </header>

      <div className="py-6 bg-white border-b border-gray-100">
        <StepIndicator current={step} total={TOTAL_STEPS} />
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
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">What&apos;s your experience level?</h1>
                  <p className="text-gray-500 mb-6">This helps brands know what to expect.</p>
                  <div className="grid gap-3">
                    {experiences.map(exp => (
                      <button key={exp} onClick={() => setFormData({ ...formData, experience: exp })}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.experience === exp ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                        <div className="font-semibold text-[#202020]">{exp}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">What are your niches?</h1>
                  <p className="text-gray-500 mb-6">Select all the categories you create content for.</p>
                  <div className="flex flex-wrap gap-2">
                    {nicheOptions.map(niche => {
                      const isSelected = formData.niches.includes(niche)
                      return (
                        <button key={niche} onClick={() => toggleArray('niches', niche)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                            isSelected ? 'bg-[#202020] border-[#202020] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}>
                          {niche}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Content types</h1>
                  <p className="text-gray-500 mb-6">What kinds of videos do you specialize in?</p>
                  <div className="flex flex-wrap gap-2">
                    {contentOptions.map(type => {
                      const isSelected = formData.contentTypes.includes(type)
                      return (
                        <button key={type} onClick={() => toggleArray('contentTypes', type)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                            isSelected ? 'bg-[#202020] border-[#202020] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}>
                          {type}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">About you</h1>
                  <p className="text-gray-500 mb-6">Add some personal details for your profile.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Country</label>
                      <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">City</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Bio</label>
                      <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[100px] resize-none"
                        placeholder="Tell brands about your style and audience..." />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Social Profiles</h1>
                  <p className="text-gray-500 mb-6">Link your accounts so brands can see your work.</p>
                  <div className="space-y-4">
                    {[
                      { label: 'TikTok URL', field: 'tiktok', placeholder: 'https://tiktok.com/@username' },
                      { label: 'Instagram URL', field: 'instagram', placeholder: 'https://instagram.com/username' },
                      { label: 'YouTube URL', field: 'youtube', placeholder: 'https://youtube.com/@username' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-[#202020] mb-1">{label}</label>
                        <input type="url" value={formData[field as 'tiktok'|'instagram'|'youtube']}
                          onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                          className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                          placeholder={placeholder} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Profile Photo</h1>
                  <p className="text-gray-500 mb-6">Upload a photo so brands know who they&apos;re working with.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Photo URL</label>
                      <input type="url" value={formData.avatarUrl} onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                        placeholder="https://example.com/photo.jpg" />
                    </div>
                    {formData.avatarUrl && (
                      <div className="flex justify-center mt-6">
                        <img src={formData.avatarUrl} alt="Preview" className="w-32 h-32 rounded-full object-cover border border-gray-200" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 7 && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <div className="h-16 w-16 bg-[#E0F5FF] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-8 w-8 text-[#3C83F9]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">You&apos;re all set!</h1>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                    Your profile is complete. Let&apos;s explore active campaigns and start pitching.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between pt-6 border-t border-gray-100">
            {step > 1 && step < TOTAL_STEPS ? (
              <button onClick={handleBack} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < TOTAL_STEPS ? (
              <button onClick={handleNext} className="px-6 py-2 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 flex items-center gap-1 cursor-pointer">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleComplete} disabled={loading}
                className="px-6 py-2.5 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 w-full disabled:opacity-50 cursor-pointer">
                {loading ? 'Saving...' : 'Explore Campaigns'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}