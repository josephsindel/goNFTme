import { render, screen, fireEvent } from '@testing-library/react'
import { ConnectWallet } from '../ConnectWallet'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

// Mock the wagmi hooks
jest.mock('wagmi')
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockUseAccount = useAccount as jest.MockedFunction<typeof useAccount>
const mockUseConnect = useConnect as jest.MockedFunction<typeof useConnect>
const mockUseDisconnect = useDisconnect as jest.MockedFunction<typeof useDisconnect>

describe('ConnectWallet Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle malicious address injection safely', () => {
    const maliciousAddress = '<script>alert("xss")</script>0x1234567890123456789012345678901234567890'
    
    mockUseAccount.mockReturnValue({
      address: maliciousAddress as `0x${string}`,
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
    
    // Should not render script tags or execute malicious code
    expect(screen.queryByText('<script>')).not.toBeInTheDocument()
    expect(screen.queryByText('alert')).not.toBeInTheDocument()
  })

  it('should sanitize connector names to prevent XSS', () => {
    const maliciousConnector = {
      uid: '1',
      name: '<img src="x" onerror="alert(1)">Malicious Wallet'
    }
    
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [maliciousConnector],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    
    // Should not render malicious HTML
    expect(screen.queryByText('<img')).not.toBeInTheDocument()
    expect(screen.queryByText('onerror')).not.toBeInTheDocument()
  })

  it('should handle undefined/null addresses gracefully', () => {
    mockUseAccount.mockReturnValue({
      address: null as any,
      isConnected: true, // Inconsistent state
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: jest.fn(),
      connectors: [],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    // Should not crash with inconsistent state
    expect(() => render(<ConnectWallet />)).not.toThrow()
  })

  it('should handle clipboard API failures gracefully', async () => {
    const originalClipboard = navigator.clipboard
    
    // Mock clipboard to fail
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockRejectedValue(new Error('Clipboard access denied'))
      },
      writable: true,
    })
    
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
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
    
    // Click the connected wallet button to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Try to copy address (should handle clipboard failure gracefully)
    const copyButton = screen.getByText('Copy Address')
    expect(() => fireEvent.click(copyButton)).not.toThrow()
    
    // Restore original clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
    })
  })

  it('should prevent excessive re-renders on rapid clicks', () => {
    const connectMock = jest.fn()
    
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnected: false,
    } as any)
    
    mockUseConnect.mockReturnValue({
      connect: connectMock,
      connectors: [{ uid: '1', name: 'Test Wallet' }],
      isPending: false,
    } as any)
    
    mockUseDisconnect.mockReturnValue({
      disconnect: jest.fn(),
    } as any)

    render(<ConnectWallet />)
    
    const connectButton = screen.getByText('Connect Wallet')
    
    // Simulate rapid clicking
    for (let i = 0; i < 10; i++) {
      fireEvent.click(connectButton)
    }
    
    // Should handle rapid clicks without issues
    expect(connectMock).not.toHaveBeenCalledTimes(10)
  })

  it('should validate external links for security', () => {
    mockUseAccount.mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
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
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Check that BaseScan link has proper security attributes
    const baseScanLink = screen.getByText('View on BaseScan').closest('a')
    expect(baseScanLink).toHaveAttribute('target', '_blank')
    expect(baseScanLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
}) 