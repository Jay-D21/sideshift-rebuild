'use client'

import Sidebar, { type SidebarItem } from './Sidebar'
import {
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
  BarChart3,
} from 'lucide-react'

const brandSidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
  { label: 'Creators', href: '/dashboard/creators', icon: Users },
  { label: 'Submissions', href: '/dashboard/submissions', icon: FileText },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        items={brandSidebarItems}
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
