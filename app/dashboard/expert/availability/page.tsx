'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { TimeSlotPicker } from '@/components/time-slot-picker'
import { expertService } from '@/lib/api/expert-service'
import { type WeekdaySchedule } from '@/types/database'
import { useToast } from '@/components/ui/use-toast'

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [weeklySchedule, setWeeklySchedule] = useState<WeekdaySchedule[]>([])
  const { toast } = useToast()

  const handleSaveAvailability = async () => {
    try {
      // TODO: Get expert ID from auth context
      const { error } = await expertService.updateAvailability('expert_id', {
        weekday: weeklySchedule,
        exceptions: [],
      })
      
      if (error) throw error
      
      toast({
        title: 'Availability updated',
        description: 'Your availability schedule has been saved.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Availability</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'EEEE, MMMM d') : 'Select a date'}
          </h2>
          <TimeSlotPicker
            onChange={(slots) => {
              if (!selectedDate) return
              const day = selectedDate.getDay()
              setWeeklySchedule(prev => [
                ...prev.filter(schedule => schedule.day !== day),
                { day, slots }
              ])
            }}
          />
          
          <Button
            onClick={handleSaveAvailability}
            className="mt-4"
          >
            Save Availability
          </Button>
        </div>
      </div>
    </div>
  )
}