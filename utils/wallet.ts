import { toast } from 'react-hot-toast'
import { logWalletEvent, logValidationFailure } from './security-logger'

// Common wallet connection validation
export function validateWalletConnection(isConnected: boolean, address?: string): boolean {
  if (!isConnected || !address) {
    logValidationFailure('wallet_connection', address || 'no_address', 'wallet_not_connected', 'wallet_validation')
    toast.error('Please connect your wallet first')
    return false
  }
  
  // Log successful wallet validation
  logWalletEvent('connection', address, { validated: true })
  return true
}

// Common contract interaction error handler
export function handleContractError(error: unknown, operation: string): void {
  console.error(`${operation} error:`, error)
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  toast.error(`${operation} failed: ${errorMessage}`)
}

// Common transaction success handler
export function handleTransactionSuccess(message: string, onSuccess?: () => void): void {
  toast.success(message)
  if (onSuccess) {
    setTimeout(onSuccess, 2000)
  }
}

// Common loading toast helper
export function showLoadingToast(message: string, id?: string): void {
  toast.loading(message, id ? { id } : undefined)
}
