import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Play, Check, X, MessageSquare, AlertCircle } from 'lucide-react'

export default async function VideoReviewsPage() {
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
    .eq('status', 'submitted')

  const pending = submissions || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Video Review Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review drafts submitted by creators. Request revisions or approve for payout.</p>
        </div>
        <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">
          {pending.length} pending review
        </span>
      </div>

      {pending.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Check className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-sm font-bold text-[#202020]">All caught up!</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            You don't have any pending video drafts awaiting your review right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pending.map((sub: any) => {
            const creator = sub.creator_profiles || {}
            const campaign = sub.applications?.campaigns || {}
            return (
              <div
                key={sub.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video bg-gray-900 flex items-center justify-center group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                    0:30
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username || 'C'}&background=E0F5FF&color=202020`}
                        alt={creator.username}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-[#202020]">@{creator.username || 'creator'}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">v{sub.version || 1}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-[#202020] mb-1">{campaign.title || 'UGC Campaign'}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2">{sub.caption || 'Product review video draft'}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#202020] text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Revise
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
