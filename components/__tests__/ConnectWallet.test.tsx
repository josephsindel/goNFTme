import { render, screen, waitFor } from '@testing-library/react'
import { ConnectWallet } from '../ConnectWallet'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

// Mock the wagmi hooks
jest.mock('wagmi')

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>
const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>
const mockUseDisconnect = useDisconnect as jest.MockedFunction<typeof useDisconnect>

describe('ConnectWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows connect buttons when not connected', async () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [
        { uid: '1', name: 'Coinbase Wallet' },
        { uid: '2', name: 'MetaMask' },
      ],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    
    await waitFor(() => {
      expect(screen.getByText('Connect Coinbase Wallet')).toBeInTheDocument()
      expect(screen.getByText('Connect MetaMask')).toBeInTheDocument()
    })
  })

  it('shows connected state when wallet is connected', async () => {
    const mockAddress = '0x1234567890123456789012345678901234567890'
    
    mockUseAccount.mockReturnValue({
      address: mockAddress,
      isConnected: true,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    
    await waitFor(() => {
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument()
    })
  })

  it('shows pending state when connecting', async () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [{ uid: '1', name: 'Coinbase Wallet' }],
      isPending: true,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    
    await waitFor(() => {
      expect(screen.getByText('Connecting...')).toBeInTheDocument()
    })
  })
}) 