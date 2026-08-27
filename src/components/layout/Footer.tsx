import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  Product: [
    { label: 'Platform', href: '#' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'For Creators', href: '/creators' },
    { label: 'For Brands', href: '/brands' },
  ],
  Resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Help Center', href: '/help' },
    { label: 'API Docs', href: '/docs' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-[#202020] tracking-tight">CreatorFlow</span>
            <p className="mt-3 text-[15px] leading-[145%] text-[rgba(32,32,32,0.55)] max-w-[200px]">
              The content creator &amp; UGC platform for modern brands.
            </p>
          </div>
          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[13px] font-medium tracking-wide text-[#202020] mb-3">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-[rgba(32,32,32,0.55)] hover:text-[#202020] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-[12px] leading-tight text-[rgba(32,32,32,0.35)]">
            &copy; {new Date().getFullYear()} CreatorFlow. All rights reserved.
          </p>
          <p className="text-[12px] leading-tight text-[rgba(32,32,32,0.35)]">
            Content Creator &amp; UGC Platform
          </p>
        </div>
      </div>
    </footer>
  )
}
