import { z } from 'zod'

// Campaign validation schema
export const campaignSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Title contains invalid characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()\n\r]+$/, 'Description contains invalid characters'),
  
  goalAmount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Goal amount must be a positive number')
    .refine((val) => Number(val) <= 1000, 'Goal amount cannot exceed 1000 ETH')
    .refine((val) => Number(val) >= 0.001, 'Goal amount must be at least 0.001 ETH'),
  
  recipientWallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
    .refine((addr) => addr !== '0x0000000000000000000000000000000000000000', 'Cannot use zero address'),
  
  imageUri: z
    .string()
    .max(500, 'Image URI too long')
    .optional()
})

// Donation validation schema
export const donationSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Donation amount must be positive')
    .refine((val) => Number(val) <= 100, 'Donation amount cannot exceed 100 ETH')
    .refine((val) => Number(val) >= 0.0001, 'Donation amount must be at least 0.0001 ETH'),
  
  campaignId: z
    .number()
    .int()
    .min(0, 'Invalid campaign ID')
})

// Address validation
export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')

// Sanitization functions
export function sanitizeString(input: string): string {
  if (!input) return ''
  
  // Remove potential XSS characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script references
    .trim()
}

export function sanitizeUrl(url: string): string {
  if (!url) return ''
  
  // Only allow http, https, and data URLs
  const allowedProtocols = /^(https?:|data:|ipfs:)/i
  
  if (!allowedProtocols.test(url)) {
    return ''
  }
  
  // Remove potential XSS in URLs
  return url
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .trim()
}

// Rate limiting helper (for future implementation)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map()
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isRateLimited(identifier: string): boolean {
    const now = Date.now()
    const attempts = this.attempts.get(identifier) || []
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs)
    
    if (validAttempts.length >= this.maxAttempts) {
      return true
    }
    
    // Add current attempt
    validAttempts.push(now)
    this.attempts.set(identifier, validAttempts)
    
    return false
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier)
  }
}

// Content Security Policy helper
export function getCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
}

// Validate file upload security
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only images are allowed.' }
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file extension.' }
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum 5MB allowed.' }
  }
  
  // Check for potential malicious filenames
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: 'Invalid filename.' }
  }
  
  return { valid: true }
}

// Environment validation for production
export function validateProductionEnvironment(): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
    issues.push('Missing NEXT_PUBLIC_ALCHEMY_API_KEY')
  }
  
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    issues.push('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
  }
  
  if (!process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS) {
    issues.push('Missing NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS')
  }
  
  // Check for default/example values
  if (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY === 'your_alchemy_api_key_here') {
    issues.push('NEXT_PUBLIC_ALCHEMY_API_KEY is still set to example value')
  }
  
  if (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID === 'your_walletconnect_project_id_here') {
    issues.push('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is still set to example value')
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
} 