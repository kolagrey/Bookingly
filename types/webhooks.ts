export interface PaystackEvent {
  event: string
  data: {
    id: number
    reference: string
    status: string
    amount: number
    currency: string
    transaction?: {
      reference: string
    }
    refund?: {
      reference: string
    }
  }
}

export interface StripeWebhookPayload {
  id: string
  object: string
  api_version: string
  created: number
  data: {
    object: Record<string, any>
  }
  livemode: boolean
  pending_webhooks: number
  request: {
    id: string | null
    idempotency_key: string | null
  }
  type: string
}