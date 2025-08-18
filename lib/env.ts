import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_ALCHEMY_API_KEY: z.string().optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_BASE_RPC_URL: z.string().url().default('https://mainnet.base.org'),
  NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: z.string().url().default('https://sepolia.base.org'),
})

export type Env = z.infer<typeof envSchema>

function createEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.warn('⚠️  Environment validation failed:', error)
    // Provide defaults for development
    return {
      NEXT_PUBLIC_BASE_RPC_URL: 'https://mainnet.base.org',
      NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: 'https://sepolia.base.org',
    }
  }
}

export const env = createEnv()

export function validateEnvironment(): { isValid: boolean; missingVars: string[] } {
  const requiredForProduction = [
    'NEXT_PUBLIC_ALCHEMY_API_KEY',
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS'
  ]

  const missingVars = requiredForProduction.filter(
    key => !process.env[key] || process.env[key] === 'your_key_here' || process.env[key] === 'your_project_id_here'
  )

  return {
    isValid: missingVars.length === 0,
    missingVars
  }
}

export function getEnvironmentStatus() {
  const { isValid, missingVars } = validateEnvironment()
  
  return {
    isValid,
    missingVars,
    isDevelopment: process.env.NODE_ENV === 'development',
    hasAlchemyKey: !!env.NEXT_PUBLIC_ALCHEMY_API_KEY && env.NEXT_PUBLIC_ALCHEMY_API_KEY !== 'your_alchemy_api_key_here',
    hasWalletConnectId: !!env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID && env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID !== 'your_walletconnect_project_id_here',
    hasContractAddress: !!env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS,
  }
} 