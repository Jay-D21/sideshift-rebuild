'use client'

import { useState } from 'react'
import { Star, CheckCircle2 } from 'lucide-react'

const DEFAULT_TASKS = [
  { id: 'gigs', title: 'Apply to a gig', xp: '+22 XP', done: false, desc: 'Browse open campaigns and submit your first application' },
  { id: 'socials', title: 'Complete your profile', xp: '+10 XP', done: false, desc: 'Add your TikTok, Instagram and bio to unlock premium gigs' },
  { id: 'training', title: 'Start your training', xp: '+15 XP', done: false, desc: 'Complete the 60s creator onboarding module' },
]

export default function CreatorHomeClient({ hasProfile }: { hasProfile: boolean }) {
  const [tasks, setTasks] = useState(DEFAULT_TASKS)

  const toggle = (id: string) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))
  const totalXp = tasks.reduce((sum, t) => sum + parseInt(t.xp), 0)

  if (!hasProfile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-400 text-center py-4">
          Complete onboarding to unlock your daily plan.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
          <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
          Here's your plan today!
        </h2>
        <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">
          {totalXp} XP Available
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggle(task.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
              task.done
                ? 'bg-emerald-50/40 border-emerald-200 opacity-75'
                : 'bg-gray-50/60 border-gray-200 hover:border-orange-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
              task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
            }`}>
              {task.done && <CheckCircle2 className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm font-bold ${task.done ? 'line-through text-gray-500' : 'text-[#202020]'}`}>
                  {task.title}
                </p>
                <span className="text-xs font-bold text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-full shrink-0">
                  {task.xp}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{task.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
