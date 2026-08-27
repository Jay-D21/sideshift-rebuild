'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { DollarSign, Clock, Wallet } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

export default function WalletPage() {
  const { userId } = useAuth()
  const [earnings, setEarnings] = useState({ total: 0, pending: 0, available: 0 })
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function load() {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, creator_profiles(id)')
        .eq('user_id', userId)
        .single()
      if (profile?.creator_profiles?.[0]?.id) {
        const creatorId = profile.creator_profiles[0].id
        const { data: txns } = await (supabase as any)
          .from('transactions')
          .select('*')
          .eq('creator_id', creatorId)
          .order('created_at', { ascending: false })
        if (txns) {
          setTransactions(txns)
          setEarnings({
            total: txns.reduce((s: number, t: any) => s + (t.amount || 0), 0),
            pending: txns.filter((t: any) => t.status === 'pending').reduce((s: number, t: any) => s + (t.amount || 0), 0),
            available: txns.filter((t: any) => t.status === 'completed').reduce((s: number, t: any) => s + (t.amount || 0), 0),
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [userId])

  const stats = [
    { label: 'Total Earned', value: `$${earnings.total}`, icon: DollarSign, color: 'text-[#3C83F9]', bg: 'bg-[#E0F5FF]' },
    { label: 'Pending', value: `$${earnings.pending}`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Available', value: `$${earnings.available}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">Your earnings and payout history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
              <div className="text-2xl font-bold text-[#202020] mt-0.5">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-[#202020]">Transaction History</h2>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-semibold text-[#202020]">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Complete campaigns to start earning.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((t: any) => (
              <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#202020]">{t.description || 'Campaign payment'}</p>
                  <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#202020]">${t.amount}</p>
                  <span className={`text-xs capitalize ${t.status === 'completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
