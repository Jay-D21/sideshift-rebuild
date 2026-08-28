import { Users2, Copy, Gift, ArrowRight } from 'lucide-react'

export default function BrandAffiliatesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Brand Referral Program</h1>
        <p className="text-sm text-gray-500 mt-0.5">Invite other brands to CreatorFlow and earn 10% credit on their first 3 campaigns.</p>
      </div>

      {/* Referral Card */}
      <div className="bg-gradient-to-r from-[#E0F5FF] via-white to-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-3">
            <Gift className="w-3.5 h-3.5" /> Brand Ambassador
          </div>
          <h2 className="text-xl font-bold text-[#202020]">Give $100, Get $100</h2>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            When another brand signs up with your link, they receive a $100 campaign credit, and you earn $100 towards your next video brief.
          </p>

          <div className="mt-4 flex items-center gap-2 max-w-md">
            <input
              type="text"
              readOnly
              value="https://creatorflow.app/invite/brand-vip-2026"
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
          <span className="text-xs text-gray-500 font-medium">Brands Referred</span>
          <p className="text-2xl font-bold text-[#202020] mt-1">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Credits Earned</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">$0.00</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs text-gray-500 font-medium">Conversion Rate</span>
          <p className="text-2xl font-bold text-[#202020] mt-1">0.0%</p>
        </div>
      </div>
    </div>
  )
}
