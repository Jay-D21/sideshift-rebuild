'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, Star, Trophy, Sparkles, CheckCircle2, ArrowRight, Video, TrendingUp, DollarSign, Wallet } from 'lucide-react'

export default function CreatorHomePage() {
  const [tasks, setTasks] = useState([
    { id: 'gigs', title: 'Get started applying to gigs', xp: '+22 XP', done: false, desc: '3 campaign matches (98%, 96%, 88%) ready for you' },
    { id: 'socials', title: 'Fill in: TikTok, Instagram', xp: '+10 XP', done: true, desc: 'Verify your reach to unlock premium gigs' },
    { id: 'training', title: 'Start your training', xp: '+15 XP', done: false, desc: 'Complete the 60s creator onboarding module' },
  ])

  const toggleTask = (id: string) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const leaderboard = [
    { rank: 1, name: 'Alex Rivera', handle: 'alextechtok', earned: '$28,000', badge: '👑' },
    { rank: 2, name: 'Jordan Gaming', handle: 'jordangaming', earned: '$22,000', badge: '🥈' },
    { rank: 3, name: 'Lucas Finance', handle: 'lucasfinance', earned: '$20,000', badge: '🥉' },
    { rank: 4, name: 'Priya Style', handle: 'priyastyle', earned: '$18,500', badge: '⭐' },
    { rank: 5, name: 'Kai Travel', handle: 'kaitravel', earned: '$15,000', badge: '⭐' },
  ]

  const weekDays = [
    { day: 'Su', active: false },
    { day: 'Mo', active: false },
    { day: 'Tu', active: false },
    { day: 'We', active: false },
    { day: 'Th', active: false },
    { day: 'Fr', active: true },
    { day: 'Sa', active: false },
  ]

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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">What you've earned</span>
              <Link href="/creator/wallet" className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1">
                View Wallet <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-[#202020]">$0.00</span>
              <span className="text-xs text-gray-400 font-medium">USD</span>
            </div>

            {/* Goal Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>First milestone: $1.00</span>
                <span>0% to goal</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 w-[5%] rounded-full" />
              </div>
            </div>
          </div>

          {/* Gamified Daily Plan */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                Here's your plan today!
              </h2>
              <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
                47 XP Available
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    task.done
                      ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                      : 'bg-gray-50/60 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                    task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {task.done && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold ${task.done ? 'line-through text-gray-500' : 'text-[#202020]'}`}>
                        {task.title}
                      </p>
                      <span className="text-xs font-bold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full shrink-0">
                        {task.xp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Match Gigs Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#202020]">Top Campaign Matches For You</h2>
              <Link href="/creator/explore" className="text-xs font-bold text-blue-600 hover:underline">
                View all briefs →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    98% Match
                  </span>
                  <span className="text-xs font-bold text-[#202020]">$500</span>
                </div>
                <h3 className="font-bold text-xs text-[#202020]">Summer TikTok Challenge</h3>
                <p className="text-[11px] text-gray-500">TechStartup Inc · 3x 30s TikTok videos</p>
                <Link
                  href="/creator/explore"
                  className="mt-2 block text-center text-xs font-bold bg-white border border-gray-200 hover:bg-black hover:text-white py-1.5 rounded-lg transition-colors"
                >
                  Apply Now
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    96% Match
                  </span>
                  <span className="text-xs font-bold text-[#202020]">$600</span>
                </div>
                <h3 className="font-bold text-xs text-[#202020]">Beauty Tutorial UGC</h3>
                <p className="text-[11px] text-gray-500">GlowBeauty Co · 2x tutorial videos</p>
                <Link
                  href="/creator/explore"
                  className="mt-2 block text-center text-xs font-bold bg-white border border-gray-200 hover:bg-black hover:text-white py-1.5 rounded-lg transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* Streak Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                <h2 className="text-base font-bold text-[#202020]">0 Day Streak</h2>
              </div>
              <span className="text-[11px] text-gray-400">Log in daily</span>
            </div>

            {/* Week days */}
            <div className="flex justify-between items-center pt-2">
              {weekDays.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-gray-400">{d.day}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    d.active ? 'bg-orange-500 text-white shadow' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {d.active ? '🔥' : '·'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-base font-bold text-[#202020]">Leaderboard</h2>
              </div>
              <span className="text-xs font-bold text-gray-400">Top Earners</span>
            </div>

            <div className="space-y-2.5 divide-y divide-gray-100">
              {leaderboard.map((user) => (
                <div key={user.rank} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm w-4 text-gray-400">{user.badge}</span>
                    <div>
                      <p className="font-bold text-[#202020]">{user.name}</p>
                      <p className="text-[10px] text-gray-400">@{user.handle}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-600">{user.earned}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs bg-orange-50/60 p-3 rounded-xl border border-orange-200/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-orange-700">#42</span>
                <span className="font-bold text-[#202020]">You</span>
              </div>
              <span className="font-bold text-[#202020]">$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
