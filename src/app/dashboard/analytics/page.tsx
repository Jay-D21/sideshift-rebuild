import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { BarChart2, Users, Video, DollarSign, Target, Calendar, RefreshCw, Eye, ThumbsUp, MessageSquare, Share2 } from 'lucide-react'

export default async function AnalyticsPage() {
  const { userId } = await auth()
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

  let metrics = { totalCampaigns: 5, activeCampaigns: 3, totalApplicants: 20, creatorsHired: 8, contentPieces: 5, totalSpent: 2400 }
  let campaignPerformance = [
    { title: 'Summer TikTok Challenge', applicants: 4, views: '145K', spend: '$1,000' },
    { title: 'Product Unboxing Series', applicants: 4, views: '95K', spend: '$800' },
    { title: 'Beauty Tutorial UGC', applicants: 6, views: '210K', spend: '$600' },
  ]

  const stats = [
    { label: 'Total Views', value: '450.2K', change: '+24.5%', icon: Eye },
    { label: 'Avg Engagement', value: '5.8%', change: '+1.2%', icon: Target },
    { label: 'Total Likes', value: '38.4K', change: '+18.0%', icon: ThumbsUp },
    { label: 'Total Comments', value: '4,120', change: '+9.3%', icon: MessageSquare },
    { label: 'Total Shares', value: '8,950', change: '+32.1%', icon: Share2 },
    { label: 'Approved Posts', value: '5', change: '100% on-time', icon: Video },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Performance Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Cross-platform creator campaign metrics and return on ad spend.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-gray-200 px-3.5 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-500" /> Last 30 Days
          </button>
          <button className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#202020] text-white px-3.5 py-2 rounded-lg hover:bg-black/90 transition-colors shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" /> On-Demand Sync
          </button>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-[11px] font-semibold truncate">{s.label}</span>
              <s.icon className="w-3.5 h-3.5" />
            </div>
            <p className="text-xl font-bold text-[#202020]">{s.value}</p>
            <span className="text-[10px] font-bold text-emerald-600 block">{s.change}</span>
          </div>
        ))}
      </div>

      {/* Chart Visual Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#202020]">Views & Engagement Over Time</h2>
          <span className="text-xs text-gray-400 font-medium">Daily impressions</span>
        </div>

        <div className="h-64 w-full bg-gradient-to-b from-[#E0F5FF]/40 to-transparent rounded-xl border border-blue-100 flex items-end justify-between p-6 gap-3">
          {[40, 65, 45, 80, 60, 95, 75, 110, 90, 130, 105, 145].map((h, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div
                className="w-full bg-[#3C83F9] group-hover:bg-blue-600 rounded-t-md transition-all duration-300"
                style={{ height: `${(h / 150) * 180}px` }}
              />
              <span className="text-[9px] text-gray-400 font-medium">Aug {idx * 2 + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Breakdown Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-gray-400" /> Campaign Breakdown
        </h2>
        <div className="space-y-4">
          {campaignPerformance.map((c) => (
            <div key={c.title} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#202020]">{c.title}</p>
                <span className="text-xs text-gray-400">{c.applicants} applicants · {c.spend} spend</span>
              </div>
              <span className="font-extrabold text-sm text-[#3C83F9]">{c.views} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
