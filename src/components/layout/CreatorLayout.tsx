'use client'

import Sidebar, { type SidebarSection } from './Sidebar'
import {
  Home,
  Search,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Users,
  User,
  Settings,
  Image,
} from 'lucide-react'

const creatorSections: SidebarSection[] = [
  {
    items: [
      { label: 'Home', href: '/creator/home', icon: Home },
      { label: 'Explore', href: '/creator/explore', icon: Search },
      { label: 'My Campaigns', href: '/creator/campaigns', icon: Briefcase },
      { label: 'Training', href: '/creator/training', icon: GraduationCap },
      { label: 'Messages', href: '/creator/messages', icon: MessageSquare },
      { label: 'Affiliates', href: '/creator/affiliates', icon: Users },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'Profile', href: '/creator/profile', icon: User },
      { label: 'Account', href: '/creator/account', icon: Settings },
      { label: 'Portfolio', href: '/creator/portfolio', icon: Image },
    ],
  },
]

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sections={creatorSections}
        header={
          <span className="text-lg font-bold text-[#202020] tracking-tight">
            CreatorFlow
          </span>
        }
        footer={
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
              ⚡ Upgrade to Pro
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

