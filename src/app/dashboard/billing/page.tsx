import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { CreditCard, Download, Plus } from 'lucide-react'

export default async function BillingPage() {
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

  let transactions: any[] = []

  if (brand) {
    const { data } = await supabase
      .from('transactions')
      .select('*, campaign:campaigns(title)')
      .eq('brand_id', brand.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      transactions = data
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Billing & Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription, payment methods, and billing history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#202020] mb-2">Current Plan</h2>
            <div className="text-3xl font-bold text-[#202020] mb-1">Growth Plan</div>
            <div className="text-gray-500 mb-6">$399/month, billed monthly</div>
          </div>
          <button className="bg-white border border-gray-200 text-[#202020] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors w-max">
            Manage Subscription
          </button>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#202020] mb-2">Payment Method</h2>
            <div className="flex items-center gap-3 mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <span>No default payment method saved.</span>
            </div>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors w-max">
            <Plus className="h-4 w-4" /> Add Payment Method
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#202020]">Billing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No billing history available. Your transactions will appear here.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#202020] capitalize">{tx.type}</div>
                      {tx.campaign?.title && (
                        <div className="text-xs text-gray-500 mt-0.5">{tx.campaign.title}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#202020]">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize
                        ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          tx.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-gray-50 text-gray-700 border-gray-200'}
                      `}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status === 'completed' && (
                        <button className="text-gray-400 hover:text-[#202020] transition-colors p-1.5 rounded hover:bg-gray-100" title="Download Invoice">
                          <Download className="h-4 w-4" />
                        </button>
                      )}
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

