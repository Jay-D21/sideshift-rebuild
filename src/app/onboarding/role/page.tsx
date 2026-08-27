'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { Building, User, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState<string | null>(null)

  const handleRoleSelect = async (role: 'brand' | 'creator') => {
    if (!user) return
    setLoading(role)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const clerkUserId = user.id
    const email = user.primaryEmailAddress?.emailAddress ?? ''
    const name = user.fullName ?? email.split('@')[0]

    // Upsert profile row
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({ user_id: clerkUserId, name, role, email }, { onConflict: 'user_id' })
      .select('id')
      .single()

    if (profileError || !profile) {
      console.error('Profile error:', profileError)
      setLoading(null)
      return
    }

    // Create the role-specific profile
    if (role === 'brand') {
      await supabase.from('brand_profiles').upsert(
        { profile_id: profile.id, user_id: clerkUserId, company_name: name },
        { onConflict: 'profile_id' }
      )
      router.push('/onboarding/brand')
    } else {
      await supabase.from('creator_profiles').upsert(
        { profile_id: profile.id, user_id: clerkUserId, username: name.toLowerCase().replace(/\s+/g, '_') },
        { onConflict: 'profile_id' }
      )
      router.push('/onboarding/creator')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center mb-10">
        <span className="text-2xl font-bold text-[#202020]">CreatorFlow</span>
        <h1 className="text-3xl font-bold mt-8 text-[#202020]">How will you use CreatorFlow?</h1>
        <p className="text-gray-500 mt-3">Choose your role to get the right experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <button
          onClick={() => handleRoleSelect('brand')}
          disabled={loading !== null}
          className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#202020] hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
        >
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#E0F5FF] transition-colors">
            {loading === 'brand' ? (
              <Loader2 className="h-7 w-7 text-[#202020] animate-spin" />
            ) : (
              <Building className="h-7 w-7 text-[#202020]" />
            )}
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">I'm a Brand</h2>
          <p className="text-sm text-gray-500 text-center">
            Post briefs, hire creators, and generate UGC for your marketing campaigns.
          </p>
        </button>

        <button
          onClick={() => handleRoleSelect('creator')}
          disabled={loading !== null}
          className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#202020] hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
        >
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#E0F5FF] transition-colors">
            {loading === 'creator' ? (
              <Loader2 className="h-7 w-7 text-[#202020] animate-spin" />
            ) : (
              <User className="h-7 w-7 text-[#202020]" />
            )}
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">I'm a Creator</h2>
          <p className="text-sm text-gray-500 text-center">
            Browse campaigns, apply to briefs, and get paid to create content.
          </p>
        </button>
      </div>
    </div>
  )
}