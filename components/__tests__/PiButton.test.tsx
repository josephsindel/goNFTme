import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import PiButton from '../PiButton'

// Mock next-auth
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

describe('PiButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders π symbol', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<PiButton />)
    expect(screen.getByText('π')).toBeInTheDocument()
  })

  it('links to signin when not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<PiButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/auth/signin')
  })

  it('links to admin when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'Joe Sindel',
          email: 'joesindel@gmail.com'
        }
      },
      status: 'authenticated'
    })

    render(<PiButton />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/admin')
  })

  it('renders in fixed position container', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<PiButton />)
    const fixedContainer = screen.getByText('π').closest('.fixed')
    expect(fixedContainer).toBeInTheDocument()
    expect(fixedContainer).toHaveClass('fixed')
  })

  it('has correct text styling', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    })

    render(<PiButton />)
    const piSymbol = screen.getByText('π')
    expect(piSymbol).toHaveClass('text-gray-400', 'text-sm', 'select-none')
  })
})
