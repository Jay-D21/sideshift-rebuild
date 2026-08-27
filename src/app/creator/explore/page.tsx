'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Search, DollarSign, Clock, Zap } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function ExploreCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [quickApplyId, setQuickApplyId] = useState<string | null>(null)
  const [pitch, setPitch] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('campaigns')
        .select('*, brand_profiles(company_name, logo_url, industry)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      setCampaigns((data as any[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = campaigns.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.brand_profiles as any)?.company_name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || c.category?.toLowerCase() === category
    return matchSearch && matchCat
  })

  const handleQuickApply = async () => {
    if (!pitch.trim() || !quickApplyId) return
    setSubmitting(true)
    // Get current creator profile
    await supabase.from('applications').insert({
      campaign_id: quickApplyId,
      pitch,
      status: 'applied',
    })
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { setQuickApplyId(null); setSubmitted(false); setPitch('') }, 1500)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Explore Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Find and pitch to active brand campaigns.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search by keyword or brand..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 bg-white min-w-[160px]">
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="beauty">Beauty</option>
          <option value="fitness">Fitness</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-56 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              No active campaigns found. Check back later!
            </div>
          ) : (
            filtered.map(campaign => {
              const brand = campaign.brand_profiles as any
              return (
                <div key={campaign.id} className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0">
                        {brand?.company_name?.charAt(0) || 'B'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{brand?.company_name}</div>
                        <div className="text-xs text-gray-500">{brand?.industry || campaign.category}</div>
                      </div>
                    </div>
                  </div>

                  <Link href={`/creator/explore/${campaign.id}`} className="flex-1">
                    <h3 className="font-bold text-lg text-[#202020] mb-2 line-clamp-2 group-hover:text-[#3C83F9] transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(campaign.requirements as any)?.niches?.map((niche: string) => (
                        <span key={niche} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{niche}</span>
                      ))}
                    </div>
                  </Link>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 font-semibold text-[#202020]">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Max ${campaign.budget_per_creator}
                    </div>
                    {campaign.deadline && (
                      <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Quick Apply hover button */}
                  <button
                    onClick={() => { setQuickApplyId(campaign.id); setPitch('') }}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 bg-[#202020] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" /> Quick Apply
                  </button>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Quick Apply Dialog */}
      <Dialog open={!!quickApplyId} onOpenChange={open => { if (!open) setQuickApplyId(null) }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Quick Apply</DialogTitle>
          </DialogHeader>
          {submitted ? (
            <div className="py-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <div className="font-bold text-[#202020]">Application sent!</div>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-gray-500">Write a short pitch to introduce yourself to this brand.</p>
              <textarea
                value={pitch}
                onChange={e => setPitch(e.target.value)}
                placeholder="Hi, I'm excited about this campaign because..."
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[120px] resize-none text-sm"
              />
              <button
                onClick={handleQuickApply}
                disabled={submitting || !pitch.trim()}
                className="w-full py-2.5 bg-[#202020] text-white rounded-lg text-sm font-bold hover:bg-black/90 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Sending...' : 'Submit Application'}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}