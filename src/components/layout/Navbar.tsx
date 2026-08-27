'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, ChevronDown } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignInButton, Show, UserButton } from '@clerk/nextjs'
import { useRoleModal } from '@/components/ui/RoleModal'

const dropdownContent: Record<string, { title: string; desc: string }[]> = {
  Platform: [
    { title: 'Creator Marketplace', desc: 'Browse and connect with 1M+ verified creators' },
    { title: 'Campaign Management', desc: 'Launch, track, and manage all campaigns in one place' },
    { title: 'Video Review', desc: 'Review, request revisions, and approve content' },
    { title: 'Payments & Payouts', desc: 'Automated secure payments to creators worldwide' },
    { title: 'Analytics & Reporting', desc: 'Real-time performance data across all campaigns' },
  ],
  Solutions: [
    { title: 'For E-commerce Brands', desc: 'Drive product sales with authentic creator content' },
    { title: 'For SaaS Companies', desc: 'Reach tech-savvy audiences through trusted voices' },
    { title: 'For Mobile Apps', desc: 'Boost installs with short-form video campaigns' },
    { title: 'For Agencies', desc: 'Manage multiple brand clients in one workspace' },
  ],
  Resources: [
    { title: 'Blog', desc: 'Creator marketing tips and industry insights' },
    { title: 'Case Studies', desc: 'Real results from real CreatorFlow campaigns' },
    { title: 'Creator Guide', desc: 'Everything creators need to succeed on the platform' },
    { title: 'Help Center', desc: 'Answers to common questions and troubleshooting' },
  ],
}

const navItems = [
  { label: 'Platform', hasDropdown: true },
  { label: 'Solutions', hasDropdown: true },
  { label: 'Pricing', hasDropdown: false, href: '/pricing' },
  { label: 'Resources', hasDropdown: true },
  { label: 'For Creators', hasDropdown: false, href: '/creators' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { open: openRoleModal } = useRoleModal()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-16 ${
        scrolled ? 'backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      style={scrolled ? { background: 'linear-gradient(180deg,#E0F5FF 0%,#F0FAFF 44.95%,#FFFFFF 100%)' } : {}}
    >
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-[#202020] text-[20px] font-bold tracking-tight flex-shrink-0">
          CreatorFlow
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 h-full">
          {navItems.map((item) => (
            <div key={item.label} className="relative group h-full flex items-center">
              {item.hasDropdown ? (
                <button className="flex items-center gap-0.5 text-[15px] font-medium text-[rgba(32,32,32,0.7)] hover:text-[#202020] transition-colors duration-150 cursor-pointer">
                  {item.label}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className="text-[15px] font-medium text-[rgba(32,32,32,0.7)] hover:text-[#202020] transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )}

              {/* Hover Dropdown */}
              {item.hasDropdown && (
                <div className="absolute top-14 left-0 pt-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 z-50">
                  <div className="absolute -top-3 left-0 right-0 h-4" />
                  <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 p-2 min-w-[240px]">
                    {dropdownContent[item.label].map((entry) => (
                      <button
                        key={entry.title}
                        className="flex flex-col w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      >
                        <span className="text-sm font-semibold text-[#202020]">{entry.title}</span>
                        <span className="text-xs text-gray-500 mt-0.5 leading-snug">{entry.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-[15px] font-medium text-[rgba(32,32,32,0.7)] hover:text-[#202020] transition-colors duration-150 cursor-pointer mr-2">
                Log in
              </button>
            </SignInButton>
            <Link href="/demo" className="rounded-full border border-[rgba(32,32,32,0.2)] px-4 py-2 text-[14px] font-semibold text-[#202020] hover:bg-black/5 transition-colors duration-150">
              Book a demo
            </Link>
            <button
              onClick={openRoleModal}
              className="rounded-full bg-[#202020] text-white px-5 py-2.5 text-[14px] font-bold transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
            >
              Get started
            </button>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-[15px] font-medium text-[rgba(32,32,32,0.7)] hover:text-[#202020] transition-colors duration-150 mr-4">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>

        {/* Mobile */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger className="md:hidden p-2 text-[#202020] cursor-pointer" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 pt-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href ?? '#'}
                  className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors py-2 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-base font-medium text-[#202020] py-2 text-left cursor-pointer">Log in</button>
                </SignInButton>
                <button
                  onClick={() => { setMobileOpen(false); openRoleModal() }}
                  className="rounded-full bg-[#202020] text-white text-center px-4 py-2.5 text-[14px] font-bold w-full cursor-pointer transition-all hover:opacity-90"
                >
                  Get started
                </button>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-base font-medium text-[#202020] py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <div className="flex items-center gap-2">
                  <UserButton />
                  <span className="text-sm text-gray-500">My account</span>
                </div>
              </Show>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  )
}