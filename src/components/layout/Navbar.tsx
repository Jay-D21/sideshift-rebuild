'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, ChevronDown } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs'

const navLinks = [
  { label: 'Platform', href: '#', hasDropdown: true },
  { label: 'Solutions', href: '#', hasDropdown: true },
  { label: 'Pricing', href: '/pricing', hasDropdown: false },
  { label: 'Resources', href: '#', hasDropdown: true },
  { label: 'For Creators', href: '/creators', hasDropdown: false },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      style={scrolled ? {
        background: 'linear-gradient(180deg, #E0F5FF 0%, #F0FAFF 44.95%, #FFFFFF 100%)'
      } : {}}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-[#202020] text-xl font-bold tracking-tight">
          CreatorFlow
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-0.5 text-base leading-[140%] font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          ))}
        </div>

        {/* Desktop CTA group */}
        <div className="hidden md:flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-base leading-[140%] font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors cursor-pointer">
                Log in
              </button>
            </SignInButton>
            <Link
              href="/demo"
              className="rounded-full border border-[rgba(32,32,32,0.18)] px-4 py-2 text-[14px] font-bold text-[#202020] hover:bg-black/5 transition-colors"
            >
              Book a demo
            </Link>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-[#202020] border border-[#202020] text-white px-4 py-2.5 md:px-6 md:py-3 text-[14px] md:text-base font-bold leading-[140%] whitespace-nowrap transition-all active:scale-95 hover:opacity-90 cursor-pointer">
                Get started
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-base leading-[140%] font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="md:hidden p-2 text-[#202020] cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-[rgba(32,32,32,0.75)] hover:text-[#202020] transition-colors py-2 border-b border-gray-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-base font-medium text-[#202020] py-2 text-left cursor-pointer">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-[#202020] text-white text-center px-4 py-2.5 text-[14px] font-bold w-full cursor-pointer">
                    Get started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="text-base font-medium text-[#202020] py-2" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
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