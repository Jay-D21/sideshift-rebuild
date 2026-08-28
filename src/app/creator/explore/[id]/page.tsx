'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft, Clock, DollarSign, CheckCircle2 } from 'lucide-react'

export default function CampaignDetailPage() {
  const { userId } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [pitch, setPitch] = useState('')
  const [proposedRate, setProposedRate] = useState('')
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    async function loadCampaign() {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data } = await supabase
        .from('campaigns')
        .select(`
          *,
          brand_profiles(company_name, logo_url, industry, description, website)
        `)
        .eq('id', params.id as string)
        .single()
        
      setCampaign(data)
      setLoading(false)
    }
    loadCampaign()
  }, [params.id])

  const handleApply = async () => {
    setApplying(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    if (userId && campaign) {
      // Get creator ID
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, creator_profiles(id)')
        .eq('user_id', userId)
        .single()
        
      if (profile && profile.creator_profiles?.[0]?.id) {
        const creatorId = profile.creator_profiles[0].id
        await supabase.from('applications').insert({
          campaign_id: campaign.id,
          creator_id: creatorId,
          status: 'applied',
          pitch,
          proposed_rate: Number(proposedRate) || campaign.budget_per_creator,
        } as any)
        
        router.push('/creator/campaigns')
      }
    }
    setApplying(false)
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>
  if (!campaign) return <div className="p-8 text-center text-gray-500">Campaign not found</div>

  const brand = campaign.brand_profiles

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href="/creator/explore" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0 overflow-hidden">
                {brand?.logo_url ? (
                  <img src={brand.logo_url} alt={brand?.company_name} className="w-full h-full object-cover" />
                ) : (
                  brand?.company_name?.charAt(0) || 'B'
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#202020]">{campaign.title}</h1>
                <div className="text-sm font-medium text-gray-500">by {brand?.company_name} in {brand?.industry || campaign.category}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-bold">
                <DollarSign className="w-4 h-4" /> Max ${campaign.budget_per_creator}
              </div>
              {campaign.deadline && (
                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-bold">
                  <Clock className="w-4 h-4" /> Due: {new Date(campaign.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setShowApply(true)}
            className="px-8 py-3 bg-[#3C83F9] text-white rounded-xl font-bold hover:bg-blue-600 transition-colors w-full md:w-auto"
          >
            Apply Now
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-bold text-[#202020] mb-3">About the Campaign</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{campaign.description}</p>
            </section>
            
            <section>
              <h2 className="text-lg font-bold text-[#202020] mb-3">Creative Brief</h2>
              <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{campaign.brief || 'No specific brief provided.'}</p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-[#202020] mb-4">Requirements</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Deliverables</div>
                  <ul className="text-sm font-medium text-[#202020] space-y-1">
                    {campaign.deliverables?.map((d: string) => (
                      <li key={d} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase mb-1 mt-4">Target Niches</div>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.requirements?.niches?.map((n: string) => (
                      <span key={n} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">{n}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-[#202020] mb-2">About {brand?.company_name}</h3>
              <p className="text-sm text-gray-600 mb-3">{brand?.description || 'No description available.'}</p>
              {brand?.website && (
                <a href={brand.website} target="_blank" rel="noreferrer" className="text-sm text-[#3C83F9] font-medium hover:underline">
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#202020]">Apply to {brand?.company_name}</h2>
              <p className="text-sm text-gray-500">Tell the brand why you're a great fit.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Your Pitch</label>
                <textarea
                  value={pitch}
                  onChange={e => setPitch(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[120px] resize-none"
                  placeholder="Hi! I love your brand and I think I'd be perfect for this because..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Proposed Rate ($)</label>
                <input
                  type="number"
                  value={proposedRate}
                  onChange={e => setProposedRate(e.target.value)}
                  placeholder={campaign.budget_per_creator.toString()}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use their suggested rate.</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setShowApply(false)}
                className="px-4 py-2 font-medium text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply}
                disabled={applying}
                className="px-6 py-2 bg-[#3C83F9] text-white font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {applying ? 'Sending...' : 'Send Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
