import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ShieldAlert } from "lucide-react"
import { useClerk } from '@clerk/clerk-react'

export const Route = createFileRoute('/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLoginAsAdmin = async () => {
    await signOut()
    router.navigate({ to: '/auth' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">

        <div className="flex justify-center">
          <ShieldAlert className="h-20 w-20 text-red-500 animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold">Access Denied</h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          You do not have permission to view this page.
          <span className="block mt-2 font-semibold text-red-400">
            Only Admins are allowed.
          </span>
        </p>


        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/"
            className="w-full rounded-xl bg-white/10 p-3 font-medium hover:bg-white/20 transition"
          >
            Go Back Home
          </Link>

          <button
            onClick={handleLoginAsAdmin}
            className="w-full rounded-xl bg-red-600 p-3 font-medium hover:bg-red-700 transition"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  )
}