import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { FileText, Play, Eye, ThumbsUp, MessageCircle, Share2, ExternalLink } from 'lucide-react'

export default async function PostsPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: submissions } = await (supabase as any)
    .from('submissions')
    .select('*, creator_profiles(username, avatar_url), applications(campaigns(title))')
    .order('submitted_at', { ascending: false })

  const list = submissions || []

  const stats = [
    { label: 'Total Posts', value: list.length.toString() },
    { label: 'Total Views', value: '450K' },
    { label: 'Total Spend', value: '$3,800' },
    { label: 'Avg CPM', value: '$8.44' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Live Posts & Content</h1>
        <p className="text-sm text-gray-500 mt-0.5">Track video deliverables, creator postings, and content metrics.</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">{s.label}</span>
            <p className="text-2xl font-bold text-[#202020] mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#202020]">Published Content</h2>
          <span className="text-xs text-gray-400 font-medium">{list.length} deliverables</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Creator</th>
                <th className="py-3.5 px-4">Campaign</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {list.map((sub: any) => {
                const creator = sub.creator_profiles || {}
                const campaign = sub.applications?.campaigns || {}
                return (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username || 'C'}&background=E0F5FF&color=202020`}
                          alt={creator.username}
                          className="w-7 h-7 rounded-full object-cover border"
                        />
                        <span className="font-bold text-[#202020]">@{creator.username || 'creator'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {campaign.title || 'UGC Campaign'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        sub.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">
                      v{sub.version || 1}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={sub.video_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Watch <ExternalLink className="w-3 h-3" />
                      </a>
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
