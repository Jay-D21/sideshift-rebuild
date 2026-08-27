import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/login')

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', userId)
    .single()

  if (!profile) redirect('/onboarding/role')
  if (profile.role === 'creator') redirect('/creator/explore')

  return <DashboardLayout>{children}</DashboardLayout>
}