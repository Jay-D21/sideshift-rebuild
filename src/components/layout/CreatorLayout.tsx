'use client'

import Sidebar, { type SidebarItem } from './Sidebar'
import {
  LayoutDashboard,
  Search,
  FileText,
  MessageSquare,
  Wallet,
  Star,
  Settings,
  User,
} from 'lucide-react'

const creatorSidebarItems: SidebarItem[] = [
  { label: 'Explore', href: '/creator/explore', icon: Search },
  { label: 'My Campaigns', href: '/creator/campaigns', icon: FileText },
  { label: 'Messages', href: '/creator/messages', icon: MessageSquare },
  { label: 'Wallet', href: '/creator/wallet', icon: Wallet },
  { label: 'Portfolio', href: '/creator/portfolio', icon: Star },
  { label: 'Profile', href: '/creator/profile', icon: User },
  { label: 'Settings', href: '/creator/settings', icon: Settings },
]

interface CreatorLayoutProps {
  children: React.ReactNode
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        items={creatorSidebarItems}
        header={
          <span className="text-lg font-bold text-[#202020] tracking-tight">
            CreatorFlow
          </span>
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
