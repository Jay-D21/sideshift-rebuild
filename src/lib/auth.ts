import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export async function signUp(email: string, password: string, role: 'brand' | 'creator', fullName: string) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
      }
    }
  })

  if (error) throw error
  if (!data.user) throw new Error('No user returned')

  // 2. Insert into profiles (handled by triggers if set up, or manual here)
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    email,
    full_name: fullName,
    role
  } as any)
  
  if (profileError && profileError.code !== '23505') {
    console.error('Profile creation error:', profileError)
  }

  // 3. Insert into specific role table
  if (role === 'brand') {
    await supabase.from('brand_profiles').insert({
      user_id: data.user.id,
      company_name: fullName // Default to full name initially
    } as any)
  } else {
    await supabase.from('creator_profiles').insert({
      user_id: data.user.id,
      username: fullName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      categories: [],
      social_links: {},
      follower_count: 0,
      total_earnings: 0,
      verified: false
    } as any)
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  await supabase.auth.signOut()
}
