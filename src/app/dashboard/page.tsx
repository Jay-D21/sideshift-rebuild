import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Plus, Users, Play, DollarSign, Activity, ArrowRight, Video, Compass, MessageSquare } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  // Resolve brand profile for the logged-in Clerk user
  let brandId: string | null = null
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (profile) {
      const { data: brand } = await (supabase as any)
        .from('brand_profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .single()
      if (brand) brandId = brand.id
    }
  }

  // Default all metrics to zero — never fall back to seeded/mock data
  let activeCampaigns = 0
  let totalApplicants = 0
  let creatorsHired = 0
  let totalSpent = 0

  type ActivityRow = { handle: string; action: string; color: string; ts: string }
  let recentActivity: ActivityRow[] = []

  if (brandId) {
    const { count: ac } = await (supabase as any)
      .from('campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId)
      .eq('status', 'active')
    activeCampaigns = ac ?? 0

    const { count: ta } = await (supabase as any)
      .from('applications')
      .select('*, campaigns!inner(brand_id)', { count: 'exact', head: true })
      .eq('campaigns.brand_id', brandId)
    totalApplicants = ta ?? 0

    const { count: ch } = await (supabase as any)
      .from('applications')
      .select('*, campaigns!inner(brand_id)', { count: 'exact', head: true })
      .eq('campaigns.brand_id', brandId)
      .eq('status', 'hired')
    creatorsHired = ch ?? 0

    // Sum completed payouts for this brand's campaigns
    const { data: txns } = await (supabase as any)
      .from('transactions')
      .select('amount, campaigns!inner(brand_id)')
      .eq('campaigns.brand_id', brandId)
      .eq('status', 'completed')
    if (txns) totalSpent = txns.reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0)

    // Recent 5 applications for this brand
    const { data: apps } = await (supabase as any)
      .from('applications')
      .select('status, created_at, creator_profiles(profiles(full_name)), campaigns!inner(title, brand_id)')
      .eq('campaigns.brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(5)

    if (apps) {
      recentActivity = apps.map((a: any) => {
        const name = a.creator_profiles?.profiles?.full_name ?? 'A creator'
        const handle = '@' + name.toLowerCase().replace(/\s+/g, '')
        const campaign = a.campaigns?.title ?? 'a campaign'
        const colorMap: Record<string, string> = {
          applied: 'bg-emerald-500',
          shortlisted: 'bg-blue-500',
          hired: 'bg-purple-500',
          declined: 'bg-red-400',
          approved: 'bg-amber-500',
        }
        const actionMap: Record<string, string> = {
          applied: `applied to ${campaign}`,
          shortlisted: `was shortlisted for ${campaign}`,
          hired: `was hired for ${campaign}`,
          declined: `application declined for ${campaign}`,
          approved: `approved for ${campaign}`,
        }
        const ts = new Date(a.created_at)
        const diffH = Math.round((Date.now() - ts.getTime()) / 3600000)
        const timeAgo = diffH < 1 ? 'just now' : diffH < 24 ? `${diffH}h ago` : `${Math.round(diffH / 24)}d ago`
        return { handle, action: actionMap[a.status] ?? a.status, color: colorMap[a.status] ?? 'bg-gray-400', ts: timeAgo }
      })
    }
  }

  const hasCampaign = activeCampaigns > 0
  const hasApplicants = totalApplicants > 0
  const hasHired = creatorsHired > 0

  const stats = [
    { label: 'Active Campaigns', value: activeCampaigns.toString(), icon: Play, trend: 'Running now' },
    { label: 'Total Applicants', value: totalApplicants.toString(), icon: Users, trend: 'Across all campaigns' },
    { label: 'Creators Hired', value: creatorsHired.toString(), icon: Activity, trend: 'Currently working' },
    {
      label: 'Total Spent',
      value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: 'Lifetime spend',
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Your creator engine</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Monitor campaigns, review applicants, and scale your UGC performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/video-library"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-black px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Video className="w-3.5 h-3.5" /> Watch tutorial
          </Link>
          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Launch campaign
          </Link>
        </div>
      </div>

      {/* Milestone Tracker */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-4">
          Onboarding Milestone Tracker
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { done: hasCampaign, step: '1', label: 'Campaign Created', doneText: `${activeCampaigns} active campaign${activeCampaigns !== 1 ? 's' : ''}`, todoText: 'Create your first brief' },
            { done: hasApplicants, step: '2', label: 'Creators Invited', doneText: `${totalApplicants} creator${totalApplicants !== 1 ? 's' : ''} applied`, todoText: 'Browse creator directory' },
            { done: hasHired, step: '3', label: 'Creator Engaged', doneText: `${creatorsHired} creator${creatorsHired !== 1 ? 's' : ''} hired`, todoText: 'Accept first proposal' },
          ].map(m => (
            <div key={m.step} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${m.done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${m.done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {m.done ? '✓' : m.step}
              </div>
              <div>
                <p className="text-xs font-bold text-[#202020]">{m.label}</p>
                <p className="text-[11px] text-gray-500">{m.done ? m.doneText : m.todoText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/campaigns/new" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#202020] hover:-translate-y-0.5 transition-all group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202020]">Launch Campaign</h3>
            <p className="text-xs text-gray-500 mt-1">Post a brief or scan your product URL with AI.</p>
          </div>
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-4">
            Start wizard <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link href="/dashboard/discover" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#202020] hover:-translate-y-0.5 transition-all group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202020]">Select Creators</h3>
            <p className="text-xs text-gray-500 mt-1">Browse 100+ vetted UGC creators by niche and rate.</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-4">
            Explore talent <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link href="/dashboard/messages" className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#202020] hover:-translate-y-0.5 transition-all group flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202020]">Creator Channels</h3>
            <p className="text-xs text-gray-500 mt-1">Coordinate scripts, shipping, and video revisions.</p>
          </div>
          <span className="text-xs font-bold text-purple-600 flex items-center gap-1 mt-4">
            Open inbox <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
            </div>
            <div className="text-2xl font-bold text-[#202020] mb-1">{stat.value}</div>
            <div className="text-xs text-emerald-600 font-medium">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#202020]">Recent Activity</h2>
          <Link href="/dashboard/applicants" className="text-xs font-bold text-blue-600 hover:underline">
            View all applicants →
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-gray-400">No activity yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Activity will appear here once creators apply to your campaigns.
            </p>
            <Link
              href="/dashboard/campaigns/new"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              Launch your first campaign <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 text-xs">
            {recentActivity.map((a, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${a.color}`} />
                  <span className="font-semibold text-[#202020]">{a.handle}</span>
                  <span className="text-gray-500">{a.action}</span>
                </div>
                <span className="text-gray-400">{a.ts}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}