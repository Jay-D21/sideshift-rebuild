import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { UserCheck, Search, Filter, Download, Check, X, Eye, MessageSquare } from 'lucide-react'

export default async function ApplicantsPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: applications } = await (supabase as any)
    .from('applications')
    .select('*, campaigns(title, budget_per_creator), creator_profiles(username, avatar_url, follower_count, categories)')
    .order('applied_at', { ascending: false })

  const list = applications || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Applicants</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review, shortlist, and message creators who applied to your briefs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 bg-gray-100 text-[#202020] px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All (20)', 'Hired (8)', 'Shortlisted (4)', 'Applied (5)', 'Declined (3)'].map((tab, idx) => (
            <button
              key={tab}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                idx === 0 ? 'bg-[#202020] text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicants..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">Campaign</th>
                <th className="py-3.5 px-4">Followers</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Rate</th>
                <th className="py-3.5 px-4">Pitch</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {list.map((app: any) => {
                const creator = app.creator_profiles || {}
                const campaign = app.campaigns || {}
                return (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username || 'Creator'}&background=E0F5FF&color=202020`}
                          alt={creator.username}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#202020]">@{creator.username || 'creator'}</p>
                          <p className="text-[10px] text-gray-400">{creator.categories?.[0] || 'UGC'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {campaign.title || 'General Brief'}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {creator.follower_count ? `${(creator.follower_count / 1000).toFixed(0)}K` : '50K+'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        app.status === 'hired' || app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'shortlisted'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : app.status === 'declined'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#202020]">
                      ${campaign.budget_per_creator || 450}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-gray-500">
                      {app.pitch || 'Excited to work on this campaign!'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href="/dashboard/messages"
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                          title="Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Approve / Hire"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
