import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import Link from 'next/link'
import { Search, DollarSign, Clock, MapPin } from 'lucide-react'

export default async function ExploreCampaignsPage() {
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

  // Fetch all active campaigns
  const { data: campaignsData } = await supabase
    .from('campaigns')
    .select(`
      *,
      brand_profiles(company_name, logo_url, industry)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    
  const campaigns = campaignsData as any[]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Explore Campaigns</h1>
        <p className="text-sm text-gray-500 mt-1">Find and pitch to active brand campaigns.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by keyword or brand..."
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400"
          />
        </div>
        <select className="h-12 px-4 rounded-xl border border-gray-200 outline-none focus:border-gray-400 bg-white min-w-[160px]">
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="beauty">Beauty</option>
          <option value="fitness">Fitness</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {!campaigns || campaigns.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            No active campaigns found right now. Check back later!
          </div>
        ) : (
          campaigns.map(campaign => {
            const brand = campaign.brand_profiles as any
            return (
              <Link 
                href={`/creator/explore/${campaign.id}`}
                key={campaign.id} 
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 shrink-0 overflow-hidden">
                      {brand?.logo_url ? (
                        <img src={brand.logo_url} alt={brand?.company_name} className="w-full h-full object-cover" />
                      ) : (
                        brand?.company_name?.charAt(0) || 'B'
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{brand?.company_name}</div>
                      <div className="text-xs text-gray-500">{brand?.industry || campaign.category}</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-[#202020] mb-2 line-clamp-2 group-hover:text-[#3C83F9] transition-colors">
                  {campaign.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {campaign.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(campaign.requirements as any)?.niches?.map((niche: string) => (
                    <span key={niche} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {niche}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 font-semibold text-[#202020]">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Max ${campaign.budget_per_creator}
                  </div>
                  {campaign.deadline && (
                    <div className="flex items-center gap-1.5 text-gray-500 font-medium">
                      <Clock className="w-4 h-4" />
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
