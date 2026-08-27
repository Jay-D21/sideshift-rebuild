import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { BarChart2, Users, Video, DollarSign, Target } from 'lucide-react'

export default async function AnalyticsPage() {
  const { userId } = await auth()
  if (!userId) return <div className="p-8">Not authenticated</div>

  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('id, brand_profiles(id)')
    .eq('user_id', userId)
    .single()

  let metrics = { totalCampaigns: 0, activeCampaigns: 0, totalApplicants: 0, creatorsHired: 0, contentPieces: 0, totalSpent: 0 }
  let campaignPerformance: any[] = []

  if (profile?.brand_profiles?.[0]?.id) {
    const brandId = profile.brand_profiles[0].id
    const { data: campaigns } = await (supabase as any).from('campaigns').select('id, status, title').eq('brand_id', brandId)
    if (campaigns) {
      metrics.totalCampaigns = campaigns.length
      metrics.activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length
      const ids = campaigns.map((c: any) => c.id)
      if (ids.length > 0) {
        const { data: apps } = await (supabase as any).from('applications').select('id, status, campaign_id').in('campaign_id', ids)
        if (apps) {
          metrics.totalApplicants = apps.length
          metrics.creatorsHired = apps.filter((a: any) => a.status === 'approved').length
          campaignPerformance = campaigns.map((c: any) => ({
            title: c.title,
            applicants: apps.filter((a: any) => a.campaign_id === c.id).length,
          })).sort((a: any, b: any) => b.applicants - a.applicants)
        }
        const { data: subs } = await (supabase as any).from('submissions').select('id').in('campaign_id', ids).eq('status', 'approved')
        if (subs) metrics.contentPieces = subs.length
        const { data: txns } = await (supabase as any).from('transactions').select('amount').eq('brand_id', brandId).eq('status', 'completed')
        if (txns) metrics.totalSpent = txns.reduce((acc: number, t: any) => acc + (t.amount || 0), 0)
      }
    }
  }

  const stats = [
    { label: 'Total Campaigns', value: metrics.totalCampaigns, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Creators Hired', value: metrics.creatorsHired, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Content Pieces', value: metrics.contentPieces, icon: Video, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Spent', value: `$${metrics.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-gray-700', bg: 'bg-gray-50' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Campaign performance overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
              <div className="text-2xl font-bold text-[#202020] mt-0.5">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#202020] mb-5 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-gray-400" /> Campaign Performance
        </h2>
        {campaignPerformance.length === 0 ? (
          <div className="text-sm text-gray-500 py-10 text-center">
            No campaigns yet. <a href="/dashboard/campaigns/new" className="text-[#3C83F9] hover:underline">Create your first campaign →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {campaignPerformance.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#202020]">{c.title}</span>
                  <span className="text-gray-500">{c.applicants} applicants</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-[#3C83F9] h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((c.applicants / Math.max(campaignPerformance[0]?.applicants || 1, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
