'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type TimeSlot } from '@/types/database'

interface TimeSlotPickerProps {
  onChange: (slots: TimeSlot[]) => void
}

export function TimeSlotPicker({ onChange }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])

  const addSlot = () => {
    const newSlot: TimeSlot = {
      start: '09:00',
      end: '17:00',
    }
    const updatedSlots = [...slots, newSlot]
    setSlots(updatedSlots)
    onChange(updatedSlots)
  }

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = slots.map((slot, i) => {
      if (i === index) {
        return { ...slot, [field]: value }
      }
      return slot
    })
    setSlots(updatedSlots)
    onChange(updatedSlots)
  }

  const removeSlot = (index: number) => {
    const updatedSlots = slots.filter((_, i) => i !== index)
    setSlots(updatedSlots)
    onChange(updatedSlots)
  }

  return (
    <div className="space-y-4">
      {slots.map((slot, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            type="time"
            value={slot.start}
            onChange={(e) => updateSlot(index, 'start', e.target.value)}
            className="w-32"
          />
          <span>to</span>
          <Input
            type="time"
            value={slot.end}
            onChange={(e) => updateSlot(index, 'end', e.target.value)}
            className="w-32"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeSlot(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      
      <Button
        variant="outline"
        onClick={addSlot}
        className="w-full"
      >
        Add Time Slot
      </Button>
    </div>
  )
}