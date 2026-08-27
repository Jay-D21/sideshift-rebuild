'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth, useUser } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { Save, Bell, Shield, User } from 'lucide-react'

export default function SettingsPage() {
  const { userId } = useAuth()
  const { user } = useUser()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    companyName: '',
    website: '',
    industry: '',
    description: '',
  })

  const [notifications, setNotifications] = useState({
    newApplications: true,
    contentSubmissions: true,
    weeklyDigest: false,
    marketing: false,
  })

  useEffect(() => {
    if (!userId) return
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function load() {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, brand_profiles(*)')
        .eq('user_id', userId)
        .single()
      if (profile?.brand_profiles?.[0]) {
        const bp = profile.brand_profiles[0]
        setForm({
          companyName: bp.company_name || '',
          website: bp.website || '',
          industry: bp.industry || '',
          description: bp.description || '',
        })
      }
    }
    load()
  }, [userId])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('id, brand_profiles(id)')
      .eq('user_id', userId)
      .single()
    if (profile?.brand_profiles?.[0]?.id) {
      await (supabase as any).from('brand_profiles').update({
        company_name: form.companyName,
        website: form.website,
        industry: form.industry,
        description: form.description,
      }).eq('id', profile.brand_profiles[0].id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#3C83F9]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#202020]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Company Profile */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-4 w-4 text-gray-400" />
          <h2 className="font-bold text-[#202020]">Company Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Company Name</label>
            <input
              value={form.companyName}
              onChange={e => setForm({ ...form, companyName: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Website</label>
            <input
              value={form.website}
              onChange={e => setForm({ ...form, website: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
              placeholder="https://acme.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Industry</label>
            <select
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white"
            >
              <option value="">Select industry</option>
              {['ecommerce', 'saas', 'beauty', 'fitness', 'food', 'gaming', 'finance', 'other'].map(ind => (
                <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[80px] resize-none"
              placeholder="What does your company do?"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#202020] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-4 w-4 text-gray-400" />
          <h2 className="font-bold text-[#202020]">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'newApplications', label: 'New creator applications', desc: 'When a creator applies to your campaign' },
            { key: 'contentSubmissions', label: 'Content submissions', desc: 'When a creator submits content for review' },
            { key: 'weeklyDigest', label: 'Weekly performance digest', desc: 'Summary of your campaigns every Monday' },
            { key: 'marketing', label: 'Product updates & tips', desc: 'News from the CreatorFlow team' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#202020]">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Toggle
                checked={notifications[item.key as keyof typeof notifications]}
                onChange={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof notifications] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="h-4 w-4 text-gray-400" />
          <h2 className="font-bold text-[#202020]">Account</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-[#202020]">{user?.emailAddresses?.[0]?.emailAddress || '—'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Account ID</span>
            <span className="font-mono text-xs text-gray-400">{userId?.slice(0, 20)}...</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Member since</span>
            <span className="font-medium text-[#202020]">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
