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