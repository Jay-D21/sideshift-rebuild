import { GraduationCap, Play, Lock, CheckCircle2, Clock, Sparkles } from 'lucide-react'

export default function CreatorTrainingPage() {
  const sections = [
    {
      title: 'CreatorFlow Onboarding',
      desc: 'Get your account verified and learn how to win your first $500 brief.',
      unlocked: true,
      modules: [
        { title: 'Welcome to CreatorFlow', duration: '0:47', completed: true },
        { title: 'Platform Tour & Gigs Overview', duration: '2:15', completed: false },
        { title: 'Setting Up Escrow & Payouts', duration: '1:30', completed: false },
      ],
    },
    {
      title: 'UGC Foundations & Hook Psychology',
      desc: 'Master the 3-second hook framework that keeps viewers watching.',
      unlocked: false,
      modules: [
        { title: 'What is High-Converting UGC?', duration: '5:30', completed: false },
        { title: 'The 7 Proven Hook Formulas', duration: '8:12', completed: false },
        { title: 'Call-to-Action & Conversion Triggers', duration: '6:45', completed: false },
      ],
    },
    {
      title: 'Production & Lighting Masterclass',
      desc: 'Film studio-grade content using just your smartphone and natural light.',
      unlocked: false,
      modules: [
        { title: 'Smartphone Camera Settings for TikTok', duration: '4:45', completed: false },
        { title: 'Lighting 101: Ring lights vs Softboxes', duration: '3:20', completed: false },
        { title: 'Audio & Mic Placement Secrets', duration: '5:10', completed: false },
      ],
    },
    {
      title: 'Winning Gigs & Pitching Brands',
      desc: 'How to write custom pitches that get accepted 3x faster.',
      unlocked: false,
      modules: [
        { title: 'Writing Winning Application Pitches', duration: '6:00', completed: false },
        { title: 'Negotiating Rates & Retainers', duration: '7:30', completed: false },
      ],
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-2">
          <GraduationCap className="w-3.5 h-3.5" /> Creator Academy
        </div>
        <h1 className="text-2xl font-bold text-[#202020]">Creator Training & Certification</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete lessons to earn verified creator badges and boost your application rank.</p>
      </div>

      <div className="space-y-6">
        {sections.map((sec, sIdx) => (
          <div
            key={sec.title}
            className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 ${
              sec.unlocked ? 'border-gray-200' : 'border-gray-200/60 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">STAGE {sIdx + 1}</span>
                  <h2 className="text-base font-bold text-[#202020]">{sec.title}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">{sec.desc}</p>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                sec.unlocked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
              }`}>
                {sec.unlocked ? 'Unlocked' : 'Pro Member'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {sec.modules.map((mod) => (
                <div
                  key={mod.title}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    sec.unlocked
                      ? 'bg-gray-50/70 border-gray-200 hover:border-gray-300 cursor-pointer'
                      : 'bg-gray-50/30 border-gray-100 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      mod.completed
                        ? 'bg-emerald-600 text-white'
                        : sec.unlocked
                        ? 'bg-[#202020] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {mod.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : sec.unlocked ? (
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-white" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#202020] truncate">{mod.title}</p>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {mod.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
