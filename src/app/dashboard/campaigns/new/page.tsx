'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { ArrowLeft, ArrowRight, Save, Rocket, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function NewCampaignPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generatingBrief, setGeneratingBrief] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    videoCount: '1',
    duration: '30s',
    brief: '',
    budget: '',
    budgetPerCreator: '',
    deadline: '',
    niches: [] as string[]
  })

  const nicheOptions = ['Beauty', 'Tech', 'Fitness', 'Food', 'Lifestyle', 'Gaming', 'Finance', 'Travel']
  const durationOptions = ['15s', '30s', '60s']

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const toggleNiche = (n: string) => {
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(n) 
        ? prev.niches.filter(x => x !== n)
        : [...prev.niches, n]
    }))
  }

  const handleGenerateBrief = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill out the Campaign Title and Description in Step 1 first!')
      return
    }
    setGeneratingBrief(true)
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productContext: `Title: ${formData.title}\nCategory: ${formData.category}\nDescription: ${formData.description}` })
      })
      const data = await res.json()
      if (res.ok && data.brief) {
        setFormData(prev => ({ ...prev, brief: data.brief }))
      } else {
        alert(data.error || 'Failed to generate brief')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong generating the brief.')
    } finally {
      setGeneratingBrief(false)
    }
  }

  const handleSubmit = async (status: 'draft' | 'active') => {
    setLoading(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { userId } = useAuth()
    if (!userId) return

    // Get brand profile id
    const { data: brand } = await (supabase
      .from('profiles')
      .select('id, brand_profiles(id)')
      .eq('user_id', userId)
      .single() as any)

    if (!brand || !brand.brand_profiles?.[0]?.id) return
    const brandId = brand.brand_profiles[0].id

    const { error } = await supabase.from('campaigns').insert({
      brand_id: brandId,
      title: formData.title || 'Untitled Campaign',
      category: formData.category || 'General',
      description: formData.description,
      brief: formData.brief,
      budget: Number(formData.budget) || 0,
      budget_per_creator: Number(formData.budgetPerCreator) || 0,
      status,
      deliverables: [`${formData.videoCount}x ${formData.duration} video`],
      requirements: { niches: formData.niches },
      deadline: formData.deadline || null
    } as any)

    if (!error) {
      router.push('/dashboard/campaigns')
      router.refresh()
    } else {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard/campaigns" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
        <div className="text-sm font-medium text-gray-500">Step {step} of 4</div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#202020]">Campaign Basics</h2>
              <p className="text-sm text-gray-500 mt-1">Let's start with the high-level details.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Campaign Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                placeholder="e.g. Summer TikTok Challenge"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Category / Objective</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white"
              >
                <option value="">Select an objective</option>
                <option value="awareness">Brand Awareness</option>
                <option value="conversion">Direct Sales / Conversions</option>
                <option value="ugc">UGC Library Building</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Public Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[100px] resize-none"
                placeholder="Short description visible to creators browsing campaigns..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#202020]">Deliverables & Brief</h2>
              <p className="text-sm text-gray-500 mt-1">What exactly do you need the creator to make?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Number of Videos</label>
                <input
                  type="number"
                  min="1"
                  value={formData.videoCount}
                  onChange={e => setFormData({...formData, videoCount: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Duration</label>
                <div className="flex gap-2 h-11">
                  {durationOptions.map(dur => (
                    <button
                      key={dur}
                      onClick={() => setFormData({...formData, duration: dur})}
                      className={`flex-1 rounded-lg border text-sm font-medium transition-all ${
                        formData.duration === dur
                          ? 'border-[#202020] bg-gray-50 ring-1 ring-[#202020]' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#202020]">Creative Guidelines & Script (Brief)</label>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generatingBrief}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#3C83F9] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingBrief ? 'Generating...' : '✨ Generate with AI'}
                </button>
              </div>
              <textarea
                value={formData.brief}
                onChange={e => setFormData({...formData, brief: e.target.value})}
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[200px] resize-none"
                placeholder="Include talking points, visual requirements, do's and don'ts..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#202020]">Budget & Targeting</h2>
              <p className="text-sm text-gray-500 mt-1">Set your limits and find the right creators.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Total Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={e => setFormData({...formData, budget: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Max per Creator ($)</label>
                <input
                  type="number"
                  value={formData.budgetPerCreator}
                  onChange={e => setFormData({...formData, budgetPerCreator: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                  placeholder="500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({...formData, deadline: e.target.value})}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#202020] mb-2">Target Niches</label>
              <div className="flex flex-wrap gap-2">
                {nicheOptions.map(niche => {
                  const isSelected = formData.niches.includes(niche)
                  return (
                    <button
                      key={niche}
                      onClick={() => toggleNiche(niche)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-[#202020] border-[#202020] text-white' 
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {niche}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#202020]">Review & Launch</h2>
              <p className="text-sm text-gray-500 mt-1">Review your campaign details before publishing.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Title & Category</div>
                <div className="font-medium text-[#202020]">{formData.title || 'Untitled'} &mdash; {formData.category || 'No category'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Deliverables</div>
                <div className="font-medium text-[#202020]">{formData.videoCount}x {formData.duration} video</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Budget</div>
                <div className="font-medium text-[#202020]">${formData.budget || 0} Total / Max ${formData.budgetPerCreator || 0} per creator</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-white text-[#202020] border border-gray-200 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>
              <button
                onClick={() => handleSubmit('active')}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#3C83F9] text-white rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Rocket className="w-4 h-4" /> Launch Campaign
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {step < 4 && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button onClick={handleBack} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black">
                Back
              </button>
            ) : <div />}
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
