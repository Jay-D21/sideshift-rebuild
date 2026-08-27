import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { Plus, Users, Play, DollarSign, Activity } from 'lucide-react'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Read-only on server components
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  
  // Get brand profile to resolve to their campaigns
  let brandId = null
  if (user) {
    const { data: brand } = await (supabase
      .from('brand_profiles')
      .select('id, company_name')
      .eq('user_id', user.id)
      .single() as any)
    if (brand) brandId = brand.id
  }

  // Aggregate stats (mock data or real if you want to query)
  let activeCampaigns = 0
  
  if (brandId) {
    const { count } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId)
      .eq('status', 'active')
    activeCampaigns = count || 0
  }

  const stats = [
    { label: 'Active Campaigns', value: activeCampaigns.toString(), icon: Play, trend: '+1 this week' },
    { label: 'Total Applicants', value: '12', icon: Users, trend: '+4 today' },
    { label: 'Creators Hired', value: '3', icon: Activity, trend: '2 pending review' },
    { label: 'Total Spent', value: '$1,250', icon: DollarSign, trend: 'Across 2 campaigns' },
  ]

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here's what's happening with your campaigns.</p>
        </div>
        <Link 
          href="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </div>
            <div className="text-2xl font-bold text-[#202020] mb-1">{stat.value}</div>
            <div className="text-xs text-emerald-600 font-medium">{stat.trend}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#202020] mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-[#202020]">No activity yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            When creators apply to your campaigns or submit content, you'll see it here.
          </p>
        </div>
      </div>
    </div>
  )
}
