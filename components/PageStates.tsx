'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Loading...' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

interface ErrorPageProps {
  title?: string
  message?: string
  showBackButton?: boolean
  backHref?: string
  backText?: string
}

export function ErrorPage({ 
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  showBackButton = true,
  backHref = '/',
  backText = 'Back to Home'
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md w-full px-4">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        {showBackButton && (
          <Link href={backHref} className="btn-primary">
            {backText}
          </Link>
        )}
      </div>
    </div>
  )
}

interface AuthCheckingProps {
  message?: string
}

export function AuthCheckingPage({ message = 'Checking authentication...' }: AuthCheckingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
