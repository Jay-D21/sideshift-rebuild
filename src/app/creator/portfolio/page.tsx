'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useAuth } from '@clerk/nextjs'
import type { Database } from '@/types/database'
import { Plus, ExternalLink, Grid } from 'lucide-react'

export default function PortfolioPage() {
  const { userId } = useAuth()
  const [items, setItems] = useState<string[]>([])
  const [showInput, setShowInput] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [creatorProfileId, setCreatorProfileId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    async function load() {
      const { data: profile } = await (supabase as any)
        .from('profiles')
        .select('id, creator_profiles(id, portfolio_items)')
        .eq('user_id', userId)
        .single()
      if (profile?.creator_profiles?.[0]) {
        setCreatorProfileId(profile.creator_profiles[0].id)
        setItems(profile.creator_profiles[0].portfolio_items || [])
      }
      setLoading(false)
    }
    load()
  }, [userId])

  const handleAdd = async () => {
    if (!newUrl.trim() || !creatorProfileId) return
    const updated = [...items, newUrl.trim()]
    setItems(updated)
    setNewUrl('')
    setShowInput(false)
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await (supabase as any).from('creator_profiles').update({ portfolio_items: updated }).eq('id', creatorProfileId)
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#202020]">Portfolio</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your best content to brands.</p>
        </div>
        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 bg-[#202020] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-black/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {showInput && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex gap-3">
          <input
            autoFocus
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Paste TikTok, Instagram, or YouTube URL..."
            className="flex-1 h-10 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-sm"
          />
          <button onClick={handleAdd} className="bg-[#202020] text-white px-4 rounded-lg text-sm font-bold">Add</button>
          <button onClick={() => setShowInput(false)} className="text-gray-400 hover:text-black px-2 text-sm">Cancel</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-500 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Grid className="h-7 w-7 text-gray-400" />
          </div>
          <p className="font-semibold text-[#202020]">No portfolio items yet</p>
          <p className="text-sm text-gray-500 mt-1">Add links to your TikTok, Instagram, or YouTube videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((url, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 hover:border-gray-300 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#202020] truncate">Item {i + 1}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{url}</p>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#3C83F9] transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
