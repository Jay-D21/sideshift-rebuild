import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <SignUp />
    </div>
  )
}