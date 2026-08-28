import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Search, Sparkles, CheckCircle2, Filter, Star, Eye, DollarSign } from 'lucide-react'

export default async function DiscoverPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: creators } = await (supabase as any)
    .from('creator_profiles')
    .select('*')
    .order('follower_count', { ascending: false })

  const creatorList = creators || []
  const featured = creatorList.slice(0, 3)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-[#E0F5FF] via-[#EEF8FF] to-[#FFFFFF] border border-blue-100 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Discover Creators & Talent
          </div>
          <h1 className="text-3xl font-bold text-[#202020] tracking-tight">
            Find your next collaborator
          </h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            Browse verified UGC creators, agencies, and performance video specialists. Filter by category, followers, and engagement.
          </p>
        </div>
        <div className="absolute right-6 top-6 flex items-center gap-2">
          <span className="text-xs font-medium bg-white/80 backdrop-blur px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 shadow-sm">
            🎯 <strong>0</strong> invites left · <button className="text-blue-600 hover:underline font-semibold">Buy More</button>
          </span>
        </div>
      </div>

      {/* Featured Creators Carousel / Top 3 */}
      {featured.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#202020] flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              Featured Creators
            </h2>
            <span className="text-xs text-gray-400 font-medium">Top performing talent</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map((creator: any) => (
              <div
                key={creator.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <img
                      src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username}&background=E0F5FF&color=202020`}
                      alt={creator.username}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-[#202020] truncate text-base">@{creator.username}</h3>
                        {creator.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{creator.bio || 'Content creator & UGC specialist'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(creator.categories || ['UGC', 'Lifestyle']).map((cat: string) => (
                      <span key={cat} className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100 font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block">Followers</span>
                    <span className="font-bold text-[#202020] text-sm">
                      {creator.follower_count ? `${(creator.follower_count / 1000).toFixed(0)}K` : '50K+'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Engagement</span>
                    <span className="font-bold text-emerald-600 text-sm">
                      {creator.engagement_rate ? `${creator.engagement_rate}%` : '4.8%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Earnings</span>
                    <span className="font-bold text-[#202020] text-sm">
                      ${creator.total_earnings || '0'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['Creators', 'Campaign Managers', 'UGC Agencies', 'Clipping', 'Wildcards'].map((tab, idx) => (
              <button
                key={tab}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  idx === 0
                    ? 'bg-[#202020] text-white'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by handle, niche..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
            />
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {creatorList.map((creator: any) => (
            <div
              key={creator.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username}&background=E0F5FF&color=202020`}
                    alt={creator.username}
                    className="w-11 h-11 rounded-full object-cover border border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-sm text-[#202020] truncate">@{creator.username}</p>
                      {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />}
                    </div>
                    <p className="text-[12px] text-gray-400 truncate">
                      {creator.categories?.[0] || 'Content Creator'}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[32px]">
                  {creator.bio || 'Available for UGC & video campaigns.'}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {(creator.categories || ['UGC']).slice(0, 3).map((cat: string) => (
                    <span key={cat} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100 font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-[11px] text-gray-500">
                  <span className="font-bold text-[#202020] text-xs">
                    {creator.follower_count ? `${(creator.follower_count / 1000).toFixed(0)}K` : '50K'}
                  </span> followers
                </div>
                <button className="text-xs font-bold text-[#202020] bg-gray-100 hover:bg-[#202020] hover:text-white px-3 py-1 rounded-lg transition-colors">
                  Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
