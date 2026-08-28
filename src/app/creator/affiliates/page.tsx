import { Users, Copy, Gift, DollarSign, ArrowRight } from 'lucide-react'

export default function CreatorAffiliatesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Creator Referral Program</h1>
        <p className="text-sm text-gray-500 mt-0.5">Invite your creator friends and earn $10 cash for every friend who completes their first brief.</p>
      </div>

      {/* Referral Card */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-white border border-orange-200/80 rounded-2xl p-6 shadow-sm">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5" /> Refer & Earn
          </div>
          <h2 className="text-xl font-bold text-[#202020]">Earn $10 for every creator you invite</h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Share your unique invite link. When they join and get hired for their first campaign, $10 is instantly deposited into your CreatorFlow wallet.
          </p>

          <div className="mt-4 flex items-center gap-2 max-w-md">
            <input
              type="text"
              readOnly
              value="https://creatorflow.app/c/join?ref=creator_vip"
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 outline-none"
            />
            <button className="bg-[#202020] hover:bg-black/90 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Creators Referred</span>
          <p className="text-2xl font-bold text-[#202020] mt-1">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Total Earned</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">$0.00</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Pending Release</span>
          <p className="text-2xl font-bold text-[#202020] mt-1">$0.00</p>
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2 text-gray-400">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-bold text-[#202020]">No referrals yet</h3>
        <p className="text-[11px] text-gray-500 mt-0.5">Your invited friends and their bonus status will show up here.</p>
      </div>
    </div>
  )
}
