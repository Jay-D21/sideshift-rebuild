'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await signIn(email, password)
      // Redirect based on role
      const role = data.user?.user_metadata?.role
      if (role === 'creator') {
        router.push('/creator')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#202020]">CreatorFlow</Link>
          <h1 className="text-xl font-semibold mt-6 text-[#202020]">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your details to sign in.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-[15px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#202020] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-gray-200 outline-none focus:border-gray-400 text-[15px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-[#202020] text-white rounded-lg font-bold hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-[#202020] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
