import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AuditLogEntry {
  userId?: string
  action: string
  resource: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, any>
}

export async function auditLog(entry: AuditLogEntry) {
  const supabase = createClientComponentClient()
  
  await supabase.from('audit_logs').insert({
    user_id: entry.userId,
    action: entry.action,
    resource: entry.resource,
    ip_address: entry.ip,
    user_agent: entry.userAgent,
    metadata: entry.metadata,
    created_at: new Date().toISOString(),
  })
}