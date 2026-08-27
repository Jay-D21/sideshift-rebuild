$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$pwd = "C:\Users\ADMIN\Desktop\sideshift app 8x"

$file1 = @'
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Building, User, ArrowRight } from 'lucide-react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

// ---- Context ----
interface RoleModalContextValue {
  open: () => void
  close: () => void
}

const RoleModalContext = createContext<RoleModalContextValue | null>(null)

export function useRoleModal() {
  const ctx = useContext(RoleModalContext)
  if (!ctx) throw new Error('useRoleModal must be used within RoleModalProvider')
  return ctx
}

// ---- Provider ----
export function RoleModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <RoleModalContext.Provider value={{ open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
      <RoleModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </RoleModalContext.Provider>
  )
}

// ---- Modal ----
function RoleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()

  const handleRole = (role: 'brand' | 'creator') => {
    onClose()
    // Redirect to /signup with role param — Clerk SignUp will pick up afterSignUpUrl from env
    // After signup, /onboarding/role will handle DB insert and redirect
    if (role === 'brand') {
      router.push('/signup?role=brand')
    } else {
      router.push('/signup?role=creator')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(32,32,32,0.6)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#202020]">Join CreatorFlow</h2>
              <p className="text-gray-500 mt-2 text-sm">Choose how you want to use the platform.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Brand card */}
              <button
                onClick={() => handleRole('brand')}
                className="group flex flex-col items-center text-center p-7 bg-white rounded-xl border border-gray-200 hover:border-[#202020] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-[#E0F5FF] transition-colors">
                  <Building className="h-6 w-6 text-[#202020]" />
                </div>
                <h3 className="text-lg font-bold text-[#202020] mb-2">I&apos;m a Brand</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Post a campaign, get 50+ creator applications in 24 hours
                </p>
                <span className="flex items-center gap-2 rounded-full bg-[#202020] text-white px-5 py-2.5 text-sm font-bold transition-all group-hover:opacity-90">
                  Continue as Brand <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>

              {/* Creator card */}
              <button
                onClick={() => handleRole('creator')}
                className="group flex flex-col items-center text-center p-7 bg-white rounded-xl border border-gray-200 hover:border-[#202020] hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="h-14 w-14 bg-gray-50 rounded-full flex items-center justify-center mb-5 group-hover:bg-[#E0F5FF] transition-colors">
                  <User className="h-6 w-6 text-[#202020]" />
                </div>
                <h3 className="text-lg font-bold text-[#202020] mb-2">I&apos;m a Creator</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Browse campaigns and earn $200&ndash;$2,000 per project
                </p>
                <span className="flex items-center gap-2 rounded-full bg-[#202020] text-white px-5 py-2.5 text-sm font-bold transition-all group-hover:opacity-90">
                  Continue as Creator <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Already have an account?{' '}
              <a href="/login" className="text-[#202020] font-semibold hover:underline">Log in</a>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
'@
$dir1 = Split-Path "$pwd\src\components\ui\RoleModal.tsx"
if (-not (Test-Path $dir1)) { New-Item -ItemType Directory -Force -Path $dir1 }
[System.IO.File]::WriteAllText("$pwd\src\components\ui\RoleModal.tsx", $file1, $utf8NoBom)


$file2 = @'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { RoleModalProvider } from '@/components/ui/RoleModal'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'CreatorFlow',
  description: 'Get 50+ qualified creator applications for your brand in 24 hours.',
  openGraph: {
    title: 'CreatorFlow — Content Creator & UGC Platform',
    description: 'Connect brands with top content creators and UGC talent.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#202020] font-sans">
        <ClerkProvider>
          <RoleModalProvider>
            {children}
          </RoleModalProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
'@
$dir2 = Split-Path "$pwd\src\app\layout.tsx"
if (-not (Test-Path $dir2)) { New-Item -ItemType Directory -Force -Path $dir2 }
[System.IO.File]::WriteAllText("$pwd\src\app\layout.tsx", $file2, $utf8NoBom)


$file3 = @'
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
'@
$dir3 = Split-Path "$pwd\src\components\layout\Navbar.tsx"
if (-not (Test-Path $dir3)) { New-Item -ItemType Directory -Force -Path $dir3 }
[System.IO.File]::WriteAllText("$pwd\src\components\layout\Navbar.tsx", $file3, $utf8NoBom)


$file4 = @'
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { useRoleModal } from '@/components/ui/RoleModal'

const testimonials = [
  {
    quote: 'We got 60+ creator applications in under 12 hours.',
    highlight: '60+ creator applications',
    author: 'Sarah K., Head of Marketing at Brex',
  },
  {
    quote: 'The quality of UGC creators on CreatorFlow is unmatched.',
    highlight: 'quality of UGC creators',
    author: 'James M., Cursor Growth Team',
  },
  {
    quote: 'Replaced our entire influencer agency in one week.',
    highlight: 'entire influencer agency',
    author: 'Priya L., Brand Director at Grammarly',
  },
]

function FloatingCard() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          M
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-[#202020] truncate">Maya R. applied to your campaign</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded">Beauty</span>
            <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded">UGC</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex">
          {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
        </div>
        <span className="text-[11px] text-gray-400">2 min ago</span>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
        <button className="flex-1 text-xs font-bold py-1.5 rounded-lg bg-[#202020] text-white transition-all hover:opacity-90 cursor-pointer">View Profile</button>
        <button className="flex-1 text-xs font-bold py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">Decline</button>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const { open: openRoleModal } = useRoleModal()

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(i => (i + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const current = testimonials[quoteIndex]

  return (
    <section
      className="relative flex min-h-[92vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)' }}
    >
      <FloatingCard />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#3C83F9]" />
        <span className="text-[13px] font-medium tracking-wide text-[#202020]">Live — 3,000+ brands hiring creators today</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="mx-auto max-w-4xl text-[10vw] leading-[95%] font-bold tracking-[-0.05em] text-[#202020] sm:text-[52px] md:text-[64px]"
      >
        Get 50+ qualified creator applications{' '}
        <span className="relative inline-block">
          <span className="relative z-10">for your brand</span>
          <span className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded" style={{ background: '#fdf1c7' }} />
        </span>
        {' '}in 24 hours
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-5 max-w-xl text-[15px] leading-[145%] sm:text-lg"
        style={{ color: 'rgba(32,32,32,0.75)' }}
      >
        Post a brief, set your budget, and let the top UGC creators come to you.
        No cold outreach. No agencies. Just results.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8"
      >
        <button
          onClick={openRoleModal}
          className="flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#202020] border border-[#202020] text-white px-8 text-base font-bold leading-[140%] whitespace-nowrap transition-all duration-200 active:scale-95 hover:opacity-90 cursor-pointer"
        >
          Launch my campaign
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="mt-3 text-[12px] leading-tight"
        style={{ color: 'rgba(32,32,32,0.35)' }}
      >
        7 days free &middot; $0 today &middot; Cancel anytime
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <div className="relative h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <p className="text-[13px] text-[rgba(32,32,32,0.7)] leading-relaxed">
                &ldquo;{current.quote.split(current.highlight).map((part, i) =>
                  i === 0
                    ? <span key={i}>{part}<mark className="bg-[#fdf1c7] text-[#202020] not-italic px-0.5 rounded-sm">{current.highlight}</mark></span>
                    : <span key={i}>{part}</span>
                )}&rdquo;
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">{current.author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-6 flex items-center justify-center gap-3"
      >
        <div className="flex -space-x-2">
          {['A','B','C','D','E'].map((letter, i) => (
            <div key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white"
              style={{ background: ['#3C83F9','#10b981','#f59e0b','#8b5cf6','#ef4444'][i] }}>
              {letter}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">{[1,2,3,4,5].map(s => <span key={s} className="text-[#f59e0b] text-sm">★</span>)}</div>
          <span className="text-[13px] font-medium text-[#202020]">Loved by 3,000+ brands</span>
        </div>
      </motion.div>
    </section>
  )
}
'@
$dir4 = Split-Path "$pwd\src\components\sections\Hero.tsx"
if (-not (Test-Path $dir4)) { New-Item -ItemType Directory -Force -Path $dir4 }
[System.IO.File]::WriteAllText("$pwd\src\components\sections\Hero.tsx", $file4, $utf8NoBom)
