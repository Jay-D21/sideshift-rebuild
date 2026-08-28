import { HelpCircle, BookOpen, MessageSquare, ExternalLink, Lightbulb } from 'lucide-react'

export default function HelpPage() {
  const glossary = [
    {
      term: 'Campaign',
      definition: 'A focused project with defined objectives, guidelines, deliverables, and budget for hiring creators.',
    },
    {
      term: 'Marketplace Job',
      definition: 'An open casting call posted to the creator directory where any qualified creator can apply with pitch videos.',
    },
    {
      term: 'Creator Escrow',
      definition: 'Payment protection where funds are held safely until you review and approve the submitted video deliverables.',
    },
    {
      term: 'Usage Rights',
      definition: 'The commercial licensing terms that grant your brand permission to run creator content as paid ads across Meta, TikTok, and Google.',
    },
    {
      term: 'Brief Generator (AI)',
      definition: 'Our AI model analyzes your product URL and generates custom hooks, angles, scripts, and production constraints.',
    },
    {
      term: 'Revision Request',
      definition: 'Feedback sent back to a creator asking for specific edits, hook variations, or caption adjustments before payout.',
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Help Center & Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-0.5">Everything you need to know about navigating CreatorFlow and managing UGC campaigns.</p>
      </div>

      {/* Support Box */}
      <div className="bg-[#E0F5FF]/60 border border-blue-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#202020]">Need 1-on-1 assistance?</h2>
            <p className="text-xs text-gray-600 mt-0.5">Our dedicated campaign strategists are available 24/7 via live chat.</p>
          </div>
        </div>
        <button className="bg-[#202020] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black/90 transition-colors whitespace-nowrap">
          Open Live Chat
        </button>
      </div>

      {/* Glossary Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <h2 className="text-lg font-bold text-[#202020]">Platform Glossary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {glossary.map((item) => (
            <div
              key={item.term}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-1.5"
            >
              <h3 className="font-bold text-sm text-[#202020] flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                {item.term}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
