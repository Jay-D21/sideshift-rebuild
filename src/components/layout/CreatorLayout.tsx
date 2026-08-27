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
  { label: 'Dashboard', href: '/creator', icon: LayoutDashboard },
  { label: 'Browse Campaigns', href: '/creator/campaigns', icon: Search },
  { label: 'My Applications', href: '/creator/applications', icon: FileText },
  { label: 'Messages', href: '/creator/messages', icon: MessageSquare },
  { label: 'Earnings', href: '/creator/earnings', icon: Wallet },
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
