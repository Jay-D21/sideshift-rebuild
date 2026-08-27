import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { ExternalLink, Check, X } from 'lucide-react'

export default async function SubmissionsPage() {
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
    .from('brand_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  let submissions: any[] = []

  if (brand) {
    const { data } = await supabase
      .from('submissions')
      .select(`
        *,
        campaign:campaigns!inner(title, brand_id),
        creator:creator_profiles(username, avatar_url)
      `)
      .eq('campaigns.brand_id', brand.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      submissions = data
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'revision_requested': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Submissions</h1>
        <p className="text-sm text-gray-500 mt-1">Review and manage content submitted by creators.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Creator</th>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No submissions yet. When creators submit content for your campaigns, it will appear here.
                  </td>
                </tr>
              ) : (
                submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                          {sub.creator?.avatar_url && (
                            <img src={sub.creator.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="font-semibold text-[#202020]">
                          {sub.creator?.username || 'Unknown Creator'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#202020]">
                      {sub.campaign?.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(sub.status)} capitalize`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.content_url && (
                          <a href={sub.content_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Content">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Approve">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors" title="Request Revision">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

