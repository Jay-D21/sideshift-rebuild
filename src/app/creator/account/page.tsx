'use client'

import { useUser, UserProfile } from '@clerk/nextjs'
import { Settings, Bell, Shield, Trash2, Mail, CheckCircle2 } from 'lucide-react'

export default function CreatorAccountPage() {
  const { user } = useUser()

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#202020]">Account & Security</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your login credentials, notifications, and account preferences.</p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#202020] flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          Clerk Authentication
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Primary Email</span>
            <p className="text-sm font-bold text-[#202020] mt-0.5">
              {user?.primaryEmailAddress?.emailAddress || 'Loading...'}
            </p>
          </div>
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#202020] flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            { title: 'New Brief Invitations', desc: 'Get notified immediately when a brand invites you to a paid campaign.' },
            { title: 'Application Status Updates', desc: 'Receive emails when your brief proposal is shortlisted or hired.' },
            { title: 'Escrow & Payout Alerts', desc: 'Alerts when brand funds are secured in escrow or released to your wallet.' },
          ].map((item) => (
            <label
              key={item.title}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50/60 cursor-pointer transition-colors"
            >
              <input type="checkbox" defaultChecked className="mt-1 accent-[#202020] rounded" />
              <div>
                <p className="text-xs font-bold text-[#202020]">{item.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-red-600 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Permanently delete your CreatorFlow creator profile and withdraw remaining wallet balance. This action is irreversible.
        </p>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg border border-red-200 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}
