// Security Event Logging System for OWASP A09 Compliance

interface SecurityEvent {
  timestamp: Date
  eventType: SecurityEventType
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  userAgent?: string
  ipAddress?: string
  userId?: string
  walletAddress?: string
  details: Record<string, any>
  sessionId?: string
}

type SecurityEventType = 
  | 'auth_attempt'
  | 'auth_success' 
  | 'auth_failure'
  | 'auth_logout'
  | 'validation_failure'
  | 'rate_limit_violation'
  | 'file_upload_attempt'
  | 'file_upload_rejected'
  | 'xss_attempt'
  | 'injection_attempt'
  | 'wallet_connection'
  | 'wallet_disconnection'
  | 'contract_interaction'
  | 'admin_action'
  | 'suspicious_activity'
  | 'error_boundary_triggered'

class SecurityLogger {
  private events: SecurityEvent[] = []
  private maxEvents = 1000 // Keep last 1000 events in memory
  private logToConsole = process.env.NODE_ENV === 'development'
  private logToStorage = true

  /**
   * Log a security event
   */
  logEvent(
    eventType: SecurityEventType,
    severity: SecurityEvent['severity'],
    source: string,
    details: Record<string, any> = {},
    additionalData?: Partial<SecurityEvent>
  ): void {
    const event: SecurityEvent = {
      timestamp: new Date(),
      eventType,
      severity,
      source,
      details: this.sanitizeDetails(details),
      userAgent: this.getUserAgent(),
      ipAddress: this.getClientIP(),
      sessionId: this.getSessionId(),
      ...additionalData
    }

    // Add to in-memory store
    this.events.push(event)
    
    // Maintain max events limit
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }

    // Log to console in development
    if (this.logToConsole) {
      console.log(`[SECURITY LOG - ${event.severity.toUpperCase()}]`, JSON.stringify(event, null, 2))
    }

    // Store persistently
    if (this.logToStorage) {
      this.persistEvent(event)
    }

