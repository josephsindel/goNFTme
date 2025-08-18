'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function PiButton() {
  const { data: session } = useSession()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={session ? '/admin' : '/auth/signin'}
        className="group"
      >
        {/* Pi Button */}
        <div className="w-8 h-8 flex items-center justify-center transition-all duration-200 group-hover:scale-105">
          <span className="text-gray-400 hover:text-gray-600 text-sm select-none transition-colors duration-200">π</span>
        </div>
      </Link>
    </div>
  )
}
