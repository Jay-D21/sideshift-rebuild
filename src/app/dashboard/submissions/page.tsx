import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { FileText } from 'lucide-react'

export default async function SubmissionsPage() {
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

  let submissions: any[] = []

  if (profile?.brand_profiles?.[0]?.id) {
    const brandId = profile.brand_profiles[0].id
    const { data: campaigns } = await (supabase as any).from('campaigns').select('id').eq('brand_id', brandId)
    if (campaigns?.length) {
      const ids = campaigns.map((c: any) => c.id)
      const { data } = await (supabase as any)
        .from('submissions')
        .select('*, campaigns(title), creator_profiles(username, avatar_url)')
        .in('campaign_id', ids)
        .order('created_at', { ascending: false })
      if (data) submissions = data
    }
  }

  const statusColor = (s: string) => {
    switch (s) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'revision': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Content Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve creator-submitted content.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-gray-400" />
            </div>
            <p className="font-semibold text-[#202020]">No submissions yet</p>
            <p className="text-sm text-gray-500 mt-1">Submissions will appear here when creators submit content.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden">
                          {s.creator_profiles?.avatar_url && (
                            <img src={s.creator_profiles.avatar_url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-[#202020]">@{s.creator_profiles?.username || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.campaigns?.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
