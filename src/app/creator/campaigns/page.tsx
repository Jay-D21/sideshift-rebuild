import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { FileText, ArrowRight } from 'lucide-react'

export default async function MyCampaignsPage() {
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

  const { data: { user } } = await supabase.auth.getUser()
  
  let applications = [] as any[]
  
  if (user) {
    const { data: creator } = await (supabase as any)
      .from('creator_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (creator) {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          campaigns(
            title, 
            brand_id,
            brand_profiles(company_name, logo_url)
          )
        `)
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false })
      
      if (data) applications = data
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      case 'withdrawn': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">My Campaigns & Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Track the status of your pitches and active work.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">My Rate</th>
                <th className="px-6 py-3">Applied On</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    You haven't applied to any campaigns yet.
                    <div className="mt-4">
                      <Link href="/creator/explore" className="text-[#3C83F9] font-medium hover:underline">
                        Explore Campaigns
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map(app => {
                  const campaign = app.campaigns as any
                  const brand = campaign?.brand_profiles as any
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0 overflow-hidden text-xs">
                            {brand?.logo_url ? (
                              <img src={brand.logo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              brand?.company_name?.charAt(0) || 'B'
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#202020]">{campaign?.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{brand?.company_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)} capitalize`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#202020]">${app.proposed_rate}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/creator/explore/${app.campaign_id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#3C83F9] hover:text-blue-700"
                        >
                          View <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
