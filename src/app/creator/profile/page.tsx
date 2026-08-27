'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { Save, User as UserIcon } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatarUrl: '',
    tiktok: '',
    instagram: '',
    youtube: '',
  })

  useEffect(() => {
    async function load() {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await (supabase as any)
          .from('creator_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
          setFormData({
            username: data.username || '',
            bio: data.bio || '',
            avatarUrl: data.avatar_url || '',
            tiktok: data.social_links?.tiktok || '',
            instagram: data.social_links?.instagram || '',
            youtube: data.social_links?.youtube || '',
          })
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && profile) {
      await (supabase as any).from('creator_profiles').update({
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatarUrl,
        social_links: {
          tiktok: formData.tiktok,
          instagram: formData.instagram,
          youtube: formData.youtube,
        }
      }).eq('id', profile.id)
    }
    setSaving(false)
    alert("Profile saved successfully!")
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public creator profile.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#202020] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h2 className="font-bold text-lg text-[#202020]">@{formData.username || 'username'}</h2>
            <div className="text-sm text-gray-500 mb-4 mt-1">
              {profile?.categories?.length ? profile.categories.join(' • ') : 'No niches set'}
            </div>
            
            <div className="w-full pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xl font-bold text-[#202020]">{profile?.follower_count || 0}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Followers</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#202020]">${profile?.total_earnings || 0}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold mt-1">Earned</div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-[#202020] mb-4">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 min-h-[100px] resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Avatar URL</label>
                <input
                  type="text"
                  value={formData.avatarUrl}
                  onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-[#202020] mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">TikTok</label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={e => setFormData({...formData, tiktok: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">Instagram</label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={e => setFormData({...formData, instagram: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#202020] mb-1">YouTube</label>
                <input
                  type="text"
                  value={formData.youtube}
                  onChange={e => setFormData({...formData, youtube: e.target.value})}
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