    // Alert on critical events
    if (severity === 'critical') {
      this.alertCriticalEvent(event)
    }
  }

  /**
   * Log authentication events
   */
  logAuth(type: 'attempt' | 'success' | 'failure' | 'logout', details: Record<string, any> = {}): void {
    const eventType = `auth_${type}` as SecurityEventType
    const severity = type === 'failure' ? 'medium' : 'low'
    
    this.logEvent(eventType, severity, 'auth', {
      ...details,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Log validation failures (potential attacks)
   */
  logValidationFailure(field: string, value: string, reason: string, source: string): void {
    const details = {
      field,
      value: this.sanitizeValue(value), // Don't log full malicious payloads
      reason,
      possibleAttack: this.detectAttackType(value)
    }

    const severity = this.isLikelyAttack(value) ? 'high' : 'medium'
    
    this.logEvent('validation_failure', severity, source, details)
  }

  /**
   * Log rate limiting violations
   */
  logRateLimit(identifier: string, limit: number, attempts: number, source: string): void {
    this.logEvent('rate_limit_violation', 'medium', source, {
      identifier: this.sanitizeValue(identifier),
      limit,
      attempts,
      timeWindow: '60s'
    })
  }

  /**
   * Log wallet interactions
   */
  logWalletEvent(type: 'connection' | 'disconnection' | 'transaction', walletAddress?: string, details: Record<string, any> = {}): void {
    const eventType = type === 'transaction' ? 'contract_interaction' : `wallet_${type}` as SecurityEventType
    
    this.logEvent(eventType, 'low', 'wallet', details, {
      walletAddress: walletAddress ? this.sanitizeWalletAddress(walletAddress) : undefined
    })
  }

  /**
   * Log admin actions
   */
  logAdminAction(action: string, target: string, details: Record<string, any> = {}): void {
    this.logEvent('admin_action', 'medium', 'admin', {
      action,
      target,
      ...details
    })
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(description: string, evidence: Record<string, any>, source: string): void {
    this.logEvent('suspicious_activity', 'high', source, {
      description,
      evidence: this.sanitizeDetails(evidence)
    })
  }

  /**
   * Get recent security events
   */
  getEvents(limit = 100, severity?: SecurityEvent['severity']): SecurityEvent[] {
    let filteredEvents = this.events

    if (severity) {
      filteredEvents = this.events.filter(event => event.severity === severity)
    }

    return filteredEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  /**
   * Get security metrics
   */
  getMetrics(timeWindow = 24 * 60 * 60 * 1000): SecurityMetrics {
    const since = new Date(Date.now() - timeWindow)
    const recentEvents = this.events.filter(event => event.timestamp >= since)

    return {
      totalEvents: recentEvents.length,
      criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
      highSeverityEvents: recentEvents.filter(e => e.severity === 'high').length,
      authFailures: recentEvents.filter(e => e.eventType === 'auth_failure').length,
      validationFailures: recentEvents.filter(e => e.eventType === 'validation_failure').length,
      rateLimitViolations: recentEvents.filter(e => e.eventType === 'rate_limit_violation').length,
      suspiciousActivity: recentEvents.filter(e => e.eventType === 'suspicious_activity').length,
      timeWindow: `${timeWindow / (60 * 60 * 1000)}h`
    }
  }

  /**
   * Clear old events (for privacy compliance)
   */
  clearOldEvents(maxAge = 30 * 24 * 60 * 60 * 1000): number {
    const cutoff = new Date(Date.now() - maxAge)
    const initialCount = this.events.length
    this.events = this.events.filter(event => event.timestamp >= cutoff)
    return initialCount - this.events.length
  }

  // Private helper methods
  private sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeValue(value)
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = '[OBJECT]'
      } else {
        sanitized[key] = value
      }
    }
    
    return sanitized
  }

  private sanitizeValue(value: string): string {
    if (!value) return ''
    
    // Truncate long values and remove sensitive patterns
    const truncated = value.length > 100 ? value.substring(0, 100) + '...' : value
    
    return truncated
      .replace(/password|secret|key|token/gi, '[REDACTED]')
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD]') // Credit card numbers
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Email addresses
  }

  private sanitizeWalletAddress(address: string): string {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  private getUserAgent(): string {
    if (typeof window !== 'undefined') {
      return window.navigator.userAgent.substring(0, 200) // Truncate for storage
    }
    return 'server'
  }

  private getClientIP(): string {
    // In a real production environment, this would get the actual client IP
    // For now, return a placeholder since we're client-side
    return 'client-side'
  }

  private getSessionId(): string {
    // In a real implementation, this would get the actual session ID
    return 'session-placeholder'
  }

  private logToConsole(event: SecurityEvent): void {
    const emoji = this.getSeverityEmoji(event.severity)
    const color = this.getSeverityColor(event.severity)
    
    console.group(`${emoji} Security Event: ${event.eventType}`)
    console.log(`%c${event.severity.toUpperCase()}`, `color: ${color}; font-weight: bold`)
    console.log('Source:', event.source)
    console.log('Timestamp:', event.timestamp.toISOString())
    console.log('Details:', event.details)
    console.groupEnd()
  }

  private persistEvent(event: SecurityEvent): void {
    try {
      // Store in localStorage for demo (in production, send to logging service)
      const key = `security_event_${event.timestamp.getTime()}`
      const eventData = JSON.stringify(event)
      
      // Check localStorage quota
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(key, eventData)
          
          // Clean up old events to prevent quota issues
          this.cleanupStoredEvents()
        } catch (error) {
          console.warn('Failed to store security event:', error)
        }
      }
    } catch (error) {
      console.error('Security logging error:', error)
    }
  }

  private cleanupStoredEvents(): void {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage)
      const securityKeys = keys
        .filter(key => key.startsWith('security_event_'))
        .sort()

      // Keep only the most recent 100 events
      if (securityKeys.length > 100) {
        const toRemove = securityKeys.slice(0, securityKeys.length - 100)
        toRemove.forEach(key => localStorage.removeItem(key))
      }
    } catch (error) {
      console.warn('Failed to cleanup security events:', error)
    }
  }

  private alertCriticalEvent(event: SecurityEvent): void {
    console.error('🚨 CRITICAL SECURITY EVENT:', event)
    
    // In production, this would:
    // - Send immediate alerts to security team
    // - Trigger automated incident response
    // - Log to external security monitoring service
  }

  private detectAttackType(value: string): string[] {
    const attacks: string[] = []
    
    if (/<script|javascript:|on\w+=/i.test(value)) {
      attacks.push('XSS')
    }
    
    if (/union|select|insert|update|delete|drop/i.test(value)) {
      attacks.push('SQL_INJECTION')
    }
    
    if (/\.\.|\/etc\/|cmd|powershell/i.test(value)) {
      attacks.push('PATH_TRAVERSAL')
    }
    
    if (/eval\(|function\(|=>/i.test(value)) {
      attacks.push('CODE_INJECTION')
    }

    return attacks
  }

  private isLikelyAttack(value: string): boolean {
    return this.detectAttackType(value).length > 0
  }

  private getSeverityEmoji(severity: SecurityEvent['severity']): string {
    switch (severity) {
      case 'critical': return '🚨'
      case 'high': return '⚠️'
      case 'medium': return '🔶'
      case 'low': return 'ℹ️'
      default: return '📝'
    }
  }

  private getSeverityColor(severity: SecurityEvent['severity']): string {
    switch (severity) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#2563eb'
      default: return '#6b7280'
    }
  }
}

interface SecurityMetrics {
  totalEvents: number
  criticalEvents: number
  highSeverityEvents: number
  authFailures: number
  validationFailures: number
  rateLimitViolations: number
  suspiciousActivity: number
  timeWindow: string
}

// Singleton instance
export const securityLogger = new SecurityLogger()

// Convenience functions for common use cases
export const logAuth = securityLogger.logAuth.bind(securityLogger)
export const logValidationFailure = securityLogger.logValidationFailure.bind(securityLogger)
export const logRateLimit = securityLogger.logRateLimit.bind(securityLogger)
export const logWalletEvent = securityLogger.logWalletEvent.bind(securityLogger)
export const logAdminAction = securityLogger.logAdminAction.bind(securityLogger)
export const logSuspiciousActivity = securityLogger.logSuspiciousActivity.bind(securityLogger)

// Export types for other modules
export type { SecurityEvent, SecurityEventType, SecurityMetrics }
