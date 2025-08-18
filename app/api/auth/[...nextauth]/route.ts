import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { logAuth } from '../../../../utils/security-logger'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Log authentication attempt
      logAuth('attempt', { 
        email: user.email,
        name: user.name,
        provider: 'google'
      })

      // Only allow joesindel@gmail.com to sign in
      if (user.email === 'joesindel@gmail.com') {
        logAuth('success', { 
          email: user.email,
          name: user.name 
        })
        return true
      }
      
      // Log failed authentication
      logAuth('failure', { 
        email: user.email,
        reason: 'email_not_authorized',
        attemptedEmail: user.email 
      })
      
      return false
    },
    async session({ session }) {
      // Add any custom session data here
      return session
    },
    async jwt({ token }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // We'll create this page
  },
})

export { handler as GET, handler as POST }
