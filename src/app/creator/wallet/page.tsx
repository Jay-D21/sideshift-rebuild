import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, Building } from 'lucide-react'

export default function WalletPage() {
  const stats = [
    { label: 'Available Balance', value: '$850.00', desc: 'Ready to withdraw' },
    { label: 'Pending Earnings', value: '$400.00', desc: 'From active campaigns' },
    { label: 'Total Earned', value: '$12,450.00', desc: 'All-time earnings' },
  ]

  const transactions = [
    { id: 1, type: 'payout', amount: '$450.00', status: 'completed', date: '2026-08-20', brand: 'Acme Corp' },
    { id: 2, type: 'withdrawal', amount: '-$800.00', status: 'completed', date: '2026-08-15', brand: 'Bank Transfer' },
    { id: 3, type: 'payout', amount: '$200.00', status: 'pending', date: '2026-08-10', brand: 'TechGear' },
    { id: 4, type: 'payout', amount: '$600.00', status: 'completed', date: '2026-08-01', brand: 'BeautyCo' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Wallet & Earnings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your payments and withdrawal history.</p>
        </div>
        <button className="bg-[#202020] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors">
          Withdraw Funds
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-3xl font-bold text-[#202020] mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400 font-medium">{stat.desc}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-[#202020]">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Transaction</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'payout' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tx.type === 'payout' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-[#202020] capitalize">{tx.type}</div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          {tx.type === 'payout' ? <Building className="w-3 h-3" /> : null} {tx.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-bold ${tx.type === 'payout' ? 'text-emerald-600' : 'text-[#202020]'}`}>
                      {tx.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                      <span className="capitalize">{tx.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
