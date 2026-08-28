import { AlertTriangle, ShieldCheck } from 'lucide-react'

export default function DisputesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Dispute Center</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage flagged deliverables, refund requests, and mediation.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3 text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#202020]">No active disputes</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          All your creator collaborations are in good standing. If an issue arises with deliverables or timelines, you can open a dispute here.
        </p>
      </div>
    </div>
  )
}
