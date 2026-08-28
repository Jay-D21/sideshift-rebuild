'use client'

import Sidebar, { type SidebarSection } from './Sidebar'
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  UserCheck,
  MessageSquare,
  Megaphone,
  Users,
  GitPullRequest,
  BarChart3,
  FileText,
  Play,
  DollarSign,
  AlertTriangle,
  Users2,
  Video,
  HelpCircle,
  Settings,
} from 'lucide-react'

const brandSections: SidebarSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Discover', href: '/dashboard/discover', icon: Compass, badge: 'NEW' },
    ],
  },
  {
    title: 'HIRE CREATORS',
    items: [
      { label: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
      { label: 'Applicants', href: '/dashboard/applicants', icon: UserCheck },
      { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    ],
  },
  {
    title: 'MANAGE CREATORS',
    items: [
      { label: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
      { label: 'Creators', href: '/dashboard/creators', icon: Users },
      { label: 'Requests', href: '/dashboard/requests', icon: GitPullRequest },
    ],
  },
  {
    title: 'TRACK PERFORMANCE',
    items: [
      { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { label: 'Posts', href: '/dashboard/posts', icon: FileText },
      { label: 'Video Reviews', href: '/dashboard/video-reviews', icon: Play },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { label: 'Payouts', href: '/dashboard/payouts', icon: DollarSign },
      { label: 'Disputes', href: '/dashboard/disputes', icon: AlertTriangle },
      { label: 'Affiliates', href: '/dashboard/affiliates', icon: Users2 },
    ],
  },
  {
    title: 'LEARN',
    items: [
      { label: 'Video Library', href: '/dashboard/video-library', icon: Video },
      { label: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sections={brandSections}
        header={
          <span className="text-lg font-bold text-[#202020] tracking-tight">
            CreatorFlow
          </span>
        }
        footer={
          <div className="space-y-3">
            <button className="w-full bg-[#202020] text-white text-sm font-bold py-2 px-4 rounded-full hover:bg-black/90 transition-colors">
              Start your free trial
            </button>
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

