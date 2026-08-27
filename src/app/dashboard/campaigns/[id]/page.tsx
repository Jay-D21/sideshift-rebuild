'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { ArrowLeft, User, DollarSign, Calendar, Eye, FileText, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function CampaignDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('kanban')
  
  // Data
  const [campaign, setCampaign] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Dialog state
  const [selectedApp, setSelectedApp] = useState<any>(null)

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function load() {
      // Load campaign
      const { data: campData } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', params.id as string)
        .single()
      
      setCampaign(campData)

      // Load applications
      const { data: appsDataRes } = await supabase
        .from('applications')
        .select(`
          *,
          creator_profiles (
            id, username, avatar_url, categories, bio, social_links
          )
        `)
        .eq('campaign_id', params.id as string)
        
      if (appsDataRes) {
        const appsData = appsDataRes as any[]
        // We'll map them to our kanban columns based on status.
        // Since DB only has pending, approved, rejected, withdrawn, we'll map pending->applied, approved->hired
        // For a true kanban, we'd need more DB statuses, but we'll adapt.
        const mapped = appsData.map(app => ({
          ...app,
          kanban_status: app.status === 'pending' ? 'applied' : 
                         app.status === 'approved' ? 'hired' : 
                         app.status
        }))
        setApplications(mapped)
      }
      
      setLoading(false)
    }
    load()
  }, [params.id, supabase])

  const handleStatusChange = async (appId: string, newStatus: string) => {
    // Optimistic UI update
    setApplications(prev => prev.map(a => 
      a.id === appId ? { ...a, kanban_status: newStatus } : a
    ))

    // Map back to DB statuses if needed
    let dbStatus = newStatus
    if (newStatus === 'applied') dbStatus = 'pending'
    if (newStatus === 'shortlisted') dbStatus = 'pending' // fallback for db constraint
    if (newStatus === 'hired') dbStatus = 'approved'
    if (newStatus === 'submitted') dbStatus = 'approved'
    if (newStatus === 'completed') dbStatus = 'approved'

    await (supabase as any).from('applications').update({
      status: dbStatus
    }).eq('id', appId)
  }

  if (loading) return <div className="p-8 text-gray-500">Loading campaign...</div>
  if (!campaign) return <div className="p-8 text-gray-500">Campaign not found</div>

  const columns = [
    { id: 'applied', label: 'Applied' },
    { id: 'shortlisted', label: 'Shortlisted' },
    { id: 'hired', label: 'Hired' },
    { id: 'submitted', label: 'Content Submitted' },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <Link href="/dashboard/campaigns" className="text-gray-500 hover:text-black flex items-center gap-1 text-sm font-medium mb-4 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#202020]">{campaign.title}</h1>
            <div className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${campaign.budget} Budget</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Due: {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'kanban' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Applicants Kanban
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'kanban' && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 h-full min-w-max pb-4">
            {columns.map(col => {
              const columnApps = applications.filter(a => a.kanban_status === col.id)
              return (
                <div key={col.id} className="w-80 flex flex-col bg-gray-50 rounded-xl border border-gray-200 shrink-0">
                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-[#202020] text-sm">{col.label}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
                      {columnApps.length}
                    </span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {columnApps.map(app => (
                      <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 overflow-hidden shrink-0">
                            {app.creator_profiles?.avatar_url ? (
                              <img src={app.creator_profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              app.creator_profiles?.username?.charAt(0).toUpperCase() || 'C'
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-[#202020] text-sm truncate">@{app.creator_profiles?.username}</div>
                            <div className="text-xs text-gray-500">{new Date(app.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {app.creator_profiles?.categories?.slice(0, 2).map((cat: string) => (
                            <span key={cat} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">
                              {cat}
                            </span>
                          ))}
                          {(app.creator_profiles?.categories?.length || 0) > 2 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">
                              +{(app.creator_profiles?.categories?.length || 0) - 2}
                            </span>
                          )}
                        </div>
                        <div className="pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                          <select 
                            value={app.kanban_status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="w-full h-8 px-2 text-xs font-medium rounded-md border border-gray-200 bg-gray-50 outline-none focus:border-gray-400"
                          >
                            {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                    {columnApps.length === 0 && (
                      <div className="text-center py-8 text-sm text-gray-400 font-medium">
                        No creators here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-3xl shadow-sm">
          <h2 className="text-lg font-bold text-[#202020] mb-4">Campaign Overview</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
              <p className="text-gray-700">{campaign.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Creative Brief</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{campaign.brief || 'No brief provided.'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Deliverables</h3>
              <ul className="list-disc list-inside text-gray-700">
                {campaign.deliverables?.map((d: string) => <li key={d}>{d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {selectedApp.creator_profiles?.avatar_url ? (
                    <img src={selectedApp.creator_profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#202020]">@{selectedApp.creator_profiles?.username}</h3>
                  <div className="text-sm text-gray-500">Proposed Rate: ${selectedApp.proposed_rate}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Creator Bio</h4>
                <p className="text-sm text-gray-700">{selectedApp.creator_profiles?.bio || 'No bio provided.'}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Their Pitch</h4>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedApp.pitch || 'No pitch provided.'}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Socials</h4>
                <div className="flex gap-2">
                  {selectedApp.creator_profiles?.social_links?.tiktok && (
                    <a href={selectedApp.creator_profiles.social_links.tiktok} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">TikTok</a>
                  )}
                  {selectedApp.creator_profiles?.social_links?.instagram && (
                    <a href={selectedApp.creator_profiles.social_links.instagram} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">Instagram</a>
                  )}
                  {selectedApp.creator_profiles?.social_links?.youtube && (
                    <a href={selectedApp.creator_profiles.social_links.youtube} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#3C83F9] bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">YouTube</a>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
