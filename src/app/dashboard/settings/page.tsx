import { auth, currentUser } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { Save, Bell, Building2, UserCircle } from 'lucide-react'

export default async function SettingsPage() {
  const { userId } = await auth()
  const user = await currentUser()
  
  if (!userId || !user) {
    return <div>Not authenticated</div>
  }

  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} 
      }
    }
  )

  const { data: brand } = await (supabase as any)
    .from('brand_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  const email = user.emailAddresses[0]?.emailAddress || 'No email attached'

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account, company profile, and preferences.</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#202020] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Company Profile */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-[#202020]">Company Profile</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue={brand?.company_name || ''}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-gray-400"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input 
                  type="url" 
                  defaultValue={brand?.website || ''}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-gray-400"
                  placeholder="https://example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select 
                  defaultValue={brand?.industry || ''}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 text-sm outline-none focus:border-gray-400 bg-white"
                >
                  <option value="">Select an industry...</option>
                  <option value="technology">Technology & Software</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="beauty">Beauty & Cosmetics</option>
                  <option value="health">Health & Wellness</option>
                  <option value="food">Food & Beverage</option>
                  <option value="gaming">Gaming & Esports</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-[#202020]">Notification Preferences</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <div className="font-medium text-[#202020]">New Applications</div>
                <div className="text-sm text-gray-500">Get notified when creators apply to your campaigns.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#202020]"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <div className="font-medium text-[#202020]">Content Submissions</div>
                <div className="text-sm text-gray-500">Get notified when content is submitted for review.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#202020]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <div>
                <div className="font-medium text-[#202020]">New Messages</div>
                <div className="text-sm text-gray-500">Get notified when you receive a message from a creator.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#202020]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Account Details */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <UserCircle className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-bold text-[#202020]">Account details</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#202020]">Email Address</div>
                <div className="text-sm text-gray-500">{email}</div>
              </div>
              <a 
                href="/user-profile" 
                className="bg-white border border-gray-200 text-[#202020] px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Manage Account
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Authentication and account security are securely managed by Clerk.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}

