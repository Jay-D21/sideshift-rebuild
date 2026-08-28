import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Flame, Star, Trophy, Sparkles, ArrowRight } from 'lucide-react'
import CreatorHomeClient from './CreatorHomeClient'

export default async function CreatorHomePage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  let creatorId: string | null = null
  let totalEarned = 0
  let campaigns: { id: string; title: string; budget: number; brand: string; deliverables: string }[] = []

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (profile) {
      const { data: cp } = await (supabase as any)
        .from('creator_profiles')
        .select('id')
        .eq('profile_id', profile.id)
        .single()
      if (cp) creatorId = cp.id
    }
  }

  if (creatorId) {
    // Total earned from completed payouts
    const { data: txns } = await (supabase as any)
      .from('transactions')
      .select('amount')
      .eq('creator_id', creatorId)
      .eq('status', 'completed')
      .eq('type', 'payout')
    if (txns) totalEarned = txns.reduce((sum: number, t: any) => sum + (t.amount ?? 0), 0)

    // Active campaigns the creator can apply to (open status)
    const { data: openCampaigns } = await (supabase as any)
      .from('campaigns')
      .select('id, title, budget, deliverables, brand_profiles(brand_name)')
      .eq('status', 'active')
      .limit(4)

    if (openCampaigns) {
      campaigns = openCampaigns.map((c: any) => ({
        id: c.id,
        title: c.title,
        budget: c.budget ?? 0,
        brand: c.brand_profiles?.brand_name ?? 'Brand',
        deliverables: c.deliverables ?? '',
      }))
    }
  }

  const milestoneGoal = 100
  const progressPct = Math.min(100, totalEarned > 0 ? Math.round((totalEarned / milestoneGoal) * 100) : 0)
  const firstMilestone = totalEarned < 1 ? 1 : milestoneGoal

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const todayIdx = new Date().getDay()

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Creator Level 1 · Bronze Rank
          </div>
          <h1 className="text-2xl font-bold text-[#202020]">Welcome back to CreatorFlow!</h1>
          <p className="text-xs text-gray-500 mt-0.5">Complete daily tasks to rank up and unlock exclusive high-paying brand briefs.</p>
        </div>
        <Link
          href="/creator/explore"
          className="bg-[#202020] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-black/90 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
        >
          Browse Gigs <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">What you've earned</span>
              <Link href="/creator/wallet" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                View Wallet <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#202020]">
                ${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400 font-medium">USD</span>
            </div>
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>First milestone: ${firstMilestone.toFixed(2)}</span>
                <span>{progressPct}% to goal</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                  style={{ width: `${Math.max(2, progressPct)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Daily tasks — interactive, handled by client wrapper */}
          <CreatorHomeClient hasProfile={!!creatorId} />

          {/* Campaign Matches */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202020]">Top Campaign Matches For You</h2>
              <Link href="/creator/explore" className="text-xs font-bold text-blue-600 hover:underline">
                View all briefs →
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-gray-400">No campaigns available right now</p>
                <p className="text-xs text-gray-400 mt-1">Check back soon — new gigs are posted daily.</p>
                <Link href="/creator/explore" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                  Browse explore <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Active</span>
                      <span className="text-xs font-bold text-[#202020]">${c.budget.toLocaleString()}</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#202020]">{c.title}</h3>
                    <p className="text-[11px] text-gray-500">{c.brand}{c.deliverables ? ` · ${c.deliverables}` : ''}</p>
                    <Link
                      href={`/creator/explore/${c.id}`}
                      className="mt-2 block text-center text-xs font-bold bg-white border border-gray-200 hover:bg-black hover:text-white py-1.5 rounded-lg transition-colors"
                    >
                      Apply Now
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Streak */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-base font-bold text-[#202020]">0 Day Streak</h2>
              </div>
              <span className="text-[11px] text-gray-400">Log in daily</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              {weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-400">{day}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    idx === todayIdx ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {idx === todayIdx ? '🔥' : '·'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard — illustrative (platform-wide top earners) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-base font-bold text-[#202020]">Leaderboard</h2>
              </div>
              <span className="text-xs font-bold text-gray-400">Top Earners</span>
            </div>

            <div className="space-y-2.5 divide-y divide-gray-100">
              {[
                { badge: '👑', name: 'Alex Rivera', handle: 'alextechtok', earned: '$28,000' },
                { badge: '🥈', name: 'Jordan Gaming', handle: 'jordangaming', earned: '$22,000' },
                { badge: '🥉', name: 'Lucas Finance', handle: 'lucasfinance', earned: '$20,000' },
                { badge: '⭐', name: 'Priya Style', handle: 'priyastyle', earned: '$18,500' },
                { badge: '⭐', name: 'Kai Travel', handle: 'kaitravel', earned: '$15,000' },
              ].map((u, i) => (
                <div key={i} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm w-4 text-gray-400">{u.badge}</span>
                    <div>
                      <p className="font-bold text-[#202020]">{u.name}</p>
                      <p className="text-[10px] text-gray-400">@{u.handle}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600">{u.earned}</span>
                </div>
              ))}
            </div>

            {/* Current user's position */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs bg-orange-50/60 p-3 rounded-xl border border-orange-200/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-orange-700">#–</span>
                <span className="font-bold text-[#202020]">You</span>
              </div>
              <span className="font-bold text-[#202020]">
                ${totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
