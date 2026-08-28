'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string // e.g. "NEW"
}

export interface SidebarSection {
  title?: string // undefined = no header (top section)
  items: SidebarItem[]
}

interface SidebarProps {
  sections: SidebarSection[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

export default function Sidebar({ sections, header, footer }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-60 flex-col bg-[#FAFAFA] border-r border-gray-200">
      {header && (
        <div className="flex items-center px-4 py-4 border-b border-gray-200">
          {header}
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && (
              <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold px-3 pt-5 pb-1">
                {section.title}
              </div>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/creator/home' && pathname.startsWith(item.href + '/'))
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] leading-[145%] font-medium transition-colors',
                        isActive
                          ? 'bg-[#E0F5FF] text-[#202020]'
                          : 'text-[rgba(32,32,32,0.55)] hover:bg-gray-100 hover:text-[#202020]'
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 rounded-full font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
      {footer && (
        <div className="border-t border-gray-200 px-4 py-3">
          {footer}
        </div>
      )}
    </aside>
  )
}

