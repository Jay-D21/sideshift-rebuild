import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, ShieldCheck } from 'lucide-react'

export default async function PayoutsPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: transactions } = await (supabase as any)
    .from('transactions')
    .select('*, creator_profiles(username, avatar_url), applications(campaigns(title))')
    .order('created_at', { ascending: false })

  const list = transactions || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Finance & Payouts</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage escrow funds, creator payouts, and billing history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-[#202020] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black/90 transition-colors">
            Pay All Pending
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>In Escrow</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-[#202020] mt-2">$1,100.00</p>
          <p className="text-[11px] text-gray-400 mt-1">Held securely for active campaigns</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Pending Release</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[#202020] mt-2">$500.00</p>
          <p className="text-[11px] text-gray-400 mt-1">Awaiting your video approval</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Paid Out</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">$2,400.00</p>
          <p className="text-[11px] text-gray-400 mt-1">Lifetime payments to creators</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#202020]">Transaction Ledger</h2>
          <span className="text-xs text-gray-400 font-medium">{list.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Recipient</th>
                <th className="py-3.5 px-4">Campaign</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {list.map((tx: any) => {
                const creator = tx.creator_profiles || {}
                const campaign = tx.applications?.campaigns || {}
                return (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={creator.avatar_url || `https://ui-avatars.com/api/?name=${creator.username || 'C'}&background=E0F5FF&color=202020`}
                          alt={creator.username}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-[#202020]">@{creator.username || 'creator'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {campaign.title || 'Creator Collaboration'}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-gray-500">
                      {tx.type}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#202020]">
                      ${tx.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        tx.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">
                      {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : 'Recent'}
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
