'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'

const TOTAL_STEPS = 7

const niches = [
  { id: 'Tech', emoji: '💻' }, { id: 'Beauty', emoji: '💄' }, { id: 'Fitness', emoji: '💪' },
  { id: 'Gaming', emoji: '🎮' }, { id: 'Lifestyle', emoji: '✨' }, { id: 'Food', emoji: '🍕' },
  { id: 'Fashion', emoji: '👗' }, { id: 'Travel', emoji: '✈️' }, { id: 'Finance', emoji: '💰' },
  { id: 'Parenting', emoji: '👶' }, { id: 'Music', emoji: '🎵' }, { id: 'Education', emoji: '📚' },
]

const contentTypes = ['UGC Ads', 'Product Reviews', 'Tutorials', 'Unboxings', 'Testimonials', "How-To's"]

const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Germany', 'France', 'Brazil', 'Mexico', 'Other']

export default function CreatorOnboarding() {
  const router = useRouter()
  const { userId } = useAuth()
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [saving, setSaving] = useState(false)

  const [data, setData] = useState({
    experience: '',
    niches: [] as string[],
    contentTypes: [] as string[],
    fullName: '',
    bio: '',
    country: '',
    city: '',
    tiktok: '',
    instagram: '',
    youtube: '',
    avatarUrl: '',
  })

  const go = (next: number) => { setDir(next > step ? 1 : -1); setStep(next) }

  const toggleArr = (key: 'niches' | 'contentTypes', val: string) =>
    setData(d => ({ ...d, [key]: d[key].includes(val) ? d[key].filter(x => x !== val) : [...d[key], val] }))

  const handleFinish = async () => {
    if (!userId) return
    setSaving(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, creator_profiles(id)')
      .eq('user_id', userId)
      .single()

    if (profile) {
      const nameParts = data.fullName.trim().split(' ')
      const username = (nameParts[0] || 'creator').toLowerCase() + Math.floor(Math.random() * 1000)
      const creatorData = {
        user_id: userId,
        username,
        bio: data.bio,
        categories: data.niches,
        content_types: data.contentTypes,
        avatar_url: data.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=E0F5FF&color=202020&size=128`,
        social_links: { tiktok: data.tiktok, instagram: data.instagram, youtube: data.youtube },
        country: data.country,
        city: data.city,
        experience_level: data.experience,
      }
      if (profile.creator_profiles?.[0]?.id) {
        await (supabase as any).from('creator_profiles').update(creatorData).eq('id', profile.creator_profiles[0].id)
      } else {
        await (supabase as any).from('creator_profiles').insert({ profile_id: profile.id, ...creatorData })
      }
      await (supabase as any).from('profiles').update({
        onboarding_completed: true,
        full_name: data.fullName,
      }).eq('id', profile.id)
    }
    setSaving(false)
    router.push('/creator/explore')
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className="min-h-screen bg-[#F8FCFF] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-1.5 mb-8 justify-center">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 === step ? 'w-8 bg-[#3C83F9]' : i + 1 < step ? 'w-5 bg-[#202020]' : 'w-5 bg-gray-200'}`} />
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
              {/* Step 1 — Experience */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Your experience</h1>
                  <p className="text-sm text-gray-500 mb-6">How much brand collaboration experience do you have?</p>
                  <div className="space-y-3">
                    {[
                      { id: 'beginner', title: "I'm just getting started", desc: 'New to brand collaborations and UGC' },
                      { id: 'experienced', title: "I've worked with brands before", desc: 'I have completed brand campaigns previously' },
                    ].map(e => (
                      <button
                        key={e.id}
                        onClick={() => setData(d => ({ ...d, experience: e.id }))}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all ${data.experience === e.id ? 'border-[#202020] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#202020]">{e.title}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{e.desc}</p>
                          </div>
                          {data.experience === e.id && <CheckCircle className="h-5 w-5 text-[#202020] shrink-0" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Niches */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Pick your niches</h1>
                  <p className="text-sm text-gray-500 mb-6">Select all that match your content style.</p>
                  <div className="flex flex-wrap gap-2">
                    {niches.map(n => (
                      <button
                        key={n.id}
                        onClick={() => toggleArr('niches', n.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          data.niches.includes(n.id) ? 'bg-[#202020] border-[#202020] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{n.emoji}</span> {n.id}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 — Content types */}
              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Content you create</h1>
                  <p className="text-sm text-gray-500 mb-6">What types of content do you specialize in?</p>
                  <div className="flex flex-wrap gap-2">
                    {contentTypes.map(ct => (
                      <button
                        key={ct}
                        onClick={() => toggleArr('contentTypes', ct)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          data.contentTypes.includes(ct) ? 'bg-[#202020] border-[#202020] text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {ct}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — About you */}
              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">About you</h1>
                  <p className="text-sm text-gray-500 mb-6">Tell brands about yourself.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Full Name *</label>
                      <input value={data.fullName} onChange={e => setData(d => ({ ...d, fullName: e.target.value }))}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#202020] mb-1">Bio</label>
                      <textarea value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[80px] resize-none text-sm"
                        placeholder="Lifestyle creator passionate about beauty and wellness..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-[#202020] mb-1">Country</label>
                        <select value={data.country} onChange={e => setData(d => ({ ...d, country: e.target.value }))}
                          className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white text-sm">
                          <option value="">Select</option>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#202020] mb-1">City</label>
                        <input value={data.city} onChange={e => setData(d => ({ ...d, city: e.target.value }))}
                          className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm" placeholder="Los Angeles" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 — Socials */}
              {step === 5 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Connect your socials</h1>
                  <p className="text-sm text-gray-500 mb-6">Brands use this to verify your reach.</p>
                  <div className="space-y-4">
                    {[
                      { key: 'tiktok', label: '🎵 TikTok', placeholder: 'https://tiktok.com/@yourhandle' },
                      { key: 'instagram', label: '📸 Instagram', placeholder: 'https://instagram.com/yourhandle' },
                      { key: 'youtube', label: '▶️ YouTube', placeholder: 'https://youtube.com/@yourchannel' },
                    ].map(s => (
                      <div key={s.key}>
                        <label className="block text-sm font-medium text-[#202020] mb-1">{s.label}</label>
                        <input
                          value={data[s.key as 'tiktok' | 'instagram' | 'youtube']}
                          onChange={e => setData(d => ({ ...d, [s.key]: e.target.value }))}
                          className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
                          placeholder={s.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6 — Photo */}
              {step === 6 && (
                <div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-1">Profile photo</h1>
                  <p className="text-sm text-gray-500 mb-6">Add a photo URL (or skip for a generated avatar).</p>
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-[#E0F5FF] border-4 border-white shadow-lg">
                      <img
                        src={data.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || 'Creator')}&background=E0F5FF&color=202020&size=128`}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-[#202020] mb-1">Photo URL (optional)</label>
                      <input
                        value={data.avatarUrl}
                        onChange={e => setData(d => ({ ...d, avatarUrl: e.target.value }))}
                        className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-gray-400 mt-2">Leave empty to use an auto-generated avatar.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7 — Done */}
              {step === 7 && (
                <div className="text-center py-4">
                  <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#E0F5FF] flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-[#3C83F9]" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#202020] mb-2">Almost there! 🚀</h1>
                  <p className="text-gray-500 text-sm mb-6">Your creator profile is ready. Start exploring brand campaigns.</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                    {data.fullName && <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{data.fullName}</span></div>}
                    {data.niches.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Niches</span><span className="font-medium">{data.niches.slice(0, 3).join(', ')}</span></div>}
                    {data.experience && <div className="flex justify-between"><span className="text-gray-500">Experience</span><span className="font-medium capitalize">{data.experience}</span></div>}
                  </div>
                  <button
                    onClick={handleFinish}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 h-12 bg-[#3C83F9] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Setting up...' : 'Start Exploring →'}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 7 && (
            <div className="px-8 pb-6 flex justify-between items-center border-t border-gray-100 pt-5">
              {step > 1 ? (
                <button onClick={() => go(step - 1)} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-black">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : <div />}
              <button
                onClick={() => go(step + 1)}
                disabled={step === 1 && !data.experience}
                className="flex items-center gap-2 bg-[#202020] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors disabled:opacity-40"
              >
                {step === 6 ? 'Finish' : 'Continue'} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Step {step} of {TOTAL_STEPS}</p>
      </div>
    </div>
  )
}