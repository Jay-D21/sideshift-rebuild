import { GitPullRequest, Search } from 'lucide-react'

export default function RequestsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Creator Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage custom brand invitations and inbound collaboration inquiries.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {['All (0)', 'Pending (0)', 'Approved (0)', 'Rejected (0)'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              idx === 0 ? 'bg-[#202020] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <GitPullRequest className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#202020]">No pending requests</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
          When creators request to join exclusive campaigns or pitch custom packages, they will show up here.
        </p>
      </div>
    </div>
  )
}
