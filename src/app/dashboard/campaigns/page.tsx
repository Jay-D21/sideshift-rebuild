import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from '@clerk/nextjs/server'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal, Sparkles, LayoutTemplate } from 'lucide-react'

export default async function CampaignsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} 
      }
    }
  )

  const { userId } = await auth()
  
  let campaigns: Database['public']['Tables']['campaigns']['Row'][] = []
  
  if (userId) {
    const { data: profile } = await (supabase
      .from('profiles')
      .select('id, brand_profiles(id)')
      .eq('user_id', userId)
      .single() as any)

    if (profile && profile.brand_profiles?.[0]?.id) {
      const brandId = profile.brand_profiles[0].id
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
      
      if (data && data.length > 0) campaigns = data
    }
  }

  // Fallback to all campaigns if brand has none
  if (campaigns.length === 0) {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) campaigns = data
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const activeCount = campaigns.filter(c => c.status === 'active').length
  const draftCount = campaigns.filter(c => c.status === 'draft').length
  const completedCount = campaigns.filter(c => c.status === 'completed').length

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active and past creator campaigns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-black px-3.5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <LayoutTemplate className="w-3.5 h-3.5" /> View Templates
          </Link>
          <Link 
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {[
          { label: 'All', count: campaigns.length },
          { label: 'Active', count: activeCount },
          { label: 'Draft', count: draftCount },
          { label: 'Completed', count: completedCount },
        ].map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              idx === 0 ? 'bg-[#202020] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search campaigns..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-gray-200 text-xs outline-none focus:border-gray-400"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {campaigns.length} campaigns
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Campaign</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Deliverables</th>
                <th className="px-6 py-3.5">Created</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    You haven't created any campaigns yet.
                  </td>
                </tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#202020] text-sm">{c.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(c.status)} capitalize`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#202020]">${c.budget || 2000}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">${c.budget_per_creator || 400}/creator</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.deliverables && c.deliverables[0] ? c.deliverables[0] : '2x TikTok videos'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/campaigns/${c.id}`}
                        className="text-xs font-bold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
