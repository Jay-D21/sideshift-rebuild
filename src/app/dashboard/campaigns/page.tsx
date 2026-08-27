import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { Plus, Search, MoreHorizontal } from 'lucide-react'

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

  const { data: { user } } = await supabase.auth.getUser()
  
  let campaigns: Database['public']['Tables']['campaigns']['Row'][] = []
  
  if (user) {
    const { data: brand } = await (supabase
      .from('brand_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single() as any)

    if (brand) {
      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false })
      
      if (data) campaigns = data
    }
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

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active and past creator campaigns.</p>
        </div>
        <Link 
          href="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search campaigns..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-gray-200 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {campaigns.length} campaigns
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Budget</th>
                <th className="px-6 py-3">Deliverables</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
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
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#202020]">{c.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(c.status)} capitalize`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#202020]">${c.budget}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Max ${c.budget_per_creator}/creator</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.deliverables && c.deliverables[0] ? c.deliverables[0] : 'None specified'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-[#202020] transition-colors p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
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
