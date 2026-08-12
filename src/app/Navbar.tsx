'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        SUSS Module Reviews
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm bg-black text-white px-3 py-1.5 rounded"
            >
              Log Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm bg-black text-white px-3 py-1.5 rounded"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  )
}