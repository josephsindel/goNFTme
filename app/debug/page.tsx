'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export default function DebugPage() {
  const [mounted, setMounted] = useState(false)
  const [storageInfo, setStorageInfo] = useState<Record<string, unknown> | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const { address, isConnected } = useAccount()

  useEffect(() => {
    setMounted(true)
    
    // Check localStorage
    try {
      const testKey = 'test-storage'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      
      // Get storage info
      const keys = Object.keys(localStorage)
      const imageKeys = keys.filter(key => key.startsWith('image-'))
      
      setStorageInfo({
        totalKeys: keys.length,
        imageKeys: imageKeys.length,
        storageSize: JSON.stringify(localStorage).length
      })
    } catch (error) {
      setErrors(prev => [...prev, `localStorage error: ${error}`])
    }

    // Check for other potential issues
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent
      const isRemote = window.location.hostname !== 'localhost'
      
      console.log('Debug info:', {
        userAgent,
        isRemote,
        hostname: window.location.hostname,
        protocol: window.location.protocol
      })
    }
  }, [])

  if (!mounted) {
    return <div>Loading debug info...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Connection Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="space-y-2 text-sm">
              <div>Wallet Connected: {isConnected ? '✅ Yes' : '❌ No'}</div>
              <div>Address: {address || 'Not connected'}</div>
              <div>Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Unknown'}</div>
              <div>Protocol: {typeof window !== 'undefined' ? window.location.protocol : 'Unknown'}</div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Storage Status</h2>
            <div className="space-y-2 text-sm">
              <div>Total localStorage keys: {storageInfo?.totalKeys || 0}</div>
              <div>Image keys: {storageInfo?.imageKeys || 0}</div>
              <div>Storage size: {Math.round((storageInfo?.storageSize || 0) / 1024)} KB</div>
            </div>
          </div>

          {/* Environment */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-2 text-sm">
              <div>Node.js: {typeof process !== 'undefined' ? 'Available' : 'Not available'}</div>
              <div>Browser: {typeof window !== 'undefined' ? 'Available' : 'SSR'}</div>
              <div>LocalStorage: {typeof localStorage !== 'undefined' ? 'Available' : 'Not available'}</div>
            </div>
          </div>

          {/* Errors */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Errors</h2>
            {errors.length > 0 ? (
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={`error-${error.slice(0, 20)}-${index}`} className="text-red-600 text-sm">{error}</div>
                ))}
              </div>
            ) : (
              <div className="text-green-600 text-sm">No errors detected</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('image-'))
                keys.forEach(key => localStorage.removeItem(key))
                window.location.reload()
              }}
              className="btn-secondary"
            >
              Clear Image Cache
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
