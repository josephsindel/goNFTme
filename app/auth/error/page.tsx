'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An authentication error occurred.'
  
  if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You are not authorized to access this application.'
  } else if (error === 'OAuthSignin') {
    errorMessage = 'There was an error signing in with Google.'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-red-100 to-red-200 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {errorMessage}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-700">
              This application is restricted to authorized users only.
            </p>
            
            <div className="pt-4">
              <Link
                href="/"
                className="w-full flex justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Powered by{' '}
          <span className="logo-text text-sm">GoNFTme</span>
        </p>
      </div>
    </div>
  )
}
