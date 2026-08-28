import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Briefcase, Plus, Search, Calendar, DollarSign, Users, ChevronRight } from 'lucide-react'

export default async function JobsPage() {
  const { userId } = await auth()
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: campaigns } = await (supabase as any)
    .from('campaigns')
    .select('*, applications(count)')
    .order('created_at', { ascending: false })

  const jobs = campaigns || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Quota Banner */}
      <div className="bg-[#E0F5FF]/60 border border-blue-200/60 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
            0/1
          </div>
          <div>
            <p className="text-sm font-semibold text-[#202020]">
              You've used 0 of 1 job posts this month
            </p>
            <p className="text-xs text-gray-500">
              Upgrade your plan to post unlimited open marketplace jobs.
            </p>
          </div>
        </div>
        <button className="bg-[#202020] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-black/90 transition-colors">
          Buy Job Posts
        </button>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Job Postings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your active public listings and incoming creator bids.</p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Job
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          {['All (5)', 'Active (3)', 'Draft (1)', 'Archived (1)'].map((tab, idx) => (
            <button
              key={tab}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                idx === 0 ? 'bg-gray-100 text-[#202020]' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter jobs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#202020]">No jobs posted yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Create your first job posting to start receiving qualified creator applications.
          </p>
          <Link
            href="/dashboard/campaigns/new"
            className="mt-4 inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-xs font-bold"
          >
            <Plus className="w-4 h-4" /> Post a Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job: any) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    job.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : job.status === 'completed'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {job.status}
                  </span>
                  <h3 className="font-bold text-base text-[#202020]">{job.title}</h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{job.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1 font-medium text-[#202020]">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                    ${job.budget_per_creator || 400}/creator
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Rolling'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    {job.applications?.[0]?.count || 4} applicants
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href={`/dashboard/applicants`}
                  className="text-xs font-bold text-[#202020] bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                  View Applicants
                </Link>
                <Link
                  href={`/dashboard/campaigns/${job.id}`}
                  className="text-xs font-bold text-white bg-[#202020] hover:bg-black/90 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                >
                  Details <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
