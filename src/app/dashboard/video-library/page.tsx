import { Video, Play, Lock, Clock, CheckCircle2 } from 'lucide-react'

export default function VideoLibraryPage() {
  const courses = [
    {
      title: 'Welcome to CreatorFlow',
      duration: '0:47',
      category: 'Overview',
      unlocked: true,
      description: 'A 60-second walkthrough of the platform and how to post your first UGC campaign.',
    },
    {
      title: 'Complete UGC Playbook',
      duration: '46:39',
      category: 'Strategy',
      unlocked: false,
      description: 'Master framework for structuring creator briefs, testing angles, and scaling winners.',
    },
    {
      title: 'UGC Pay Structures & Rates',
      duration: '3:26',
      category: 'Finance',
      unlocked: false,
      description: 'How to price deliverables, set usage rights, and offer performance bonuses.',
    },
    {
      title: 'Job Posting & Sourcing Secrets',
      duration: '12:15',
      category: 'Hiring',
      unlocked: false,
      description: 'How to write irresistible briefs that attract top 1% creator talent in under 24 hours.',
    },
    {
      title: 'Interviewing & Creator Screening',
      duration: '18:40',
      category: 'Hiring',
      unlocked: false,
      description: 'Red flags to avoid and how to evaluate creator portfolios and hook retention rates.',
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Video Library & Masterclasses</h1>
        <p className="text-sm text-gray-500 mt-0.5">Learn proven frameworks to scale high-converting UGC campaigns with top creators.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {['All Videos (11)', 'Job Posting (2)', 'Messaging (1)', 'Brief Writing (3)', 'Paid Scaling (5)'].map((tab, idx) => (
          <button
            key={tab}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              idx === 0 ? 'bg-[#202020] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course.title}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-gradient-to-tr from-[#E0F5FF] via-blue-50 to-[#D0EDFF] flex items-center justify-center">
                {course.unlocked ? (
                  <div className="w-12 h-12 rounded-full bg-[#202020] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-400/30 backdrop-blur text-gray-600 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/70 text-white px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 text-[#202020] px-2 py-0.5 rounded shadow-sm">
                  {course.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm text-[#202020] leading-snug">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{course.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                  course.unlocked
                    ? 'bg-[#202020] hover:bg-black/90 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!course.unlocked}
              >
                {course.unlocked ? 'Watch Now' : 'Locked (Starter Plan Required)'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
