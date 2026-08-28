'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth, useUser } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { Save, Bell, Shield, User, CreditCard, Users, Check, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  const { userId } = useAuth()
  const { user } = useUser()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('Company Profile')

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

  const tabs = ['Company Profile', 'Payment Plans', 'Payment Methods', 'Team Members', 'Notifications']

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Settings & Workspace</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your brand info, subscription plans, and team access.</p>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab ? 'bg-[#202020] text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Company Profile */}
      {activeTab === 'Company Profile' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-400" />
            <h2 className="font-bold text-[#202020]">Company Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Company Name</label>
              <input
                value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Website URL</label>
              <input
                value={form.website}
                onChange={e => setForm({ ...form, website: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
                placeholder="https://acme.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Industry</label>
              <select
                value={form.industry}
                onChange={e => setForm({ ...form, industry: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white text-sm"
              >
                <option value="">Select industry</option>
                {['ecommerce', 'saas', 'beauty', 'fitness', 'food', 'gaming', 'finance', 'other'].map(ind => (
                  <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Brief Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[80px] resize-none text-sm"
                placeholder="What does your company sell?"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#202020] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-black/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Tab: Payment Plans */}
      {activeTab === 'Payment Plans' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Current Plan
              </span>
              <h2 className="text-xl font-bold text-[#202020] mt-2">Free Trial (7 Days Left)</h2>
              <p className="text-xs text-gray-500 mt-1">Upgrade to unlock unlimited open briefs and AI brief scans.</p>
            </div>
            <button className="bg-[#202020] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black/90 transition-colors">
              Change Plan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border-2 border-[#202020] p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#202020]">Growth Tier</h3>
                <span className="text-xs font-bold text-blue-600">$99/mo</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Unlimited Campaign Briefs</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Full Access to Creator Directory</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dedicated UGC Account Manager</li>
              </ul>
              <button className="w-full bg-[#202020] text-white text-xs font-bold py-2 rounded-lg mt-2">
                Upgrade to Growth
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#202020]">Scale & Agency</h3>
                <span className="text-xs font-bold text-gray-600">$299/mo</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Everything in Growth</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Whitelisted Ads Rights on Meta & TikTok</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Custom Invoicing & Net 30 Terms</li>
              </ul>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-[#202020] text-xs font-bold py-2 rounded-lg mt-2">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Payment Methods */}
      {activeTab === 'Payment Methods' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-500" /> Payment Methods
          </h2>
          <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center space-y-2">
            <p className="text-xs text-gray-500">No payment method added yet.</p>
            <button className="bg-[#202020] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-black/90 transition-colors">
              + Add Credit Card
            </button>
          </div>
        </div>
      )}

      {/* Tab: Team Members */}
      {activeTab === 'Team Members' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#202020] flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> Team Access
            </h2>
            <button className="bg-[#202020] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              + Invite Member
            </button>
          </div>
          <div className="divide-y divide-gray-100 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#202020]">{user?.primaryEmailAddress?.emailAddress || 'Admin'}</p>
                <span className="text-[10px] text-gray-400">Owner</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-4 w-4 text-gray-400" />
            <h2 className="font-bold text-[#202020]">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'newApplications', label: 'New creator applications', desc: 'When a creator applies to your campaign' },
              { key: 'contentSubmissions', label: 'Content submissions', desc: 'When a creator submits content for review' },
              { key: 'weeklyDigest', label: 'Weekly performance digest', desc: 'Summary of your campaigns every Monday' },
              { key: 'marketing', label: 'Product updates & tips', desc: 'News from the CreatorFlow team' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50">
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
      )}
    </div>
  )
}
