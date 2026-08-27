import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { CreditCard, Receipt } from 'lucide-react'

export default async function BillingPage() {
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

  let transactions: any[] = []
  if (profile?.brand_profiles?.[0]?.id) {
    const brandId = profile.brand_profiles[0].id
    const { data } = await (supabase as any)
      .from('transactions')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
    if (data) transactions = data
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your plan and payment history.</p>
      </div>

      {/* Plan card */}
      <div className="bg-gradient-to-br from-[#202020] to-[#3C83F9] rounded-2xl p-6 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/70 font-medium">Current Plan</p>
            <h2 className="text-2xl font-bold mt-1">Growth Plan</h2>
            <p className="text-white/70 text-sm mt-1">Billed monthly</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold">$399</span>
            <span className="text-white/70 text-sm">/mo</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20 flex gap-6 text-sm">
          <span>✓ Unlimited campaigns</span>
          <span>✓ 500 creator contacts/mo</span>
          <span>✓ AI brief generator</span>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-gray-400" />
          <h2 className="font-bold text-[#202020]">Payment History</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-semibold text-[#202020]">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Your payment history will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t: any) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-[#202020]">{t.description || 'Creator payment'}</td>
                    <td className="px-6 py-4 font-semibold text-[#202020]">${t.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
                        t.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>{t.status}</span>
                    </td>
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
