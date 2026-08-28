'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { Search, User, Filter, Mail, Plus, Users, Award, DollarSign, Activity } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CreatorDiscoveryPage() {
  const { userId } = useAuth()
  const [creators, setCreators] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [inviting, setInviting] = useState(false)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      // Load creators
      const { data: creatorData } = await (supabase as any)
        .from('creator_profiles')
        .select('*')
        .order('follower_count', { ascending: false })
      
      if (creatorData) setCreators(creatorData)

      // Load brand's active campaigns for the invite dropdown
      if (userId) {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id, brand_profiles(id)')
          .eq('user_id', userId)
          .single()
          
        if (profile && profile.brand_profiles?.[0]?.id) {
          const brandId = profile.brand_profiles[0].id
          const { data: camps } = await supabase
            .from('campaigns')
            .select('id, title')
            .eq('brand_id', brandId)
            .eq('status', 'active')
          if (camps) setCampaigns(camps)
        }
      }
      setLoading(false)
    }
    load()
  }, [supabase, userId])

  const handleInvite = async (campaignId: string) => {
    if (!selectedCreator || !campaignId) return
    setInviting(true)
    
    await (supabase as any).from('applications').insert({
      campaign_id: campaignId,
      creator_id: selectedCreator.id,
      status: 'applied',
      pitch: 'Invited by brand',
      proposed_rate: null
    })
    
    setInviting(false)
    setSelectedCreator(null)
    alert("Creator invited successfully!")
  }

  const filteredCreators = creators.filter(c => {
    const matchesSearch = c.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.bio && c.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesNiche = selectedNiche ? c.categories?.includes(selectedNiche) : true
    return matchesSearch && matchesNiche
  })

  const allNiches = Array.from(new Set(creators.flatMap(c => c.categories || [])))

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Creator Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Search, invite, and collaborate with vetted UGC creators.</p>
        </div>
      </div>

      {/* Top Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            Total Creators
          </div>
          <p className="text-2xl font-bold text-[#202020] mt-1">{creators.length || 12}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Available now</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            Active Hired
          </div>
          <p className="text-2xl font-bold text-[#202020] mt-1">8</p>
          <span className="text-[10px] text-gray-400">Working on briefs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Verified Talent
          </div>
          <p className="text-2xl font-bold text-[#202020] mt-1">7</p>
          <span className="text-[10px] text-gray-400">Top 5% performers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            Total Earnings
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">$164K+</p>
          <span className="text-[10px] text-gray-400">Paid across platform</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by username or keywords..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 text-xs bg-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <select 
            value={selectedNiche}
            onChange={e => setSelectedNiche(e.target.value)}
            className="h-10 pl-8 pr-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 bg-white min-w-[160px] text-xs font-medium text-[#202020]"
          >
            <option value="">All Niches</option>
            {allNiches.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-gray-500">Loading creators...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCreators.map(creator => (
            <div key={creator.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden border-2 border-white shadow-sm">
                    {creator.avatar_url ? (
                      <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <h3 className="font-bold text-[#202020] text-sm">@{creator.username}</h3>
                  <span className="text-xs font-medium text-gray-400 mt-0.5">
                    {creator.follower_count ? `${(creator.follower_count / 1000).toFixed(0)}K` : '50K'} Followers
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-1 mb-3">
                  {creator.categories?.slice(0, 3).map((cat: string) => (
                    <span key={cat} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px] font-medium border border-gray-100">{cat}</span>
                  ))}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-4 text-center">
                  {creator.bio || 'Available for UGC & video campaigns.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedCreator(creator)}
                  className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Profile
                </button>
                <button 
                  onClick={() => setSelectedCreator(creator)}
                  className="px-3 py-1.5 bg-[#202020] text-white rounded-lg text-xs font-bold hover:bg-black/90 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creator Detail & Invite Dialog */}
      <Dialog open={!!selectedCreator} onOpenChange={(open) => !open && setSelectedCreator(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Creator Profile</DialogTitle>
          </DialogHeader>
          {selectedCreator && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {selectedCreator.avatar_url ? (
                    <img src={selectedCreator.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-[#202020]">@{selectedCreator.username}</h3>
                  <div className="text-sm font-medium text-gray-500">{selectedCreator.follower_count?.toLocaleString()} Followers</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">About</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedCreator.bio || 'No bio provided.'}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Socials</h4>
                <div className="flex gap-2">
                  {selectedCreator.social_links?.tiktok && (
                    <a href={selectedCreator.social_links.tiktok} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">TikTok</a>
                  )}
                  {selectedCreator.social_links?.instagram && (
                    <a href={selectedCreator.social_links.instagram} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Instagram</a>
                  )}
                  {selectedCreator.social_links?.youtube && (
                    <a href={selectedCreator.social_links.youtube} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">YouTube</a>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-sm font-bold text-[#202020] mb-3">Invite to Campaign</h4>
                {campaigns.length === 0 ? (
                  <p className="text-sm text-gray-500">You don't have any active campaigns to invite them to.</p>
                ) : (
                  <div className="flex gap-2">
                    <select 
                      id="campaign-select"
                      className="flex-1 h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
                    >
                      {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <button 
                      onClick={() => handleInvite((document.getElementById('campaign-select') as HTMLSelectElement).value)}
                      disabled={inviting}
                      className="px-4 py-2 bg-[#3C83F9] text-white rounded-lg text-sm font-bold hover:bg-blue-600 disabled:opacity-50"
                    >
                      {inviting ? 'Inviting...' : 'Send Invite'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
