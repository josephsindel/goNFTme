import { render, screen } from '@testing-library/react'
import AuthProvider from '../AuthProvider'

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  )
}))

describe('AuthProvider', () => {
  it('renders children within SessionProvider', () => {
    render(
      <AuthProvider>
        <div>Test content</div>
      </AuthProvider>
    )
    
    expect(screen.getByTestId('session-provider')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('wraps multiple children correctly', () => {
    render(
      <AuthProvider>
        <div>First child</div>
        <div>Second child</div>
      </AuthProvider>
    )
    
    expect(screen.getByText('First child')).toBeInTheDocument()
    expect(screen.getByText('Second child')).toBeInTheDocument()
    expect(screen.getByTestId('session-provider')).toBeInTheDocument()
  })
})
