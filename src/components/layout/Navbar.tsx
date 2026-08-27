'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { open: openRoleModal } = useRoleModal()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      style={scrolled ? { background: 'linear-gradient(180deg,#E0F5FF 0%,#F0FAFF 44.95%,#FFFFFF 100%)' } : {}}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8" ref={dropdownRef}>
        <Link href="/" className="text-[#202020] text-xl font-bold tracking-tight flex-shrink-0">
          CreatorFlow
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {['Platform','Solutions','Pricing','Resources','For Creators'].map((label) => {
            const hasDropdown = label in dropdownContent
            const isActive = activeDropdown === label
            return (
              <div key={label} className="relative">
                {hasDropdown ? (
                  <button
                    onClick={() => setActiveDropdown(isActive ? null : label)}
                    className="flex items-center gap-0.5 text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors duration-150 cursor-pointer"
                  >
                    {label}
                    <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={label === 'Pricing' ? '/pricing' : '/creators'}
                    className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors duration-150"
                  >
                    {label}
                  </Link>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {hasDropdown && isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}
                      className="absolute top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-2 z-50"
                    >
                      {dropdownContent[label].map((item) => (
                        <button
                          key={item.title}
                          onClick={() => setActiveDropdown(null)}
                          className="flex flex-col w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-[#202020]">{item.title}</span>
                          <span className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors duration-150 cursor-pointer">
                Log in
              </button>
            </SignInButton>
            <Link href="/demo" className="rounded-full border border-[rgba(32,32,32,0.18)] px-4 py-2 text-[14px] font-bold text-[#202020] hover:bg-black/5 transition-colors duration-150">
              Book a demo
            </Link>
            <button
              onClick={openRoleModal}
              className="rounded-full bg-[#202020] text-white px-5 py-2.5 text-[14px] font-bold leading-[140%] transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
            >
              Get started
            </button>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors duration-150">
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
              {['Platform','Solutions','Pricing','Resources','For Creators'].map((label) => (
                <Link
                  key={label}
                  href={label === 'Pricing' ? '/pricing' : label === 'For Creators' ? '/creators' : '#'}
                  className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors py-2 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
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