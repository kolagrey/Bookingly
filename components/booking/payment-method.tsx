'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PaymentMethodProps {
  value: 'stripe' | 'paystack'
  onChange: (value: 'stripe' | 'paystack') => void
}

export function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className="space-y-4">
      <Label>Select Payment Method</Label>
      <RadioGroup
        value={value}
        onValueChange={(val) => onChange(val as 'stripe' | 'paystack')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe">Credit/Debit Card (Stripe)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paystack" id="paystack" />
          <Label htmlFor="paystack">Pay with Paystack</Label>
        </div>
      </RadioGroup>
    </div>
  )
}