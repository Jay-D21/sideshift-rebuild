import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

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
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}