code = """import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { BarChart, Users, CheckCircle, Video, DollarSign, Target } from 'lucide-react'

export default async function AnalyticsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>Not authenticated</div>
  }

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

  const { data: brand } = await (supabase as any)
    .from('profiles')
    .select('id, brand_profiles(id)')
    .eq('user_id', userId)
    .single()

  let metrics = {
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalApplicants: 0,
    creatorsHired: 0,
    contentPieces: 0,
    totalSpent: 0
  }

  let campaignPerformance: any[] = []
  let topCreators: any[] = []

  if (brand && brand.brand_profiles?.[0]?.id) {
    const brandId = brand.brand_profiles[0].id
    // Campaigns
    const { data: campaigns } = await (supabase as any)
      .from('campaigns')
      .select('id, status, title')
      .eq('brand_id', brandId)
        
    if (campaigns) {
      metrics.totalCampaigns = campaigns.length
      metrics.activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length
      
      const campaignIds = campaigns.map((c: any) => c.id)

      if (campaignIds.length > 0) {
        // Applications
        const { data: applications } = await (supabase as any)
          .from('applications')
          .select('id, status, campaign_id, creator_id, creator:creator_profiles(username, avatar_url)')
          .in('campaign_id', campaignIds)
        
        if (applications) {
          metrics.totalApplicants = applications.length
          metrics.creatorsHired = applications.filter((a: any) => a.status === 'approved').length

          // Campaign Performance
          campaignPerformance = campaigns.map((c: any) => {
            const apps = applications.filter((a: any) => a.campaign_id === c.id).length
            return { title: c.title, applicants: apps }
          }).sort((a: any, b: any) => b.applicants - a.applicants).slice(0, 5)

          // Top Creators
          const creatorCounts: Record<string, { count: number, creator: any }> = {}
          applications.forEach((app: any) => {
            if (app.status === 'approved') {
              if (!creatorCounts[app.creator_id]) {
                creatorCounts[app.creator_id] = { count: 0, creator: app.creator }
              }
              creatorCounts[app.creator_id].count++
            }
          })
          topCreators = Object.values(creatorCounts).sort((a: any, b: any) => b.count - a.count).slice(0, 5)
        }

        // Submissions
        const { data: submissions } = await (supabase as any)
          .from('submissions')
          .select('id')
          .in('campaign_id', campaignIds)
          .eq('status', 'approved')

        if (submissions) {
          metrics.contentPieces = submissions.length
        }

        // Transactions
        const { data: transactions } = await (supabase as any)
          .from('transactions')
          .select('amount')
          .eq('brand_id', brandId)
          .eq('status', 'completed')

        if (transactions) {
          metrics.totalSpent = transactions.reduce((acc: number, curr: any) => acc + curr.amount, 0)
        }
      }
    }
  }

  const statCards = [
    { label: 'Total Campaigns', value: metrics.totalCampaigns, icon: Target, color: 'text-blue-500' },
    { label: 'Active Campaigns', value: metrics.activeCampaigns, icon: Target, color: 'text-emerald-500' },
    { label: 'Total Applicants', value: metrics.totalApplicants, icon: Users, color: 'text-purple-500' },
    { label: 'Creators Hired', value: metrics.creatorsHired, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Content Pieces', value: metrics.contentPieces, icon: Video, color: 'text-amber-500' },
    { label: 'Total Spent', value: `$` + metrics.totalSpent, icon: DollarSign, color: 'text-gray-900' }
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your campaign performance and ROI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-[#202020] mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#202020] mb-6">Campaign Performance</h2>
          {campaignPerformance.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center">No campaign data available yet.</div>
          ) : (
            <div className="space-y-4">
              {campaignPerformance.map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-[#202020]">{c.title}</span>
                    <span className="text-gray-500">{c.applicants} applicants</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-[#202020] h-2 rounded-full" 
                      style={{ width: `${Math.min((c.applicants / (campaignPerformance[0]?.applicants || 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#202020] mb-6">Top Performing Creators</h2>
          {topCreators.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center">No creator data available yet.</div>
          ) : (
            <div className="space-y-4">
              {topCreators.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                      {c.creator?.avatar_url && (
                        <img src={c.creator.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="font-medium text-[#202020]">{c.creator?.username || 'Unknown'}</div>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {c.count} Hires
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
"""

with open('src/app/dashboard/analytics/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
