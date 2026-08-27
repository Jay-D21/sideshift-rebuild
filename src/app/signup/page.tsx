import Link from 'next/link'
import { Building, User } from 'lucide-react'

export default function SignupChoicePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl text-center mb-10">
        <Link href="/" className="text-2xl font-bold text-[#202020]">CreatorFlow</Link>
        <h1 className="text-3xl font-bold mt-8 text-[#202020]">Join CreatorFlow</h1>
        <p className="text-gray-500 mt-3">Choose how you want to use the platform.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Brand Card */}
        <Link href="/signup/brand" className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#202020] transition-colors">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#E0F5FF] transition-colors">
            <Building className="h-7 w-7 text-[#202020]" />
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">I'm a Brand</h2>
          <p className="text-sm text-gray-500 text-center">
            I want to post briefs, hire creators, and generate UGC for my marketing campaigns.
          </p>
        </Link>

        {/* Creator Card */}
        <Link href="/signup/creator" className="group flex flex-col items-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-[#202020] transition-colors">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#E0F5FF] transition-colors">
            <User className="h-7 w-7 text-[#202020]" />
          </div>
          <h2 className="text-xl font-bold text-[#202020] mb-2">I'm a Creator</h2>
          <p className="text-sm text-gray-500 text-center">
            I want to browse campaigns, apply to briefs, and get paid to create content.
          </p>
        </Link>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#202020] hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
