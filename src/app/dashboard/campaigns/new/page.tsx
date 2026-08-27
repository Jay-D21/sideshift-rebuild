'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { ArrowLeft, ArrowRight, Save, Rocket, Sparkles, Globe, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface CampaignSuggestion {
  title: string
  objective: string
  description: string
  brief: string
  budget: number
  budget_per_creator: number
  video_count: number
  duration: string
  niches: string[]
}

interface BrandData {
  company_name: string
  industry: string
  description: string
  target_audience: string
  brand_voice: string
  suggested_campaigns: CampaignSuggestion[]
}

const SCAN_MESSAGES = [
  'Scanning your brand...',
  'Analyzing your audience...',
  'Generating campaign ideas...',
  'Crafting creative briefs...',
  'Almost ready...',
]

function NewCampaignInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlParam = searchParams.get('url')
  const { userId } = useAuth()

  // Scanning state
  const [scanning, setScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [brandData, setBrandData] = useState<BrandData | null>(null)
  const [scanMsgIdx, setScanMsgIdx] = useState(0)
  const [scanError, setScanError] = useState('')

  // Wizard state
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
    niches: [] as string[],
  })

  const nicheOptions = ['Beauty', 'Tech', 'Fitness', 'Food', 'Lifestyle', 'Gaming', 'Finance', 'Travel']
  const durationOptions = ['15s', '30s', '60s']

  useEffect(() => {
    if (urlParam && !scanComplete && !scanning) {
      doScan(urlParam)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParam])

  useEffect(() => {
    if (!scanning) return
    const interval = setInterval(() => setScanMsgIdx(i => (i + 1) % SCAN_MESSAGES.length), 2000)
    return () => clearInterval(interval)
  }, [scanning])

  const doScan = async (url: string) => {
    setScanning(true)
    setScanError('')
    try {
      const res = await fetch('/api/scan-brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scan failed')
      setBrandData(data)
      setScanComplete(true)
    } catch {
      setScanError('Could not scan the website. Please fill in your details manually.')
      setScanComplete(true)
    } finally {
      setScanning(false)
    }
  }

  const handleUseCampaign = (c: CampaignSuggestion) => {
    setFormData({
      title: c.title,
      category: c.objective,
      description: c.description,
      videoCount: String(c.video_count),
      duration: c.duration,
      brief: c.brief,
      budget: String(c.budget),
      budgetPerCreator: String(c.budget_per_creator),
      deadline: '',
      niches: c.niches || [],
    })
    setBrandData(null)
    setScanComplete(false)
    setStep(1)
  }

  const handleNext = () => setStep(s => Math.min(s + 1, 4))
  const handleBack = () => setStep(s => Math.max(s - 1, 1))

  const toggleNiche = (n: string) =>
    setFormData(prev => ({
      ...prev,
      niches: prev.niches.includes(n) ? prev.niches.filter(x => x !== n) : [...prev.niches, n],
    }))

  const handleGenerateBrief = async () => {
    if (!formData.title || !formData.description) {
      alert('Fill out Title and Description in Step 1 first.')
      return
    }
    setGeneratingBrief(true)
    try {
      const res = await fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          duration: formData.duration,
          videoCount: formData.videoCount,
        }),
      })
      const data = await res.json()
      if (res.ok && data.brief) setFormData(prev => ({ ...prev, brief: data.brief }))
    } catch { /* silent */ } finally {
      setGeneratingBrief(false)
    }
  }

  const handleSubmit = async (status: 'draft' | 'active') => {
    setLoading(true)
    try {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      if (!userId) return

      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, brand_profiles(id)')
        .eq('user_id', userId)
        .single()

      if (!profile?.brand_profiles?.[0]?.id) return
      const brandId = profile.brand_profiles[0].id

      const { error } = await supabase.from('campaigns').insert({
        brand_id: brandId,
        title: formData.title || 'Untitled Campaign',
        category: formData.category || 'General',
        description: formData.description,
        brief: formData.brief,
        budget: Number(formData.budget) || 0,
        budget_per_creator: Number(formData.budgetPerCreator) || 0,
        video_count: Number(formData.videoCount) || 1,
        duration: formData.duration,
        niches: formData.niches,
        deadline: formData.deadline || null,
        status,
      } as any)

      if (!error) router.push('/dashboard/campaigns')
    } finally {
      setLoading(false)
    }
  }

  // ── SCANNING OVERLAY ──────────────────────────────────────────────────────
  if (scanning) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm px-8"
        >
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-[#E0F5FF] flex items-center justify-center">
            <Globe className="h-7 w-7 text-[#3C83F9]" style={{ animation: 'spin 3s linear infinite' }} />
          </div>
          <p className="font-mono text-sm text-[#3C83F9] bg-[#E0F5FF] px-4 py-2 rounded-full mb-6 inline-block truncate max-w-[280px]">
            {urlParam}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={scanMsgIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-xl font-bold text-[#202020]"
            >
              {SCAN_MESSAGES[scanMsgIdx]}
            </motion.p>
          </AnimatePresence>
          <div className="mt-4 flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                className="h-1.5 w-1.5 rounded-full bg-[#3C83F9]"
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ── BRAND RESULTS ─────────────────────────────────────────────────────────
  if (scanComplete && brandData && !scanError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/campaigns" className="text-gray-400 hover:text-black transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#202020]">Brand Scan Complete ✨</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AI-extracted from <span className="font-medium text-[#202020]">{urlParam}</span>
            </p>
          </div>
        </div>

        {/* Brand Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-[#202020]">Brand Profile</h2>
            <span className="text-xs font-semibold bg-[#E0F5FF] text-[#3C83F9] px-3 py-1 rounded-full">
              AI Extracted
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Company', value: brandData.company_name },
              { label: 'Industry', value: brandData.industry },
              { label: 'Target Audience', value: brandData.target_audience },
              { label: 'Brand Voice', value: brandData.brand_voice },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">{item.label}</div>
                <div className="text-sm font-medium text-[#202020]">{item.value}</div>
              </div>
            ))}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Description</div>
              <div className="text-sm font-medium text-[#202020]">{brandData.description}</div>
            </div>
          </div>
        </motion.div>

        {/* Campaign Suggestions */}
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#202020] mb-1">AI-Suggested Campaigns</h2>
          <p className="text-sm text-gray-500">
            Pick one to pre-fill the wizard, or{' '}
            <button
              onClick={() => { setScanComplete(false); setBrandData(null) }}
              className="text-[#3C83F9] hover:underline"
            >
              start from scratch
            </button>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(brandData.suggested_campaigns || []).map((campaign, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:border-[#3C83F9] transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-[#202020] text-base leading-snug">{campaign.title}</h3>
                <span className="shrink-0 text-xs font-semibold bg-[#E0F5FF] text-[#3C83F9] px-2 py-0.5 rounded-full capitalize">
                  {campaign.objective}
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{campaign.description}</p>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="font-semibold text-[#202020]">${campaign.budget}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">${campaign.budget_per_creator}/creator</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">{campaign.video_count}x {campaign.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(campaign.niches || []).map(niche => (
                  <span key={niche} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {niche}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleUseCampaign(campaign)}
                className="mt-auto w-full flex items-center justify-center gap-2 h-10 bg-[#202020] text-white rounded-xl text-sm font-bold hover:bg-black/90 transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Use this campaign
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // ── WIZARD ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/campaigns" className="text-gray-400 hover:text-black transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">
            {formData.title ? `Editing: ${formData.title}` : 'Create Campaign'}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Step {step} of 4</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Details', 'Deliverables', 'Budget', 'Review'].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
              step > i + 1 ? 'bg-[#202020] text-white' : step === i + 1 ? 'bg-[#3C83F9] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block truncate ${step === i + 1 ? 'text-[#202020]' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < 3 && <div className={`h-px flex-1 ${step > i + 1 ? 'bg-[#202020]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[#202020]">Campaign Details</h2>
            <p className="text-sm text-gray-500 mt-1">What is this campaign about?</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Campaign Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
              placeholder="e.g. Summer Skincare Launch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Objective</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white"
            >
              <option value="">Select objective</option>
              <option value="awareness">Awareness</option>
              <option value="conversion">Conversion</option>
              <option value="ugc">UGC Content</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[100px] resize-none"
              placeholder="Describe what the campaign is for, what product is being promoted..."
            />
          </div>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[#202020]">Deliverables</h2>
            <p className="text-sm text-gray-500 mt-1">What content do you need?</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Number of Videos</label>
              <input
                type="number"
                min="1"
                value={formData.videoCount}
                onChange={e => setFormData({ ...formData, videoCount: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Duration</label>
              <div className="flex gap-2 h-11">
                {durationOptions.map(dur => (
                  <button
                    key={dur}
                    onClick={() => setFormData({ ...formData, duration: dur })}
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
              <label className="block text-sm font-medium text-[#202020]">Creative Brief</label>
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
              onChange={e => setFormData({ ...formData, brief: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[200px] resize-none"
              placeholder="Include talking points, visual requirements, do's and don'ts..."
            />
          </div>
        </div>
      )}

      {/* ── Step 3 ── */}
      {step === 3 && (
        <div className="space-y-5">
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
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#202020] mb-1">Max per Creator ($)</label>
              <input
                type="number"
                value={formData.budgetPerCreator}
                onChange={e => setFormData({ ...formData, budgetPerCreator: e.target.value })}
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
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
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

      {/* ── Step 4 ── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#202020]">Review & Launch</h2>
            <p className="text-sm text-gray-500 mt-1">Review your campaign before publishing.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 space-y-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Title & Objective</div>
              <div className="font-medium text-[#202020]">{formData.title || 'Untitled'} — {formData.category || 'No objective'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Deliverables</div>
              <div className="font-medium text-[#202020]">{formData.videoCount}× {formData.duration} video</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Budget</div>
              <div className="font-medium text-[#202020]">${formData.budget || 0} total / ${formData.budgetPerCreator || 0} per creator</div>
            </div>
            {formData.niches.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Target Niches</div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.niches.map(n => (
                    <span key={n} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{n}</span>
                  ))}
                </div>
              </div>
            )}
            {formData.brief && (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Brief Preview</div>
                <div className="text-sm text-gray-600 line-clamp-3">{formData.brief}</div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

      {/* Footer nav */}
      {step < 4 && (
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
          {step > 1 ? (
            <button onClick={handleBack} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black">
              ← Back
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
  )
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
      <NewCampaignInner />
    </Suspense>
  )
}
